/********************************************************************/
/* Type Modem       :                                               */
/*  1 : Ne pas transmettre                                          */
/*  2 : CPL                                                         */
/*  3 : hanff                                                       */
/*  4 : Prost                                                       */
/*  5 : Pharma-Goedert                                              */
/********************************************************************/

create domain d_four_type_modem smallint 
    check (value in (1, 2, 3, 4, 5));