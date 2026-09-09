create policy "own evidence files read" on storage.objects for select to authenticated
  using (bucket_id = 'evidence' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "own evidence files write" on storage.objects for insert to authenticated
  with check (bucket_id = 'evidence' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "own evidence files update" on storage.objects for update to authenticated
  using (bucket_id = 'evidence' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "own evidence files delete" on storage.objects for delete to authenticated
  using (bucket_id = 'evidence' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "reviewers read evidence files" on storage.objects for select to authenticated
  using (
    bucket_id = 'evidence'
    and (public.has_role(auth.uid(),'mentor') or public.has_role(auth.uid(),'institution'))
    and exists (
      select 1 from public.profiles p
      where p.id::text = (storage.foldername(name))[1] and p.evidence_visible
    )
  );