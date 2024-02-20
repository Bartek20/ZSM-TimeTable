# Projekt ZSM TimeTable
Aplikacja została przygotowana w ramach dodania nowego planu lekcji do strony Zespołu Szkół Mechaniczny w Rzeszowie.

## Zastosowanie w innej szkole
Wykorzystanie aplikacji w innej szkole jest możliwe, jednak może to wymagać ręcznych zmian w kodzie aplikacji.
Zabronione jest jednak usuwaine, jak i modyfikowanie informacji o autorze kodu (dopuszczalne jest dodanie informacji o osobie odpowiedzialnej za dostosowanie kodu dla szkoły).

## Kompilacja aplikacji
Przed rozpoczęciem kompilacji należy dostosować aplikację poprzez:
* Dostosowanie danych aplikacji (w pliku /appConfigs.js)
* Zmienienie loga szkoły (plik /public/images/logo.png)

Po dostosowaniu aplikacji do potrzeb szkoły mależy skompilować program:
```
// Dla ścieżki / np. https://szkola.pl/
npm run build
// Dla własnej ścieżki np. https://szkola.pl/plan_lekcji/
// Poprzez ścieżkę rozumie się ścieżkę, na której będzie dostępna aplikacja planu lekcji
npm run build -- --base "{ścieżka*}" => npm run build -- --base "/plan_lekcji/"
```
Następnie należy skopiować pliki z folderu *dist* na serwer szkolny, do ścieżki, która została wcześniej zadeklarowana.
Po skopiowaniu plików należy:
* [OBOWIĄZKOWO] Dostosować dane szkoły zgodnie z plikiem schoolData.template.js (zmienić nazwę na schoolData.js i zmienić zawartość)
* [OPCJONALNIE] Dostosować dane planu lekcji zgodnie z plikiem timetableData.template.js (zmienić nazwę na timetableData.js i zmienić zawartość)

## Zastosowane technologie
### W wydaniu produkcyjnym:
* Vue.js 3 (Vue Router, Pinia, @VueUse)
* Axios.js - Pobieranie planów lekcji
* Chroma.js - Generowanie kolorów lekcji
* @nozbe/microfuzz - Wyszukiwarka

### Środowisko deweloperskie:
* Node.js 20
* Vite
* Unplugin Auto Imports
* Unplugin Vue Components
* Vite PWA Plugin