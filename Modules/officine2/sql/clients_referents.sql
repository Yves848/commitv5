select
    pr.inopat, 
    pr.cmatricule, 
    pr.lmatricule, 
    pr.lcarteinvalide,
    pr.ltierspayant, 
    pr.cnom, 
    pr.cprenom, 
    pr.cadresse, 
    pr.ccodepost, 
    pr.clocalite, 
    pr.cpays, 
    pr.ctelephone, 
    pr.cgsm, 
    pr.cfax, 
    pr.cemail, 
    pr.isexe, 
    pr.cchambre, 
    pr.cadresse_f, 
    pr.ccodepost_f, 
    pr.clocalite_f, 
    pr.cpays_f, 
    pr.inoclient,
    pr.inopatref,
    r.mremarque,
    ddv.tcreation
from d_patient p
  inner join d_patient pr on pr.inopat = p.inopatref
  left join d_remarques r on r.inoremarque = pr.inoremarque and r.ityperemarque = 1
  left join (select inopatient, max(tcreation) tcreation
              from d_vente
              group by inopatient) ddv on ddv.inopatient = pr.inopat
where p.inopatref <> 0 and p.inopatref <> p.inopat