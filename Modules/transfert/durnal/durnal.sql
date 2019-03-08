set sql dialect 3;

/********************************************************************/
/* table de correspondance                                          */
/********************************************************************/

create table t_durnal_praticien (
    t_durnal_praticien_id       d_id_char not null,
    matricule                   d_id_char not null,
    constraint pk_durnal_praticien primary key (t_durnal_praticien_id));

create unique index unq_durnal_praticien on t_durnal_praticien(matricule);

create table t_durnal_fournisseur (
    t_durnal_fournisseur_id       d_id_char not null,
    matricule                     d_id_char,
    constraint pk_durnal_fournisseur primary key (t_durnal_fournisseur_id));

create unique index unq_durnal_fournisseur on t_durnal_fournisseur(matricule);

set term ^;

create or alter package pk_durnal
as
begin
    procedure supprimer_praticiens_importes;

    procedure creer_correspondance_praticien(
        id_praticien type of d_id_char,
        matricule type of d_id_char);

    procedure supprimer_patients_transferes;

    procedure patient
    returns (
        id_client d_id_char,
        matricule varchar(50),
        nom varchar(50),
        prenom varchar(50),
        date_naissance varchar(8),
        rang_gemellaire numeric(1,0),
        langue varchar(3),
        sexe char(1),
        maison varchar(50),
        etage varchar(20),
        chambre varchar(20),
        lit varchar(10),
        id_compte d_id_int,
        id_profil_remise d_id_int,
        facturation char(1),
        date_derniere_visite date,
        adresses blob sub_type 1,
        medecins blob sub_type 1,
        tiers_payant boolean);

    procedure creer_correspondance_patient(
        id_patient type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure entourage
    returns(
        id_patient_a_lie type of d_id_char,
        code_entourage varchar(20),
        family varchar(50),
        given varchar(50),
        id varchar(50),
        patient_id type of d_id_char,
        uuid varchar(50));

    procedure creer_correspondance_frn_durnal(
        id_fournisseur type of d_id_char,
        matricule type of d_id_char);

    procedure creer_correspondance_frn(
        id_fournisseur type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure supprimer_produits_transferes;

    procedure fournisseur
    returns(
        id_fournisseur type of d_id_char,
        agency blob sub_type 1,
        is_default_distributor boolean,
        logo varchar(200),
        name varchar(100),
        pharmalink boolean,
        prefered boolean,
        remarques blob sub_type 1,
        representatives blob sub_type 1,
        supplier_id type of d_id_char,
        supplier_type varchar(20),
        website varchar(200));

    procedure produit
    returns (
        id_produit d_id_char,
        numero_base_reference d_id_int,
        codes_produits blob sub_type 1,
        designations blob sub_type 1,
        base_remboursement numeric(10,3),
        prix_vente numeric(10,3),
        prix_achat_catalogue numeric(10,3),
        pamp numeric(10,3),
        taux_tva numeric(5,2),
        etat d_etat_produit,
        code_remboursement varchar(50),
        type_produit d_id_int,
        codifications varchar(2000));

    procedure creer_correspondance_produit(
        id_produit type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure rotation
    returns(
        id_produit type of d_id_char,
        mois smallint,
        annee smallint,
        quantite_vendue numeric(5),
        nombre_ventes date);

    procedure depot
    returns(
        id_depot type of d_id_char,
        nom varchar(50),
        robot varchar(5));

    procedure creer_correspondance_depot(
        id_depot type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure stock
    returns(
        id_produit type of d_id_char,
        stocks blob sub_type 1,
        borne_mini numeric(5),
        borne_maxi numeric(5),
        derniere_vente date);

    procedure stupefiant
    returns(
        id_produit type of d_id_char,
        unites_stupefiant integer,
        id_produit_a_commander type of d_id_char,
        id_produit_unitaire type of d_id_char);

    procedure  produit_cns
    returns(
        id_produit type of d_id_char,
        quantite smallint,
        id_produit_associe type of d_id_char);

    procedure achat
    returns(
        id_commande type of d_id_char,
        id_fournisseur type of d_id_char,
        date_commande date,
        montant_ht numeric(10,3),
        etat smallint,
        lignes blob sub_type 1);

    procedure histo_delivrance
    returns(
        id_origine type of d_id_char,
        id_client type of d_id_char,
        numero_facture varchar(20),
        date_ordonnance date,
        date_acte date,
        type_code_praticien smallint,
        praticien type of d_id_char,
        nom_praticien varchar(50),
        prenom_praticien varchar(50),
        id_operateur varchar(20),
        lignes blob sub_type 1);

    procedure catalogue
    returns(
        id_catalogue type of d_id_char,
        id_fournisseur type of d_id_char,
        libelle varchar(100),
        fin_validite date,
        lignes blob sub_type 1);

    procedure commentaire
    returns(
        id_entite integer,
        type_commentaire smallint,
        commentaire blob sub_type 1);
end
^

recreate package body pk_durnal
as
begin
    procedure supprimer_praticiens_importes
    as
    begin
        delete from t_durnal_praticien;
    end

    procedure creer_correspondance_praticien(
        id_praticien type of d_id_char,
        matricule type of d_id_char)
    as
    begin
        insert into t_durnal_praticien(t_durnal_praticien_id, matricule)
        values(:id_praticien, :matricule);
    end

    procedure supprimer_patients_transferes
    as
    begin
        delete from t_transfert_client;
    end

    procedure patient
    returns (
        id_client d_id_char,
        matricule varchar(50),
        nom varchar(50),
        prenom varchar(50),
        date_naissance varchar(8),
        rang_gemellaire numeric(1,0),
        langue varchar(3),
        sexe char(1),
        maison varchar(50),
        etage varchar(20),
        chambre varchar(20),
        lit varchar(10),
        id_compte d_id_int,
        id_profil_remise d_id_int,
        facturation char(1),
        date_derniere_visite date,
        adresses blob sub_type 1,
        medecins blob sub_type 1,
        tiers_payant boolean)
    as
        declare function adresses (
            id_client type of d_id_char)
        returns blob sub_type 1
        as
            declare variable adresse blob sub_type 1;
            declare variable adresses blob sub_type 1;
        begin
            adresses = '[';
            for select
                    '{
                      "codePostal": "' || replace(coalesce(a.CODE_POSTAL, 'null'), '"', '') || '",
                      "email": "' || replace(coalesce(a.EMAIL, 'null'), '"', '') || '",
                      "fax": "' || replace(coalesce(a.FAX, 'null'), '"', '') || '",
                      "pays": "' || replace(coalesce(a.PAYS, 'null'), '"', '')||'",
                      "portable": "' || replace(coalesce(a.PORTABLE, 'null'), '"', '') || '",
                      "rue1": "' || replace(coalesce(a.RUE_1, 'null'), '"', '') || '",
                      "rue2": "' || replace(coalesce(a.RUE_2, 'null'), '"', '') || '",
                      "telephone": "' || replace(coalesce(a.TELEPHONE, 'null'), '"', '') || '",
                      "typeAdresse": "' || replace(coalesce(ca.TYPE_ADRESSE, 'null'), '"', '') || '",
                      "ville": "' || replace(coalesce(a.VILLE, 'null'), '"', '') || '"
                     }'
                from t_adresse a
                    inner join t_client_adresse ca on ca.t_adresse_id = a.t_adresse_id
                where ca.t_client_id = :id_client
                into :adresse do
                    adresses = adresses || :adresse || ',';

            adresses = adresses || ']';
            adresses = replace(:adresses, ',]',  ']' );
            return adresses;
        end

        declare function medecins(
            id_client type of d_id_char)
        returns blob sub_type 1
        as
            declare variable id_praticien type of d_id_char;
            declare variable ids_praticien blob sub_type 1;
        begin
            ids_praticien = '[';
            for select imp.t_durnal_praticien_id
                from t_client_praticien cp
                    left join t_praticien prat on prat.t_praticien_id = cp.t_praticien_id
                    left join t_durnal_praticien imp on imp.matricule = prat.matricule
                where cp.t_client_id = :id_client
                into :id_praticien do
                    ids_praticien = ids_praticien ||''''|| :id_praticien || ''',';

            ids_praticien = ids_praticien || ']';
            ids_praticien = replace(:ids_praticien, ',]',  ']' );
            return ids_praticien;
        end

    begin
        for select
                cli.t_client_id,
                cli.matricule,
                replace(cli.nom, '"', ''),
                replace(cli.prenom, '"', ''),
                cli.date_naissance,
                cli.rang_gemellaire,
                cli.langue,
                cli.sexe,
                replace(cli.maison, '"', ''),
                replace(cli.etage, '"', ''),
                replace(cli.chambre, '"', ''),
                replace(cli.lit, '"', ''),
                cli.t_profil_remise_id,
                cli.facturation,
                cli.date_derniere_visite,
                lc.tiers_payant
            from t_client cli
                inner join t_lux_client lc on lc.t_client_id = cli.t_client_id
            /*where
                exists(select null
                    from t_histo_delivrance h
                    where h.t_client_id = cli.t_client_id
                        and h.delivrance >= dateadd(-2 year to current_date))*/
            into
                :id_client,
                :matricule,
                :nom,
                :prenom,
                :date_naissance,
                :rang_gemellaire,
                :langue,
                :sexe,
                :maison,
                :etage,
                :chambre,
                :lit,
                :id_profil_remise,
                :facturation,
                :date_derniere_visite,
                :tiers_payant
            do
        begin
            medecins = medecins(:id_client);
            adresses = adresses(:id_client);
            suspend;
        end
    end

    procedure creer_correspondance_patient(
        id_patient type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_client(
            t_client_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_patient,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure entourage
    returns(
        id_patient_a_lie type of d_id_char,
        code_entourage varchar(20),
        family varchar(50),
        given varchar(50),
        id varchar(50),
        patient_id type of d_id_char,
        uuid varchar(50))
    as
    begin
        for select tc.nouvel_identifiant, 'OTHER', '', '', '', tcr.nouvel_identifiant, ''
            from t_client c
              inner join t_transfert_client  tc on tc.t_client_id = c.t_client_id
              inner join t_client cr on cr.t_client_id = c.t_personne_referente_id
              inner join t_transfert_client tcr on tcr.t_client_id = cr.t_client_id
            into
              :id_patient_a_lie, :code_entourage, :family, :given, :id, :patient_id, :uuid do
            suspend;
    end

    procedure creer_correspondance_frn_durnal(
        id_fournisseur type of d_id_char,
        matricule type of d_id_char)
    as
    begin
        insert into t_durnal_fournisseur(t_durnal_fournisseur_id, matricule)
        values(:id_fournisseur, :matricule);
    end

    procedure creer_correspondance_frn(
        id_fournisseur type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_fournisseur(
            t_fournisseur_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_fournisseur,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure supprimer_produits_transferes
    as
    begin
        delete from t_durnal_fournisseur;
        delete from t_transfert_produit;
        delete from t_transfert_depot;
    end

    procedure fournisseur
    returns(
        id_fournisseur type of d_id_char,
        agency blob sub_type 1,
        is_default_distributor boolean,
        logo varchar(200),
        name varchar(100),
        pharmalink boolean,
        prefered boolean,
        remarques blob sub_type 1,
        representatives blob sub_type 1,
        supplier_id type of d_id_char,
        supplier_type varchar(20),
        website varchar(200))
    as
    begin
        for select
                f.t_fournisseur_id,
                df.t_durnal_fournisseur_id,
                case f.type_fournisseur
                    when 1 then 'GROSSISTE'
                    when 2 then 'LABORATOIRE'
                end,
                f.raison_sociale,
                '{
                    "address" : "' || replace(coalesce(a.rue_1, 'null'), '"', '') || '",
                    "address2" : "' || replace(coalesce(a.rue_2, 'null'), '"', '') || '",
                    "agencyName" : "",
                    "city" : "' || replace(coalesce(a.ville, 'null'), '"', '') || '",
                    "cityId" : "",
                    "id" : "",
                    "phoneNumber" : "' || replace(coalesce(a.telephone, 'null'), '"', '') || '",
                    "postalBox" : "' || replace(coalesce(a.code_postal, 'null'), '"', '') || '"
                }',
                f.commentaire
            from
                t_fournisseur f
                inner join t_lux_fournisseur lf on lf.t_fournisseur_id = f.t_fournisseur_id
                left join t_adresse a on a.t_adresse_id = f.t_adresse_id
                left join t_durnal_fournisseur df on df.matricule = lf.matricule
            into
                :id_fournisseur,
                :supplier_id,
                :supplier_type,
                :name,
                :agency,
                :remarques
        do
        begin
            is_default_distributor = false;
            pharmalink = false;
            prefered = false;

            suspend;
        end
    end

    procedure produit
    returns (
        id_produit d_id_char,
        numero_base_reference d_id_int,
        codes_produits blob sub_type 1,
        designations blob sub_type 1,
        base_remboursement numeric(10,3),
        prix_vente numeric(10,3),
        prix_achat_catalogue numeric(10,3),
        pamp numeric(10,3),
        taux_tva numeric(5,2),
        etat d_etat_produit,
        code_remboursement varchar(50),
        type_produit d_id_int,
        codifications varchar(2000))
    as
        declare function codes_produit (
            id_produit type of d_id_char)
        returns blob sub_type 1
        as
            declare variable code varchar(200);
            declare variable codes blob sub_type 1;
        begin
            codes = '[';
            for select
                    '{
                      "typeCode": "' || replace(coalesce(pc.TYPE_CODE, 'null'), '"', '') || '",
                      "codeProduit": "'||replace(coalesce(pc.CODE, 'null'), '"', '') || '"
                     }'
                from t_produit p
                inner join t_produit_code pc on p.t_produit_id = pc.t_produit_id
                where p.t_produit_id = :id_produit
                into :code do
                codes = codes || code || ',';

            codes = codes || ']';
            codes = replace(:codes, ',]',  ']' );
            return codes;
        end

        declare function designations_produit (
            id_produit type of d_id_char)
        returns blob sub_type 1
        as
            declare variable designation varchar(200);
            declare variable designations blob sub_type 1;
        begin
            designations = '[';
            for select
                    '{
                      "designation": "' || replace(coalesce(pd.designation, 'null'), '"', '') || '",
                      "langue": "' || coalesce(pd.langue, 'null') || '"
                     }'
                from t_produit p
                    inner join t_produit_designation pd on p.t_produit_id = pd.t_produit_id
                where p.t_produit_id = :id_produit
                into :designation do
                designations = designations || :designation || ',';

            designations = designations || ']';
            designations = replace(:designations, ',]',  ']' );
            return designations;
        end
    begin
        for select
                p.t_produit_id,
                p.base_remboursement,
                p.prix_vente,
                p.prix_achat_catalogue,
                p.pamp,
                p.taux_tva,
                p.etat,
                '[]'
            from t_produit p
            where
                exists(select null from t_stock s where s.t_produit_id = p.t_produit_id) or
                exists(select null
                       from t_histo_delivrance_ligne hl
                         inner join t_histo_delivrance h on h.t_histo_delivrance_id = hl.t_histo_delivrance_id
                       where hl.t_produit_id = p.t_produit_id
                         and h.delivrance >= dateadd(-2 year to current_date)) or
                p.liste = 3
            into
                :id_produit,
                :base_remboursement,
                :prix_vente,
                :prix_achat_catalogue,
                :pamp,
                :taux_tva,
                :etat,
                :codifications
        do
        begin
            codes_produits = codes_produit(:id_produit);
            designations = designations_produit(:id_produit);
            suspend;
        end
    end

    procedure creer_correspondance_produit(
        id_produit type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_produit(
            t_produit_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_produit,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure rotation
    returns(
        id_produit type of d_id_char,
        mois smallint,
        annee smallint,
        quantite_vendue numeric(5),
        nombre_ventes date)
    as
    begin
        for select
                tp.nouvel_identifiant,
                h.mois,
                h.annee,
                h.quantite_vendue,
                h.nombre_ventes
            from
                t_historique_vente h
                inner join t_transfert_produit tp on tp.t_produit_id = h.t_produit_id
            where
                h.annee >= extract(year from current_date) - 2
            into
                :id_produit,
                :mois,
                :annee,
                :quantite_vendue,
                :nombre_ventes do
            suspend;
    end

    procedure depot
    returns(
        id_depot type of d_id_char,
        nom varchar(50),
        robot varchar(5))
    as
    begin
        for select
                t_depot_id, libelle, iif(t_depot_id = 'RBT', 'true', 'false')
            from
                t_depot
            into
                :id_depot, :nom, :robot
            do
            suspend;
    end

    procedure creer_correspondance_depot(
        id_depot type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_depot(
            t_depot_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_depot,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure stock
    returns(
        id_produit type of d_id_char,
        stocks blob sub_type 1,
        borne_mini numeric(5),
        borne_maxi numeric(5),
        derniere_vente date)
    as
        declare function stocks_depot(
            id_produit type of d_id_char)
        returns blob sub_type 1
        as
            declare variable stocks blob sub_type 1;
        begin
            stocks = '[';
            for select
                    '{
                      "idDepot" : "' || td.nouvel_identifiant || '",
                      "stockMini" : "' || s.stock_mini || '",
                      "stockMaxi" : "' || coalesce(s.stock_maxi, 'null') || '",
                      "quantite" : "' || s.stock || '",
                      "zoneGeographique" : {
                                             "code" : "' || coalesce(z.t_zone_geographique_id, 'null') || '",
                                             "libelle" : "' || replace(coalesce(z.libelle, 'null'), '"', '') || '"
                                           }
                     }' stock
                from
                    t_stock s
                    inner join t_transfert_depot td on td.t_depot_id = s.t_depot_id
                    left join t_zone_geographique z on z.t_zone_geographique_id = s.t_zone_geographique_id
                where
                    s.t_produit_id = :id_produit
                as cursor s do
                    stocks = stocks || :s.stock || ',';

            stocks = stocks || ']';
            stocks = replace(:stocks, ',]',  ']' );
            return stocks;
        end
    begin
        for select
                tp.nouvel_identifiant,
                stocks_depot(p.t_produit_id),
                p.borne_mini,
                p.borne_maxi,
                p.derniere_vente
            from
                t_transfert_produit tp
                inner join t_produit p on p.t_produit_id = tp.t_produit_id
                inner join t_stock s on s.t_produit_id = p.t_produit_id
            where
              tp.nouvel_identifiant is not null
            into
                :id_produit,
                :stocks,
                :borne_mini,
                :borne_maxi,
                :derniere_vente do
            suspend;
    end

    procedure stupefiant
    returns(
        id_produit type of d_id_char,
        unites_stupefiant integer,
        id_produit_a_commander type of d_id_char,
        id_produit_unitaire type of d_id_char)
    as
    begin
        for select
                tp.nouvel_identifiant, lp.unites_stupefiant, tpc.nouvel_identifiant, tpu.nouvel_identifiant
            from
                t_lux_produit lp
                inner join t_produit p on p.t_produit_id = lp.t_produit_id
                inner join t_transfert_produit tp on tp.t_produit_id = lp.t_produit_id
                left join t_transfert_produit tpc on tpc.t_produit_id = lp.t_produit_a_commander_id
                left join t_transfert_produit tpu on tpu.t_produit_id = lp.t_produit_unitaire_id
            where
                p.liste = '3'
                and tp.nouvel_identifiant is not null
            into
                :id_produit, :unites_stupefiant, :id_produit_a_commander, :id_produit_unitaire do
            suspend;
    end

    procedure  produit_cns
    returns(
        id_produit type of d_id_char,
        quantite smallint,
        id_produit_associe type of d_id_char)
    as
    begin
        for select
                tp.nouvel_identifiant, lp.quantite_produit_a_tarifer_cns, tpc.nouvel_identifiant
            from
                t_lux_produit lp
                inner join t_transfert_produit tp on tp.t_produit_id = lp.t_produit_id
                inner join t_transfert_produit tpc on tpc.t_produit_id = lp.t_produit_a_tarifer_cns_id
            where
                lp.quantite_produit_a_tarifer_cns is not null
            into
                :id_produit, :quantite, :id_produit_associe do
            suspend;
    end

    procedure histo_delivrance
    returns(
        id_origine type of d_id_char,
        id_client type of d_id_char,
        numero_facture varchar(20),
        date_ordonnance date,
        date_acte date,
        type_code_praticien smallint,
        praticien type of d_id_char,
        nom_praticien varchar(50),
        prenom_praticien varchar(50),
        id_operateur varchar(20),
        lignes blob sub_type 1)
    as
        declare function lignes_histo_deliv(
            id_histo_deliv type of d_id_char)
        returns blob sub_type 1
        as
            declare variable lignes blob sub_type 1;
        begin
            lignes = '[';
            for select
                    '{
                      "typeCodeProduit" : "0",
                      "produit" : "' || tp.nouvel_identifiant || '",
                      "designation" : "' || replace(coalesce(pd.designation, 'null'), '"', '') || '",
                      "quantite" : "' || l.quantite || '",
                      "prixAchat" : "' || l.prix_achat || '",
                      "prixAchatRemise" : "",
                      "prixVente" : "' || l.prix_vente || '"
                     }' lignes
                from
                    t_histo_delivrance_ligne l
                    inner join t_transfert_produit tp on tp.t_produit_id = l.t_produit_id
                    inner join t_produit_designation pd on pd.t_produit_id = tp.t_produit_id
                where
                    l.t_histo_delivrance_id = :id_histo_deliv
                as cursor l do
                lignes = lignes || :l.lignes || ',';

            lignes = lignes || ']';
            lignes = replace(:lignes, ',]',  ']' );
            return lignes;
        end
    begin
        for select
                e.t_histo_delivrance_id,
                tc.nouvel_identifiant,
                e.numero_facture,
                e.prescription,
                e.delivrance,
                iif(dp.t_durnal_praticien_id is not null, 0, 1),
                dp.t_durnal_praticien_id,
                p.nom,
                p.prenom,
                null,
                lignes_histo_deliv(t_histo_delivrance_id)
            from
                t_histo_delivrance e
                inner join t_transfert_client tc on tc.t_client_id = e.t_client_id
                left join t_praticien p on p.t_praticien_id = e.t_praticien_id
                left join t_durnal_praticien dp on dp.matricule = p.matricule
            where
                tc.nouvel_identifiant is not null and
                e.delivrance >= dateadd(-2 year to current_date)
            into
                :id_origine,
                :id_client,
                :numero_facture,
                :date_ordonnance,
                :date_acte,
                :type_code_praticien,
                :praticien,
                :nom_praticien,
                :prenom_praticien,
                :id_operateur,
                :lignes do
            suspend;
    end

    procedure achat
    returns(
        id_commande type of d_id_char,
        id_fournisseur type of d_id_char,
        date_commande date,
        montant_ht numeric(10,3),
        etat smallint,
        lignes blob sub_type 1)
    as
        declare function commande_lignes(
            id_commande type of d_id_char)
        returns blob sub_type 1
        as
            declare variable lignes blob sub_type 1;
        begin
            lignes = '[';
            for select
                    '{
                      "idProduit" : "' || tp.nouvel_identifiant || '",
                      "quantiteCommandee" : "' || l.quantite_commandee || '",
                      "quantiteRecue" : "' || l.quantite_recue || '",
                      "prixAchatCatalogue" : "' || l.prix_achat_catalogue || '",
                      "prixAchatRemise" : ", ' || l.prix_achat_remise || '",
                      "prixVente" : "' || l.prix_vente || '"
                      "unitesGratuites" : "' || l.unites_gratuites || '",
                      "dateReception" : ", ' || l.date_reception || '",
                      "receptionFinanciere" : "' || l.reception_financiere || '"
                     }' lignes
                from
                    t_ligne_commande l
                    inner join t_transfert_produit tp on tp.t_produit_id = l.t_produit_id
                where
                    l.t_commande_id = :id_commande
                as cursor l do
                lignes = lignes || :l.lignes || ',';

            lignes = lignes || ']';
            lignes = replace(:lignes, ',]',  ']' );
            return lignes;
        end
    begin
        for select
                c.t_commande_id, df.t_durnal_fournisseur_id, c.date_commande, c.montant_ht, c.etat,
                commande_lignes(c.t_commande_id)
            from
                t_commande c
                inner join t_lux_fournisseur f on f.t_fournisseur_id = c.t_fournisseur_id
                inner join t_durnal_fournisseur df on df.matricule = f.matricule
            into
                :id_commande,
                :id_fournisseur,
                :date_commande,
                :montant_ht,
                :etat,
                :lignes do
            suspend;
    end

    procedure catalogue
    returns(
        id_catalogue type of d_id_char,
        id_fournisseur type of d_id_char,
        libelle varchar(100),
        fin_validite date,
        lignes blob sub_type 1)
    as
        declare function catalogue_lignes(
            id_catalogue type of d_id_char)
        returns blob sub_type 1
        as
            declare variable lignes blob sub_type 1;
        begin
            lignes = '[';
            for select
                    '{
                      "idProduit" : "' || tp.nouvel_identifiant || '",
                      "prixAchat" : "' || l.prix_achat || '",
                      "remise" : ' || l.remise || ',
                      "majTarif" : "' || l.maj_tarif || '"
                     }' lignes
                from
                    t_catalogue_ligne l
                    inner join t_transfert_produit tp on tp.t_produit_id = l.t_produit_id
                where
                    l.t_catalogue_id = :id_catalogue
                as cursor l do
                lignes = lignes || :l.lignes || ',';

            lignes = lignes || ']';
            lignes = replace(:lignes, ',]',  ']' );
            return lignes;
        end
    begin
        for select
                c.t_catalogue_id,
                df.t_durnal_fournisseur_id,
                c.libelle,
                c.fin_validite,
                catalogue_lignes(c.t_catalogue_id)
            from
                t_catalogue c
                inner join t_lux_fournisseur f on f.t_fournisseur_id = c.t_fournisseur_id
                inner join t_durnal_fournisseur df on df.matricule = f.matricule
            into
                :id_catalogue,
                :id_fournisseur,
                :libelle,
                :fin_validite,
                :lignes do
            suspend;

    end

    procedure commentaire
    returns(
        id_entite integer,
        type_commentaire smallint,
        commentaire blob sub_type 1)
    as
    begin
        for select tc.nouvel_identifiant, 31, c.commentaire_individuel
            from
                t_client c
                inner join t_transfert_client tc on tc.t_client_id = c.t_client_id
            where
                tc.nouvel_identifiant is not null and
                c.commentaire_global is not null
            union
            select tc.nouvel_identifiant, 32, c.commentaire_global
            from
                t_client c
                inner join t_transfert_client tc on tc.t_client_id = c.t_client_id
            where
                tc.nouvel_identifiant is not null and
                c.commentaire_global is not null
            union
            select df.t_durnal_fournisseur_id, 41, f.commentaire
            from
                t_lux_fournisseur lf
                inner join t_fournisseur f on f.t_fournisseur_id = lf.t_fournisseur_id
                inner join t_durnal_fournisseur df on df.matricule = lf.matricule
            where
                f.commentaire is not null
            union
            select tp.nouvel_identifiant, 51, p.commentaire_vente
            from t_produit p
                inner join t_transfert_produit tp on tp.t_produit_id = p.t_produit_id
            where
                tp.nouvel_identifiant is not null and
                p.commentaire_vente is not null
            union
            select tp.nouvel_identifiant, 52, p.commentaire_gestion
            from
                t_produit p
                inner join t_transfert_produit tp on tp.t_produit_id = p.t_produit_id
            where
                tp.nouvel_identifiant is not null and
                p.commentaire_gestion is not null
            into :id_entite, :type_commentaire, :commentaire do
        begin
            suspend;
        end
    end
end
^

set term ;^
