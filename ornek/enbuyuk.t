yeni    get
        ifzero bitir
        store bu
        sub enbüyük
        ifneg yeni
        load bu
        store enbüyük
        goto yeni
bitir   load enbüyük
        print
        stop
bu      0
enbüyük 0
