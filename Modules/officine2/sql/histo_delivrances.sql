select
  inovente,
  inoord,
  inoemp,
  inopatient,
  inomedecin,
  ddateord,
  tcreation
from 
  d_vente
where
  year(tcreation) > year(date()) - 2
