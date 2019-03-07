set sql dialect 3;
set term ^;

create or alter package pk_produit
as
begin
    procedure creer_designation(
        id_produit integer,
        langue varchar(3),
        designation varchar(100));

    procedure creer_code(
        id_produit integer,
        type_code smallint,
        code varchar(20));
end
^

recreate package body pk_produit
as
begin
    procedure creer_designation(
        id_produit integer,
        langue varchar(3),
        designation varchar(100))
    as
    begin
        if ((designation is not null) and (trim(designation) <> '')) then
            insert into t_produit_designation(
                t_produit_id,
                langue,
                designation)
            values(
                :id_produit,
                :langue,
                trim(:designation));
    end
        
    procedure creer_code(
        id_produit integer,
        type_code smallint,
        code varchar(20))
    as
    begin
        insert into t_produit_code(
            t_produit_id,
            type_code,
            code)
        values(
            :id_produit,
            :type_code,
            trim(:code));
    end
end
^

set term ;^