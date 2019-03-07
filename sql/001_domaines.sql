set sql dialect 3;

create domain d_id_int integer;
create domain d_id_char varchar(50);

/********************************************************************/
/* Domaine TYPE_ADRESSE :                                           */
/*  0 : adresse personnelle                                        */
/*  1 : adresse facturation                                        */
/*  2 : adresse professionelle                                     */
/********************************************************************/

create domain d_type_adresse smallint
    default 0 not null
    check (value in (0, 1, 2));

/********************************************************************/
/* Type Fournisseur :                                               */
/*  1 : fournisseur direct/laboratoire                              */
/*  2 : grossiste                                                   */
/********************************************************************/

create domain d_type_fournisseur smallint 
    not null
    check (value in (1, 2));

/********************************************************************/
/* Etat d'un produit                                                */
/*  0 : En vigueur                                                  */
/*  1 : En vigueur                                                  */
/*  2 : Ne se fait plus                                             */
/*  3 : Fabrication suspendue                                       */
/*  4 : Produit en vente interdite                                  */
/*  5 : Produit remplacé                                            */
/*  8 : Statut inconnu                                              */
/********************************************************************/

create domain d_etat_produit smallint
    not null
    check (value in (0, 1, 2, 3, 4, 5, 8));

/********************************************************************/
/* Liste d'un produit                                               */
/*  0 : produit non-listé                                           */
/*  1 : Liste I                                                     */
/*  2 : Liste II                                                    */
/*  3 : Produit stupéfiant                                          */
/********************************************************************/

create domain d_liste_produit smallint
    not null
    check (value in (0, 1, 2, 3));

/********************************************************************/
/* Type de code produit                                             */
/*  0 : Code CIP7/CNK                                               */
/*  1 : Code CIP/ACL 13                                             */
/*  2 : Code EAN13                                                  */
/*  3 : Autre code                                                  */
/********************************************************************/

create domain d_type_code_produit smallint
    not null
    check (value in(0, 1, 2, 3, 4));    

/********************************************************************/
/* Etat d'une commande                                              */
/*  0 : Commande en attente de reception                            */
/*  1 : Commande receptionnée quantitativement                     */
/*  2 : Commande receptionnée entierement                           */
/********************************************************************/

create domain d_etat_commande smallint
    not null
    check (value in (0, 1, 2, 3));