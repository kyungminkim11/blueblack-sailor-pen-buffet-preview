-- Protect internal product, inventory and nib data behind the validated admin session.
-- Applied to Supabase project jnciddblcndmthmmvqrz on 2026-07-12.

create or replace function public.internal_catalog_session_product_status(p_session text)
returns table(item_count integer, updated_at timestamptz, info_updated_at timestamptz, stock_updated_at timestamptz)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  return query select * from public.internal_product_status_public();
end;
$$;

create or replace function public.internal_catalog_session_product_search(p_session text, p_query text, p_limit integer default 30)
returns table(id bigint, item_code text, barcode text, manufacturer text, product_name text, product_type text, consumer_price numeric, sale_price numeric, store_price numeric, stock_qty numeric, location text, note text, info_updated_at timestamptz, stock_updated_at timestamptz)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_product_search_public(p_query, p_limit);
end;
$$;

create or replace function public.internal_catalog_session_product_search_filtered(
  p_session text, p_query text, p_limit integer, p_sort text, p_min_price numeric,
  p_max_price numeric, p_nibs text[], p_stock text, p_brand text, p_product_type text
)
returns table(id bigint, item_code text, barcode text, manufacturer text, product_name text, product_type text, consumer_price numeric, sale_price numeric, store_price numeric, stock_qty numeric, location text, note text, info_updated_at timestamptz, stock_updated_at timestamptz)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_product_search_filtered_public(p_query, p_limit, p_sort, p_min_price, p_max_price, p_nibs, p_stock, p_brand, p_product_type);
end;
$$;

create or replace function public.internal_catalog_session_product_search_filtered_v2(
  p_session text, p_query text, p_limit integer, p_sort text, p_min_price numeric,
  p_max_price numeric, p_nibs text[], p_stock text, p_brand text, p_product_type text,
  p_nib_material text
)
returns table(id bigint, item_code text, barcode text, manufacturer text, product_name text, product_type text, consumer_price numeric, sale_price numeric, store_price numeric, stock_qty numeric, location text, note text, info_updated_at timestamptz, stock_updated_at timestamptz, nib_material text, nib_material_label text)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_product_search_filtered_v2_public(p_query, p_limit, p_sort, p_min_price, p_max_price, p_nibs, p_stock, p_brand, p_product_type, p_nib_material);
end;
$$;

create or replace function public.internal_catalog_session_product_search_filtered_v3(
  p_session text, p_query text, p_limit integer, p_sort text, p_min_price numeric,
  p_max_price numeric, p_nibs text[], p_stock text, p_brand text, p_product_type text,
  p_nib_material text, p_gold_karat text
)
returns table(id bigint, item_code text, barcode text, manufacturer text, product_name text, product_type text, consumer_price numeric, sale_price numeric, store_price numeric, stock_qty numeric, location text, note text, info_updated_at timestamptz, stock_updated_at timestamptz, nib_material text, nib_material_label text, nib_karat text)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_product_search_filtered_v3_public(p_query, p_limit, p_sort, p_min_price, p_max_price, p_nibs, p_stock, p_brand, p_product_type, p_nib_material, p_gold_karat);
end;
$$;

create or replace function public.internal_catalog_session_product_search_with_nib(p_session text, p_query text, p_limit integer default 30)
returns table(id bigint, item_code text, barcode text, manufacturer text, product_name text, product_type text, consumer_price numeric, sale_price numeric, store_price numeric, stock_qty numeric, location text, note text, info_updated_at timestamptz, stock_updated_at timestamptz, nib_material text, nib_material_label text)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_product_search_with_nib_public(p_query, p_limit);
end;
$$;

create or replace function public.internal_catalog_session_product_search_with_nib_v2(p_session text, p_query text, p_limit integer default 30)
returns table(id bigint, item_code text, barcode text, manufacturer text, product_name text, product_type text, consumer_price numeric, sale_price numeric, store_price numeric, stock_qty numeric, location text, note text, info_updated_at timestamptz, stock_updated_at timestamptz, nib_material text, nib_material_label text, nib_karat text)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_product_search_with_nib_v2_public(p_query, p_limit);
end;
$$;

create or replace function public.internal_catalog_session_product_no_barcode(p_session text, p_query text, p_limit integer default 50)
returns table(id bigint, item_code text, manufacturer text, product_name text, product_type text, consumer_price numeric, stock_qty numeric, location text, note text, info_updated_at timestamptz, stock_updated_at timestamptz)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_product_no_barcode_public(p_query, p_limit);
end;
$$;

create or replace function public.internal_catalog_session_product_no_barcode_count(p_session text)
returns integer
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return public.internal_product_no_barcode_count_public();
end;
$$;

create or replace function public.internal_catalog_session_fountain_pen_brand_summary(p_session text)
returns table(manufacturer text, product_count integer, in_stock_count integer)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_fountain_pen_brand_summary_public();
end;
$$;

create or replace function public.internal_catalog_session_fountain_pen_nib_material_summary(p_session text)
returns table(nib_material text, nib_material_label text, product_count integer, in_stock_count integer)
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query select * from public.internal_fountain_pen_nib_material_summary_public();
end;
$$;

create or replace function public.internal_catalog_session_nib_search(
  p_session text, p_nib_sizes text[], p_query text default '', p_limit integer default 5000
)
returns table(id bigint, item_code text, product_name text, location text, nib_sizes text[])
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if not public.internal_catalog_update_session_ok(p_session) then raise exception 'not authorized' using errcode = '42501'; end if;
  return query
  select p.id, p.item_code, p.product_name, p.location, p.nib_sizes
  from public.internal_nib_products p
  where cardinality(coalesce(p_nib_sizes, '{}')) > 0
    and p.nib_sizes && p_nib_sizes
    and (
      nullif(trim(coalesce(p_query, '')), '') is null
      or p.product_name ilike '%' || trim(p_query) || '%'
      or coalesce(p.item_code, '') ilike '%' || trim(p_query) || '%'
      or coalesce(p.location, '') ilike '%' || trim(p_query) || '%'
    )
  order by p.product_name
  limit greatest(1, least(coalesce(p_limit, 5000), 5000));
end;
$$;

revoke all on function public.internal_product_status_public() from public, anon, authenticated;
revoke all on function public.internal_product_search_public(text, integer) from public, anon, authenticated;
revoke all on function public.internal_product_search_filtered_public(text, integer, text, numeric, numeric, text[], text, text, text) from public, anon, authenticated;
revoke all on function public.internal_product_search_filtered_v2_public(text, integer, text, numeric, numeric, text[], text, text, text, text) from public, anon, authenticated;
revoke all on function public.internal_product_search_filtered_v3_public(text, integer, text, numeric, numeric, text[], text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.internal_product_search_with_nib_public(text, integer) from public, anon, authenticated;
revoke all on function public.internal_product_search_with_nib_v2_public(text, integer) from public, anon, authenticated;
revoke all on function public.internal_product_no_barcode_public(text, integer) from public, anon, authenticated;
revoke all on function public.internal_product_no_barcode_count_public() from public, anon, authenticated;
revoke all on function public.internal_fountain_pen_brand_summary_public() from public, anon, authenticated;
revoke all on function public.internal_fountain_pen_nib_material_summary_public() from public, anon, authenticated;
revoke all on function public.internal_product_import_frontcoded(jsonb) from public, anon, authenticated;

grant execute on function public.internal_catalog_session_product_status(text) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_search(text, text, integer) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_search_filtered(text, text, integer, text, numeric, numeric, text[], text, text, text) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_search_filtered_v2(text, text, integer, text, numeric, numeric, text[], text, text, text, text) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_search_filtered_v3(text, text, integer, text, numeric, numeric, text[], text, text, text, text, text) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_search_with_nib(text, text, integer) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_search_with_nib_v2(text, text, integer) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_no_barcode(text, text, integer) to anon, authenticated;
grant execute on function public.internal_catalog_session_product_no_barcode_count(text) to anon, authenticated;
grant execute on function public.internal_catalog_session_fountain_pen_brand_summary(text) to anon, authenticated;
grant execute on function public.internal_catalog_session_fountain_pen_nib_material_summary(text) to anon, authenticated;
grant execute on function public.internal_catalog_session_nib_search(text, text[], text, integer) to anon, authenticated;
