select 
    p.inopat, 
    p.cmatricule, 
    p.lmatricule, 
    p.lcarteinvalide,
    p.ltierspayant, 
    p.cnom, 
    p.cprenom, 
    p.cadresse, 
    p.ccodepost, 
    p.clocalite, 
    p.cpays, 
    p.ctelephone, 
    p.cgsm, 
    p.cfax, 
    p.cemail, 
    p.isexe, 
    p.cchambre, 
    p.cadresse_f, 
    p.ccodepost_f, 
    p.clocalite_f, 
    p.cpays_f, 
    p.inoclient,
    p.inopatref,
    r.mremarque,
    ddv.tcreation
from 
  d_patient p
  left join d_remarques r on r.inoremarque = p.inoremarque and r.ityperemarque = 1
  left join (select inopatient, max(tcreation) tcreation
              from d_vente
              group by inopatient) ddv on ddv.inopatient = p.inopat
where p.inopat not in (select distinct pr.inopatref
                       from d_patient pr
                       where pr.inopatref <> 0 and pr.inopatref <> pr.inopat)