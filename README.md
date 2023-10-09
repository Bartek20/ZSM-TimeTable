# Projekt ZSM TimeTable
Aplikacja została przygotowana w ramach dodania nowego planu lekcji do strony Zespołu Szkół Mechaniczny w Rzeszowie.

## Zastosowanie w innej szkole
Wykorzystanie aplikacji w innej szkole jest możliwe, jednak wymaga ręcznych zmian w kodzie aplikacji.
Zabronione jest jednak usuwaine, jak i modyfikowanie informacji o autorze kodu (dopuszczalne jest dodanie informacji o osobie odpowiedzialnej za dostosowanie kodu dla szkoły).

## Kompilacja aplikacji
Przed rozpoczęciem kompilacji należy dostosować aplikację poprzez:
* Zmianę ścieżki, na której aplikacja będzie dostępna (zmienna "root" w pliku vite.config.js)
* Dostosowanie danych szkoły (w pliku /src/assets/schoolData.json)
* Zmienienie loga szkoły (plik /public/images/logo.png)

Po dostosowaniu aplikacji do potrzeb szkoły mależy skompilować program:
```
npm run build
```
Następnie należy skopiować pliki z folderu *dist* na serwer szkolny, do ścieżki, która została wcześniej zadeklarowana w kodzie

## Zastosowane technologie
### W wydaniu produkcyjnym:
* Vue.js 3 (Vue Router, Pinia, @VueUse)
* Bootstrap
* Axios.js
* Chroma.js

### Środowisko deweloperskie:
* Node.js 20
* Vite
* Unplugin Auto Imports
* Unplugin Vue Components
* Vite PWA Plugin