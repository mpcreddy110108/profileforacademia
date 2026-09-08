import type { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title?: string | undefined;
  subtitle?: string | undefined;
  right?: ReactNode | undefined;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface-container-lowest shadow-sm border border-outline-variant ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between gap-unit-4 px-unit-4 py-unit-3 border-b border-outline-variant bg-surface-container-low">
          <div>
            {title && <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>}
            {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className="p-unit-4">{children}</div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow: string;
  title: string;
  description: string;
  right?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-unit-4 mb-unit-6">
      <div>
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">{eyebrow}</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">{title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">{description}</p>
      </div>
      {right}
    </div>
  );
}

export function Bar({ value, target, tone = "primary" }: { value: number; target?: number | undefined; tone?: "primary" | "secondary" | "error" }) {
  const color = tone === "error" ? "bg-error" : tone === "secondary" ? "bg-secondary" : "bg-primary";
  return (
    <div className="relative h-2 w-full bg-surface-container-high">
      <div className={`h-2 ${color}`} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      {target != null && (
        <span
          className="absolute top-[-3px] h-3.5 w-0.5 bg-on-surface"
          style={{ left: `${Math.min(100, target)}%` }}
          title={`Required ${target}%`}
        />
      )}
    </div>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "bad" | "warn" | "info" }) {
  const map = {
    neutral: "bg-surface-container text-on-surface-variant",
    good: "bg-secondary-container text-on-secondary-container",
    bad: "bg-error-container text-on-error-container",
    warn: "bg-surface-container-highest text-on-tertiary-container",
    info: "bg-primary-container text-on-primary-container",
  } as const;
  return (
    <span className={`inline-block font-label-sm text-label-sm px-unit-2 py-0.5 font-semibold ${map[tone]}`}>{children}</span>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string | undefined; tone?: "good" | "bad" | undefined }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-unit-4">
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</span>
      <div className={`font-headline-md text-headline-md mt-1 ${tone === "bad" ? "text-error" : tone === "good" ? "text-secondary" : "text-on-surface"}`}>{value}</div>
      {hint && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );
}

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="py-unit-8 text-center font-body-sm text-body-sm text-on-surface-variant">{text}</div>
  );
}

export function Explain({ children }: { children: ReactNode }) {
  return (
    <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low border-l-2 border-primary px-unit-3 py-unit-2">
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary mr-2">Why</span>
      {children}
    </p>
  );
}

export const inputCls =
  "w-full bg-surface-container-low border border-outline-variant px-unit-3 py-unit-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary";
export const btnPrimary =
  "inline-flex items-center gap-unit-2 px-unit-4 py-unit-2 bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 disabled:opacity-40";
export const btnGhost =
  "inline-flex items-center gap-unit-2 px-unit-3 py-unit-2 border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:text-on-surface hover:bg-surface-container";
