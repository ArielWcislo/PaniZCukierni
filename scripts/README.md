# Optymalizacja zdjęć

Wymagania: Python 3.10 lub nowszy oraz Pillow. Skrypt działa lokalnie w terminalu.

Jednorazowo zainstaluj zależność z katalogu projektu:

```sh
python -m pip install -r scripts/requirements.txt
```

Z katalogu projektu uruchom:

```sh
python scripts/optimize_images.py
```

Po zapisaniu wszystkich plików skrypt wypisze podsumowanie i zakończy pracę. Na Windows możesz użyć `py` zamiast `python`. Ścieżki do `assets` są liczone względem położenia skryptu, więc można go uruchomić również z innego katalogu.

Domyślnie przetwarzane są pliki PNG, JPG i JPEG bezpośrednio w `assets`, poza `logo.png` i `zdjecie_profilowe.jpg`. Możesz wskazać wybrane pliki:

```sh
python scripts/optimize_images.py serniki_1.png serniki_2.png
```

Wyniki trafiają do `assets/optimized` jako `<nazwa>-480.webp`, `<nazwa>-768.webp` i `<nazwa>-1080.webp`. Proporcje obrazów są zachowane. Małe źródła są powiększane do zadanych szerokości, dlatego najlepiej używać oryginałów o szerokości co najmniej 1080 px.

Plansze z tekstem (`*_1`, `pop_up`, `jak_zamawiac`) mają jakość 98%, a pozostałe zdjęcia 90%. Szerokości i jakość można zmienić w stałych na początku skryptu. Po zmianie cennika sprawdź czytelność gotowych grafik.

Oryginały nie są modyfikowane. Ponowne uruchomienie nadpisuje wygenerowane warianty dla wskazanych plików; nie usuwa innych grafik. Jeśli podmieniasz zdjęcie pod tą samą nazwą, odnośniki w `galeria.js` nadal pasują. Dla nowego zdjęcia dodaj tam ścieżki `src`, `srcset` i `full` według istniejących przykładów. Skrypt nie zmienia oferty ani konfiguracji galerii.

Pomoc:

```sh
python scripts/optimize_images.py --help
```
