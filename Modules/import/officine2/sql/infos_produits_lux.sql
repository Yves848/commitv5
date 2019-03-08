select
  s.inoref,
  s.ccatremb, s.ntauxremb, s.lstup, s.irefrecep, s.iunitairestup, s.iequivstup,
  s.irefcns, s.iequivcns, s.ypxinterv, s.ypxoff
from
  d_specialites s
where
  s.lstup or s.irefcns <> s.inoref