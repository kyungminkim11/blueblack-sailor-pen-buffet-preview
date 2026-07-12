-- Remove obsolete public nib search paths after moving the admin UI to
-- internal_catalog_session_nib_search, which validates the admin session.

revoke all on function public.public_nib_search(text[], text, integer)
from public, anon, authenticated;

revoke all on function public.public_nib_search_open(text, text[], text, integer)
from public, anon, authenticated;

-- Event trigger functions do not need to be exposed through the REST API.
revoke all on function public.rls_auto_enable()
from public, anon, authenticated;

-- Keep the retired importer out of mutable search-path warnings as well.
alter function public.internal_product_import_frontcoded(jsonb)
set search_path = public, pg_temp;
