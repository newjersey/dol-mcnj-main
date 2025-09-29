delete from localexceptioncips
where soc = '31-1131'
  and cip = '51.2601'
  and county in ('CAMDEN', 'ATLANTIC', 'CAPE MAY', 'CUMBERLAND', 'SALEM');
