set sql dialect 3;
set term ^;

create or alter package pk_supprimer
as
begin
    procedure supprimer_praticiens();
    procedure supprimer_clients();    
    procedure supprimer_produits(); 
    procedure supprimer_historiques();   
end
^

recreate package body pk_supprimer
as
begin
    procedure supprimer_praticiens
    as
    begin
        delete from t_praticien;
    end
    
    procedure supprimer_clients
    as
    begin
        delete from t_client_adresse
        where t_client_id in (select t_client_id from t_client);
        delete from t_client;
        
        delete from t_compte_adresse
        where t_compte_id in (select t_compte_id from t_compte);
        delete from t_compte;
    end
    
    procedure supprimer_produits
    as
    begin
        delete from t_produit;
        delete from t_fournisseur;
        delete from t_zone_geographique;                
        delete from t_depot;

        insert into t_depot values('PHA', 'PHARMACIE');
        insert into t_depot values('RES', 'RESERVE');
        insert into t_depot values('RBT', 'ROBOT');
    end

    procedure supprimer_historiques
    as
    begin
        delete from t_historique_vente;
        delete from t_histo_delivrance;
        delete from t_commande;
    end
end
^

set term ;^