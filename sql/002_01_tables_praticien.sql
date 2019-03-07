set sql dialect 3;

/********************************************************************/
/* table PRATICIEN                                                  */
/********************************************************************/

create table t_praticien(
    t_praticien_id d_id_char not null,
    matricule varchar(30) not null,
    nom varchar(50) not null            
        constraint chk_prat_nom check (char_length(nom) > 0),
    prenom varchar(50) not null,
    t_adresse_id d_id_int,
    constraint pk_praticien primary key(t_praticien_id),
    constraint fk_prat_adresse foreign key(t_adresse_id) references t_adresse(t_adresse_id) on delete set null);

create unique index unq_praticien on t_praticien(matricule);
