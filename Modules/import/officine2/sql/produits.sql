select
  s.inoref, s.inonat, s.inocefip, s.cbarcode, s.cnom,
  s.ybasermb, s.ypxpublic, s.ypxachat, s.ypamp, s.ntauxtva,
  r.mremarque, n.mremarque mnote,
  s.cetat,  s.lstup,
  h.lcopie, h.lderangt, h.luniqstup, h.lprogsubst,
  s.catc1, s.catc2, s.catc3, s.catc4,
  s.ddernvte,
  s.lgererstk, s.istkrayon, s.ldblstk, s.istkreserv, lrobot, istkrobot,
  s.istkmin, s.iqtecde
from d_specialites s
  left join d_remarques r on r.inoremarque = s.inoremarque
  left join d_remarques n on n.inoremarque = s.inonote
  left join d_honoraires h on h.inoref = s.inoref