create table t_lux_client(
    t_client_id d_id_char not null,
    carte_invalide boolean default false not null,
    tiers_payant boolean default true not null,
    constraint pk_lux_client primary key (t_client_id),
    constraint fk_lux_client foreign key(t_client_id) references t_client(t_client_id) on delete cascade);

create table t_lux_fournisseur(
    t_fournisseur_id d_id_char not null,
    type_modem d_four_type_modem,
    matricule varchar(30),
    constraint pk_lux_fournisseur primary key (t_fournisseur_id),
    constraint fk_lux_fournisseur foreign key(t_fournisseur_id) references t_fournisseur(t_fournisseur_id) on delete cascade);

create table t_lux_produit(
	t_produit_id varchar(50) not null,
    t_produit_a_commander_id d_id_char,
    t_produit_unitaire_id d_id_char,
    unites_stupefiant integer,
    t_produit_a_tarifer_cns_id d_id_char,
    quantite_produit_a_tarifer_cns smallint,
    prix_reference_cns numeric(10,3),
    prix_intervention_cns numeric(10,3),
    categorie_remboursement varchar(2),
    taux_remboursement numeric(6,2),
	constraint pk_lux_produit primary key (t_produit_id),
    constraint fk_lux_produit foreign key(t_produit_id) references t_produit(t_produit_id) on delete cascade);