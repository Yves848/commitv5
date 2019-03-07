select distinct
  c.inoref,
  c.ccode
from
  d_codesart c
  inner join d_specialites s on s.inoref = c.inoref
where
  c.lbarcode and
  s.cbarcode <> c.ccode