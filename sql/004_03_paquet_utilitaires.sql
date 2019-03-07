set sql dialect 3;
set term ^;

create or alter package pk_utilitaires
as
begin
    procedure separer_nom_prenom(
        nom_prenom varchar(100),
        separateur_np varchar(5) = ' ')
    returns(
        nom varchar(100),
        prenom varchar(100),
        nom_jeune_fille varchar(100));
end
^

recreate package body pk_utilitaires
as
begin
    procedure separer_nom_prenom(
        nom_prenom varchar(100),
        separateur_np varchar(5))
    returns(
        nom varchar(100),
        prenom varchar(100),
        nom_jeune_fille varchar(100))
    as
    declare variable pos integer;
    declare variable l integer;
    begin
        nom_prenom = trim(nom_prenom);

        -- Gestion du nom de jeune fille incoroporee
        pos = position(' NEE ' in upper(nom_prenom));
        if (pos > 0) then
        begin
            nom = substring(nom_prenom from 1 for pos - 1);    
            execute procedure separer_nom_prenom(substring(nom_prenom from pos + 5 for 100), separateur_np) returning_values :nom_jeune_fille, :prenom, :nom;
        end
        else
        begin
            nom_jeune_fille  = null;  

            pos = position(separateur_np in nom_prenom);
            if (pos > 0) then
            begin
                l = char_length(separateur_np);
                nom = substring(nom_prenom from 1 for pos - l);
                prenom = trim(substring(nom_prenom from pos + l for 20));
                if (prenom = '') then
                    prenom = '_';

                -- Gestion d'une particule
                if (separateur_np = ' ') then
                begin
                    pos = position(' ' in prenom);
                    if (pos > 0) then
                    begin
                        nom = nom || ' ' || substring(prenom from 1 for pos - 1);
                        prenom = substring(prenom from pos + 1 for 20);
                    end
                end
            end
            else
            begin
                nom = trim(nom_prenom);
                prenom = '_';
            end
        end
    end
end
^

set term ;^