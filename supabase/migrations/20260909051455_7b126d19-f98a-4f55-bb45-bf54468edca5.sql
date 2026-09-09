alter table public.opportunities add column stipend text not null default '';
update public.opportunities set stipend = '₹35,000 / month' where is_demo;