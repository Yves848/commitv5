select
  m.inomed,
  m.cmatricule,
  m.cnom,
  m.cadresse,
  m.ccodepost,
  m.clocalite,
  m.ctelephone,
  m.cfax,
  m.cspec,
  m.cpays,
  m.cemail,
  r.mremarque
from
  d_medecin m
  left join d_remarques r on r.inoremarque = m.inoremarque
