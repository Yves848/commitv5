select r.inocde, r.inogross, r.tcreation, sum(ypxtot)
from d_recep r
left join d_recep_fin_detail rfd on rfd.inocde = r.inocde
where r.lcomplet and
  year(r.tcreation) > year(date()) - 2
group by r.inocde, r.inogross, r.tcreation