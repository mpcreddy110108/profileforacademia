-- roles
create type public.app_role as enum ('student','recruiter','institution','mentor');
create type public.evidence_type as enum ('project','certification','internship','resume','assessment');
create type public.verification_status as enum ('self-reported','peer-reviewed','institution-verified');
create type public.application_status as enum ('saved','applied','shortlisted','interview','selected','rejected');
create type public.review_action as enum ('approved','rejected','changes-requested');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "insert own role" on public.user_roles for insert to authenticated with check (auth.uid() = user_id);

-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  college text not null default '',
  degree text not null default '',
  branch text not null default '',
  semester text not null default '',
  specialisation text not null default '',
  target_role_id text not null default 'ml-intern',
  github_url text,
  linkedin_url text,
  weekly_hours integer not null default 6,
  photo_url text,
  onboarded boolean not null default false,
  is_demo boolean not null default false,
  visible_to_recruiters boolean not null default true,
  resume_visible boolean not null default false,
  evidence_visible boolean not null default true,
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "recruiters read visible profiles" on public.profiles for select to authenticated
  using (visible_to_recruiters and (public.has_role(auth.uid(),'recruiter') or public.has_role(auth.uid(),'institution') or public.has_role(auth.uid(),'mentor')));

-- evidence
create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type evidence_type not null,
  title text not null,
  description text not null default '',
  skills text[] not null default '{}',
  verification verification_status not null default 'self-reported',
  outcome text,
  url text,
  occurred_on date,
  file_path text,
  score integer,
  source text not null default 'manual',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.evidence to authenticated;
grant all on public.evidence to service_role;
alter table public.evidence enable row level security;
create policy "own evidence" on public.evidence for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviewers read shared evidence" on public.evidence for select to authenticated
  using (
    (public.has_role(auth.uid(),'mentor') or public.has_role(auth.uid(),'institution') or public.has_role(auth.uid(),'recruiter'))
    and exists (select 1 from public.profiles p where p.id = evidence.user_id and p.evidence_visible)
  );
create policy "mentors update verification" on public.evidence for update to authenticated
  using (public.has_role(auth.uid(),'mentor') or public.has_role(auth.uid(),'institution'))
  with check (public.has_role(auth.uid(),'mentor') or public.has_role(auth.uid(),'institution'));

-- evidence reviews
create table public.evidence_reviews (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid not null references public.evidence(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  action review_action not null,
  comment text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert on public.evidence_reviews to authenticated;
grant all on public.evidence_reviews to service_role;
alter table public.evidence_reviews enable row level security;
create policy "owner reads reviews" on public.evidence_reviews for select to authenticated
  using (exists (select 1 from public.evidence e where e.id = evidence_id and e.user_id = auth.uid()));
create policy "reviewers read reviews" on public.evidence_reviews for select to authenticated
  using (public.has_role(auth.uid(),'mentor') or public.has_role(auth.uid(),'institution'));
create policy "reviewers write reviews" on public.evidence_reviews for insert to authenticated
  with check (reviewer_id = auth.uid() and (public.has_role(auth.uid(),'mentor') or public.has_role(auth.uid(),'institution')));

-- learning progress
create table public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, skill)
);
grant select, insert, update, delete on public.learning_progress to authenticated;
grant all on public.learning_progress to service_role;
alter table public.learning_progress enable row level security;
create policy "own progress" on public.learning_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "institution reads progress" on public.learning_progress for select to authenticated using (public.has_role(auth.uid(),'institution'));

-- opportunities
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid references auth.users(id) on delete set null,
  title text not null,
  org text not null,
  location text not null default 'Remote',
  kind text not null default 'Internship',
  description text not null default '',
  required jsonb not null default '[]'::jsonb,
  preferred text[] not null default '{}',
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.opportunities to authenticated;
grant all on public.opportunities to service_role;
alter table public.opportunities enable row level security;
create policy "signed in read opportunities" on public.opportunities for select to authenticated using (true);
create policy "recruiter manages own postings" on public.opportunities for all to authenticated
  using (posted_by = auth.uid()) with check (posted_by = auth.uid());

-- applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  status application_status not null default 'saved',
  history jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
grant select, insert, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "own applications" on public.applications for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recruiter reads applications to own postings" on public.applications for select to authenticated
  using (exists (select 1 from public.opportunities o where o.id = opportunity_id and o.posted_by = auth.uid()));

-- shortlists
create table public.shortlists (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  student_id text not null,
  recruiter_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (opportunity_id, student_id, recruiter_id)
);
grant select, insert, delete on public.shortlists to authenticated;
grant all on public.shortlists to service_role;
alter table public.shortlists enable row level security;
create policy "recruiter manages own shortlists" on public.shortlists for all to authenticated
  using (recruiter_id = auth.uid()) with check (recruiter_id = auth.uid());

-- updated_at helper
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger evidence_touch before update on public.evidence for each row execute function public.touch_updated_at();

-- new user bootstrap
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data->>'role')::app_role, 'student'))
  on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- demo opportunities
insert into public.opportunities (title, org, location, kind, description, required, preferred, is_demo) values
('ML Engineering Intern','Nexus Analytics','Bengaluru (Hybrid)','Internship','Work on model training pipelines and evaluation tooling for a forecasting product.','[{"skill":"python","min":75},{"skill":"ml","min":70},{"skill":"pytorch","min":60},{"skill":"stats","min":55}]','{"pandas","numpy","docker"}',true),
('Data Analyst Intern','Meridian Retail','Hyderabad','Internship','Build SQL models and dashboards for merchandising teams.','[{"skill":"sql","min":75},{"skill":"viz","min":65},{"skill":"stats","min":55}]','{"python","excel","bi"}',true),
('Python Backend Intern','Aeris Softworks','Pune','Internship','Ship REST services and containerised jobs for an inventory platform.','[{"skill":"python","min":70},{"skill":"rest","min":60},{"skill":"sql","min":55}]','{"docker","git","linux"}',true),
('Full Stack Developer Trainee','Cobalt Labs','Remote','Trainee','Build product features across a React + Node stack.','[{"skill":"react","min":70},{"skill":"typescript","min":65},{"skill":"node","min":60},{"skill":"rest","min":55}]','{"mongo","git"}',true),
('Applied NLP Intern','Lumen AI','Remote','Internship','Prototype text classification and retrieval features.','[{"skill":"python","min":75},{"skill":"nlp","min":65},{"skill":"ml","min":65}]','{"pytorch","pandas"}',true);