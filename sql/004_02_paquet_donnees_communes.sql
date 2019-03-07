set sql dialect 3;
set term ^;

create or alter package pk_donnees_communes
as
begin
    function creer_contact(
        nom varchar(50),
        prenom varchar(50),
        rue_1 varchar(50),
        rue_2 varchar(50),
        code_postal varchar(10),
        ville varchar(100),
        pays varchar(100),
        telephone varchar(30),
        portable varchar(30),
        fax varchar(30),
        email varchar(200),
        commentaire blob sub_type 1)
    returns integer;

    function creer_adresse(
        id_entite integer,
        type_entite smallint,
        type_adresse smallint,
        rue_1 varchar(50),
        rue_2 varchar(50),
        code_postal varchar(10),
        ville varchar(100),
        pays varchar(100),
        telephone varchar(30),
        portable varchar(30),
        fax varchar(30),
        email varchar(200))
    returns integer;
end
^

recreate package body pk_donnees_communes
as
begin
    function creer_contact(
        nom varchar(50),
        prenom varchar(50),
        rue_1 varchar(50),
        rue_2 varchar(50),
        code_postal varchar(10),
        ville varchar(100),
        pays varchar(100),
        telephone varchar(30),
        portable varchar(30),
        fax varchar(30),
        email varchar(200),
        commentaire blob sub_type 1)
    returns integer
    as
    declare variable idAdresse integer;
    begin
        if ((nom is not null) and (nom <> '')) then
        begin
            idAdresse = creer_adresse(null, null, 0, :rue_1, :rue_2, :code_postal, :ville, :pays, 
                :telephone, :portable, :fax, :email);

            insert into t_contact(
                nom,
                prenom,
                t_adresse_id,
                commentaire)
            values(
                trim(:nom),
                trim(:prenom),
                :idAdresse,
                :commentaire);
        end
    end

    function creer_adresse(
        id_entite integer,
        type_entite smallint,
        type_adresse smallint,
        rue_1 varchar(50),
        rue_2 varchar(50),
        code_postal varchar(10),
        ville varchar(100),
        pays varchar(100),
        telephone varchar(30),
        portable varchar(30),
        fax varchar(30),
        email varchar(200))
    returns integer
    as
      declare variable id_adresse integer;
    begin
        id_adresse = null;
        
        if ((code_postal is not null) and (trim(code_postal) <> '') and
            (ville is not null) and (trim(ville) <> '')) then
        begin
            insert into t_adresse(
                rue_1,
                rue_2,
                code_postal,
                ville,
                pays,
                telephone,
                portable,
                fax,
                email)
            values(
                trim(:rue_1),
                trim(:rue_2),
                trim(:code_postal),
                trim(:ville),
                trim(:pays),
                trim(:telephone),
                trim(:portable),
                trim(:fax),
                trim(:email))
            returning t_adresse_id into :id_adresse;

            if (id_entite is not null) then
            begin
                if (type_entite = 0) then
                    insert into t_client_adresse(t_client_id, t_adresse_id, type_adresse)
                    values(:id_entite, :id_adresse, :type_adresse);
                else if (type_entite = 1) then
                    insert into t_compte_adresse(t_compte_id, t_adresse_id, type_adresse)
                    values(:id_entite, :id_adresse, :type_adresse);
            end
        end

        return id_adresse;
    end
end
^

set term ;^