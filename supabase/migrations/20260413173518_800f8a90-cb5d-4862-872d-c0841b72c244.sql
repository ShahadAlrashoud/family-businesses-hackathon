
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  chosen_role app_role;
BEGIN
  -- Read role from signup metadata, default to shareholder
  chosen_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'shareholder'::app_role
  );

  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, chosen_role);

  RETURN NEW;
END;
$function$;
