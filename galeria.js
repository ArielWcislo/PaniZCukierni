// Kategorie w kolejności wyświetlania zakładek.
const KATEGORIE_GALERII = [
  {
    "id": "pop-up",
    "items": [
      {
        "src": "./assets/optimized/pop_up-768.webp",
        "caption": "Pop up — informacje",
        "srcset": "./assets/optimized/pop_up-480.webp 480w, ./assets/optimized/pop_up-768.webp 768w, ./assets/optimized/pop_up-1080.webp 1080w",
        "full": "./assets/optimized/pop_up-1080.webp"
      }
    ]
  },
  {
    "id": "serniki",
    "items": [
      {
        "src": "./assets/optimized/serniki_1-768.webp",
        "caption": "Serniki — oferta, strona 1",
        "srcset": "./assets/optimized/serniki_1-480.webp 480w, ./assets/optimized/serniki_1-768.webp 768w, ./assets/optimized/serniki_1-1080.webp 1080w",
        "full": "./assets/optimized/serniki_1-1080.webp"
      },
      {
        "src": "./assets/optimized/serniki_2-768.webp",
        "caption": "Serniki — oferta, strona 2",
        "srcset": "./assets/optimized/serniki_2-480.webp 480w, ./assets/optimized/serniki_2-768.webp 768w, ./assets/optimized/serniki_2-1080.webp 1080w",
        "full": "./assets/optimized/serniki_2-1080.webp"
      },
      {
        "src": "./assets/optimized/serniki_3-768.webp",
        "caption": "Serniki — oferta, strona 3",
        "srcset": "./assets/optimized/serniki_3-480.webp 480w, ./assets/optimized/serniki_3-768.webp 768w, ./assets/optimized/serniki_3-1080.webp 1080w",
        "full": "./assets/optimized/serniki_3-1080.webp"
      }
    ]
  },
  {
    "id": "ciasta-torty",
    "items": [
      {
        "src": "./assets/optimized/ciasta_torty_1-768.webp",
        "caption": "Ciasta i torty — oferta, strona 1",
        "srcset": "./assets/optimized/ciasta_torty_1-480.webp 480w, ./assets/optimized/ciasta_torty_1-768.webp 768w, ./assets/optimized/ciasta_torty_1-1080.webp 1080w",
        "full": "./assets/optimized/ciasta_torty_1-1080.webp"
      },
      {
        "src": "./assets/optimized/ciasta_torty_2-768.webp",
        "caption": "Ciasta i torty — oferta, strona 2",
        "srcset": "./assets/optimized/ciasta_torty_2-480.webp 480w, ./assets/optimized/ciasta_torty_2-768.webp 768w, ./assets/optimized/ciasta_torty_2-1080.webp 1080w",
        "full": "./assets/optimized/ciasta_torty_2-1080.webp"
      },
      {
        "src": "./assets/optimized/ciasta_torty_3-768.webp",
        "caption": "Ciasta i torty — oferta, strona 3",
        "srcset": "./assets/optimized/ciasta_torty_3-480.webp 480w, ./assets/optimized/ciasta_torty_3-768.webp 768w, ./assets/optimized/ciasta_torty_3-1080.webp 1080w",
        "full": "./assets/optimized/ciasta_torty_3-1080.webp"
      }
    ]
  },
  {
    "id": "deserki",
    "items": [
      {
        "src": "./assets/optimized/deserki_w_kubeczku_1-768.webp",
        "caption": "Deserki w kubeczkach — oferta, strona 1",
        "srcset": "./assets/optimized/deserki_w_kubeczku_1-480.webp 480w, ./assets/optimized/deserki_w_kubeczku_1-768.webp 768w, ./assets/optimized/deserki_w_kubeczku_1-1080.webp 1080w",
        "full": "./assets/optimized/deserki_w_kubeczku_1-1080.webp"
      },
      {
        "src": "./assets/optimized/deserki_w_kubeczku_2-768.webp",
        "caption": "Deserki w kubeczkach — oferta, strona 2",
        "srcset": "./assets/optimized/deserki_w_kubeczku_2-480.webp 480w, ./assets/optimized/deserki_w_kubeczku_2-768.webp 768w, ./assets/optimized/deserki_w_kubeczku_2-1080.webp 1080w",
        "full": "./assets/optimized/deserki_w_kubeczku_2-1080.webp"
      },
      {
        "src": "./assets/optimized/deserki_w_kubeczku_3-768.webp",
        "caption": "Deserki w kubeczkach — oferta, strona 3",
        "srcset": "./assets/optimized/deserki_w_kubeczku_3-480.webp 480w, ./assets/optimized/deserki_w_kubeczku_3-768.webp 768w, ./assets/optimized/deserki_w_kubeczku_3-1080.webp 1080w",
        "full": "./assets/optimized/deserki_w_kubeczku_3-1080.webp"
      }
    ]
  },
  {
    "id": "dwa-kesy",
    "items": [
      {
        "src": "./assets/optimized/na_dwa_kesy_1-768.webp",
        "caption": "Słodkości na dwa kęsy — oferta, strona 1",
        "srcset": "./assets/optimized/na_dwa_kesy_1-480.webp 480w, ./assets/optimized/na_dwa_kesy_1-768.webp 768w, ./assets/optimized/na_dwa_kesy_1-1080.webp 1080w",
        "full": "./assets/optimized/na_dwa_kesy_1-1080.webp"
      },
      {
        "src": "./assets/optimized/na_dwa_kesy_2-768.webp",
        "caption": "Słodkości na dwa kęsy — oferta, strona 2",
        "srcset": "./assets/optimized/na_dwa_kesy_2-480.webp 480w, ./assets/optimized/na_dwa_kesy_2-768.webp 768w, ./assets/optimized/na_dwa_kesy_2-1080.webp 1080w",
        "full": "./assets/optimized/na_dwa_kesy_2-1080.webp"
      },
      {
        "src": "./assets/optimized/na_dwa_kesy_3-768.webp",
        "caption": "Słodkości na dwa kęsy — oferta, strona 3",
        "srcset": "./assets/optimized/na_dwa_kesy_3-480.webp 480w, ./assets/optimized/na_dwa_kesy_3-768.webp 768w, ./assets/optimized/na_dwa_kesy_3-1080.webp 1080w",
        "full": "./assets/optimized/na_dwa_kesy_3-1080.webp"
      }
    ]
  },
  {
    "id": "jak-zamawiac",
    "items": [
      {
        "src": "./assets/optimized/jak_zamawiac-768.webp",
        "caption": "Jak zamawiać — informacje",
        "srcset": "./assets/optimized/jak_zamawiac-480.webp 480w, ./assets/optimized/jak_zamawiac-768.webp 768w, ./assets/optimized/jak_zamawiac-1080.webp 1080w",
        "full": "./assets/optimized/jak_zamawiac-1080.webp"
      }
    ]
  }
];
