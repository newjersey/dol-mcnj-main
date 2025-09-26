-- Rollback database data loading
-- This removes all data inserted by the up migration

TRUNCATE TABLE public.blsoccupationhandbook CASCADE;
TRUNCATE TABLE public.etpl CASCADE;
TRUNCATE TABLE public.indemandcips CASCADE;
TRUNCATE TABLE public.indemandsocs CASCADE;
TRUNCATE TABLE public.localexceptioncips CASCADE;
TRUNCATE TABLE public.oesestimates CASCADE;
TRUNCATE TABLE public.oeshybridcrosswalk CASCADE;
TRUNCATE TABLE public.onlineprograms CASCADE;
TRUNCATE TABLE public.outcomes_cip CASCADE;
TRUNCATE TABLE public.programtokens CASCADE;
TRUNCATE TABLE public.soc2010to2018crosswalk CASCADE;
TRUNCATE TABLE public.soccipcrosswalk CASCADE;
TRUNCATE TABLE public.socdefinitions CASCADE;