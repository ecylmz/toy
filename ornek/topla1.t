        get
topla   store sayac
        add toplam
        store toplam
        load sayac
        sub 1
        ifzero duyur
        goto topla
duyur   load toplam
        print
        stop
toplam  0
sayac   0
