set sql dialect 3;

/********************************************************************/
/* table de correspondance                                          */
/********************************************************************/

create table t_transfert_client (
    t_client_id             d_id_char not null,
    nouvel_identifiant      d_id_char,
    code_erreur             varchar(200),
    message_erreur          varchar(1000),
    constraint pk_transfert_client primary key (t_client_id));

create table t_transfert_depot(
    t_depot_id            d_id_char not null,
    nouvel_identifiant      d_id_char,
    code_erreur             varchar(200),
    message_erreur          varchar(1000),
    constraint pk_transfert_depot primary key (t_depot_id));
   
create table t_transfert_fournisseur(
    t_fournisseur_id            d_id_char not null,
    nouvel_identifiant      d_id_char,
    code_erreur             varchar(200),
    message_erreur          varchar(1000),
    constraint pk_transfert_fournisseur primary key (t_fournisseur_id));

create table t_transfert_produit(
    t_produit_id            d_id_char not null,
    nouvel_identifiant      d_id_char,
    code_erreur             varchar(200),
    message_erreur          varchar(1000),
    constraint pk_transfert_produit primary key (t_produit_id));