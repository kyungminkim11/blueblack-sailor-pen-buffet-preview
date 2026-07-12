alter function public.internal_nib_material_code(text, text, text)
set search_path = public, pg_temp;

alter function public.internal_nib_material_label(text)
set search_path = public, pg_temp;

alter function public.internal_gold_karat_code(text, text, text)
set search_path = public, pg_temp;

alter function public.set_updated_at()
set search_path = public, pg_temp;
