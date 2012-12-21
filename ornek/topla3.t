        get
topla   ifneg duyur
        store sayac
        add toplam
        store toplam
        load sayac
        sub 1
        goto topla
duyur   load toplam
        print
        stop
toplam  0
sayac   0
