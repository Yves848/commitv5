set sql dialect 3;

/********************************************************************/
/* table HISTORIQUE_VENTE                                           */
/*    Historique de vente mensuel d'un produit                      */
/********************************************************************/

create table t_historique_vente(
    t_historique_vente_id d_id_int generated by default as identity not null,
    t_produit_id d_id_char not null,
    mois integer not null
        constraint chk_hv_mois check (mois between 1 and 12),
    annee integer not null
        constraint chk_hv_annee check (annee >= 2000),
    quantite_vendue integer,
    nombre_ventes integer,
    constraint pk_historique_vente primary key(t_historique_vente_id),
    constraint fk_hv_produit foreign key(t_produit_id) references t_produit(t_produit_id) on delete cascade);

create unique index unq_historique_vente on t_historique_vente(t_produit_id, mois, annee);

/********************************************************************/
/* table HISTO_DELIVRANCE                                           */
/*    Historique de délivrance (ro) par client/produit              */
/********************************************************************/

create table t_histo_delivrance(
    t_histo_delivrance_id d_id_int not null,
    numero_facture integer default 0 not null,
    operateur varchar(10),
    t_client_id d_id_char,
    t_praticien_id d_id_char,
    prescription date,
    delivrance date not null,
    type_facturation smallint,
    constraint pk_historique primary key(t_histo_delivrance_id),
    constraint fk_hd_client foreign key(t_client_id) references t_client(t_client_id) on delete cascade,
    constraint fk_hd_praticien foreign key(t_praticien_id) references t_praticien(t_praticien_id) on delete cascade);

create table t_histo_delivrance_ligne(
    t_histo_delivrance_ligne_id d_id_int generated by default as identity not null,
    t_histo_delivrance_id d_id_int not null,
    t_produit_id d_id_char not null,
    quantite integer not null,
    prix_vente numeric(10, 2),
    prix_achat numeric(10, 3),
    constraint pk_histo_delivrance_ligne primary key(t_histo_delivrance_ligne_id),
    constraint fk_hdl_histo_delivrance foreign key(t_histo_delivrance_id) references t_histo_delivrance(t_histo_delivrance_id) on delete cascade,
    constraint fk_hdl_produit foreign key(t_produit_id) references t_produit(t_produit_id) on delete cascade);

/********************************************************************/
/* table COMMANDE                                                   */
/********************************************************************/

create table t_commande(
    t_commande_id d_id_char not null,
    t_fournisseur_id d_id_char not null,
    date_commande date not null,
    montant_ht numeric(10,3) not null,
    commentaire blob sub_type 1,
    etat d_etat_commande not null,
    constraint pk_commande primary key (t_commande_id),
    constraint fk_cmd_fournisseur foreign key (t_fournisseur_id) references t_fournisseur(t_fournisseur_id) on delete cascade);

comment on column t_commande.etat is
'0 : Commande en attente de reception
 1 : Commande receptionnée quantitativement
 2 : Commande receptionnée entierement';

/********************************************************************/
/* table LIGNE_COMMANDE                                             */
/********************************************************************/

create table t_ligne_commande(
    t_ligne_commande_id d_id_int generated by default as identity not null,
    t_commande_id d_id_char not null,
    t_produit_id d_id_char not null,
    quantite_commandee smallint not null,
    quantite_recue smallint not null,
    prix_achat_catalogue numeric(10,3) not null,
    prix_achat_remise numeric(10,3) not null,
    prix_vente numeric(10,2) not null,
    unites_gratuites smallint default 0 not null,
    commentaire blob sub_type 1,
    date_reception date,
    reception_financiere boolean not null,
    constraint pk_ligne_commande primary key (t_ligne_commande_id),
    constraint fk_lcmd_commande foreign key (t_commande_id) references t_commande(t_commande_id) on delete cascade,
    constraint fk_lcmd_produit foreign key (t_produit_id) references t_produit(t_produit_id) on delete cascade);

create unique index unq_ligne_commande on t_ligne_commande(t_commande_id, t_produit_id);    