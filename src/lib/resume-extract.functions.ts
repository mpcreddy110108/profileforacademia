import { createServerFn } from "@tanstack/react-start";

import { SKILLS } from "./domain/catalog";

export type ExtractedItem = {
  type: "project" | "internship" | "course" | "certification" | "opensource" | "hackathon" | "publication";
  title: string;
  description: string;
  skills: string[];
  depth_score: number;
  verification_status: "self";
};

const SKILL_LIST = SKILLS.map((s) => `${s.id} (${s.name})`).join(", ");

const SYSTEM = `You extract structured evidence items from a student's resume for a competency-scoring system.

Return ONLY items with clear textual evidence in the resume. Never invent projects, internships, employers, or skills.

Skill ids MUST come from this fixed catalog (use the id, not the name): ${SKILL_LIST}.
Drop any skill that is not in the catalog. Only attach a skill to an item when the resume clearly links it to that item.

depth_score (1-10):
- 7-10: substantial real projects, internships, or work with concrete detail/outcomes
- 5-6: coursework, hackathons, small but described projects, certifications with detail
- 1-4: skills merely listed or mentioned in passing

verification_status is always "self".`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "title", "description", "skills", "depth_score", "verification_status"],
        properties: {
          type: {
            type: "string",
            enum: ["project", "internship", "course", "certification", "opensource", "hackathon", "publication"],
          },
          title: { type: "string" },
          description: { type: "string" },
          skills: { type: "array", items: { type: "string" } },
          depth_score: { type: "number" },
          verification_status: { type: "string", enum: ["self"] },
        },
      },
    },
  },
} as const;

export const extractResumeEvidence = createServerFn({ method: "POST" })
  .inputValidator((input: { text: string }) => {
    const text = (input?.text ?? "").trim();
    if (text.length < 40) throw new Error("Resume text is too short to analyse.");
    return { text: text.slice(0, 40000) };
  })
  .handler(async ({ data }): Promise<{ items: ExtractedItem[] }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low" },
        instructions: SYSTEM,
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: `Resume:\n\n${data.text}` }],
          },
        ],
        text: { format: { type: "json_schema", name: "resume_evidence", strict: true, schema: SCHEMA } },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("AI is busy right now. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
      throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let out = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload) as { type?: string; delta?: string; response?: { output_text?: string } };
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") out += evt.delta;
          else if (evt.type === "response.completed" && !out && evt.response?.output_text) out = evt.response.output_text;
        } catch {
          /* ignore partial frames */
        }
      }
    }

    const valid = new Set(SKILLS.map((s) => s.id));
    let items: ExtractedItem[] = [];
    try {
      const parsed = JSON.parse(out) as { items?: ExtractedItem[] };
      items = Array.isArray(parsed.items) ? parsed.items : [];
    } catch {
      throw new Error("The AI response could not be read. Try again.");
    }

    return {
      items: items
        .filter((i) => i && typeof i.title === "string" && i.title.trim().length > 0)
        .map((i) => ({
          type: i.type,
          title: i.title.trim().slice(0, 160),
          description: (i.description ?? "").trim().slice(0, 1200),
          skills: (Array.isArray(i.skills) ? i.skills : []).filter((s) => valid.has(s)),
          depth_score: Math.max(1, Math.min(10, Math.round(Number(i.depth_score) || 1))),
          verification_status: "self" as const,
        })),
    };
  });
