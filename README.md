# Projekt ZSM TimeTable

Aplikacja została przygotowana w ramach projektu dodatkowego.<br>
Miała na celu dodanie nowego planu lekcji do strony Zespołu Szkół Mechanicznych w Rzeszowie.

## Zastosowanie w innej szkole

Wykorzystanie aplikacji w innej szkole jest możliwe, jednak może to wymagać ręcznych zmian w kodzie aplikacji.<br>
Zabronione jest jednak usuwanie, jak i modyfikowanie informacji o autorze kodu (dopuszczalne jest dodanie informacji o osobie odpowiedzialnej za dostosowanie kodu dla szkoły).

## Kompilacja aplikacji

### 1) Przed rozpoczęciem kompilacji należy dostosować aplikację poprzez:

\* Opcjonalnie - Wymagane założenie konta i znajomość obsługi panelu
- Zmienienie loga szkoły (plik /public/images/logo.png)
- \* Wprowadzenie zmiennej środowiskowej ***CF_BEACON_TOKEN*** (Do śledzenia statystyk poprzez Cloudflare Insights)
- \* Wprowadzenie zmiennej środowiskowej ***SENTRY_DSN_URL*** (Do automatycznego zgłaszania błędów poprzez Sentry)

### 2) Po dostosowaniu aplikacji do potrzeb szkoły należy skompilować program:

#### 2a) Dla domyślnej ścieżki (https://example.com)

```bash
npm run build
```

#### 2b) Dla własnej ścieżki (https://example.com/plan_lekcji)

```bash
npm run build -- --base "/ściezka/"
```

### 3) Następnie należy skopiować pliki z folderu _dist_ na serwer szkolny, do ścieżki, która została wcześniej zadeklarowana.

### 4) Po skopiowaniu plików należy:

- **[OBOWIĄZKOWO]** *Dotyczy serwera Apache (w innej sytuacji należy ręcznie dostosować serwer)* <br />Wybrać prawidłowy dla domeny plik **_.htaccess_** (www lub non-www) i zmienić jego nazwę na _.htaccess_ (drugi plik należy usunąć)
- **[OBOWIĄZKOWO]** <br />Dostosować dane szkoły zgodnie z plikiem **_schoolData.template.js_** (zmienić nazwę na _schoolData.js_ i dostosować zawartość)
- **[OPCJONALNIE]** <br />Dostosować dane planu lekcji zgodnie z plikiem **_timetableData.template.js_** (zmienić nazwę na _timetableData.js_ i dostosować zawartość)

## Zastosowane technologie

### W wydaniu produkcyjnym:

- Vue.js 3 (Vue Router, @VueUse, Floating Vue)
- Axios.js - Pobieranie planów lekcji
- Chroma.js - Generowanie kolorów lekcji
- @nozbe/microfuzz - Wyszukiwarka

#### Do monitorowania błędów i wydajności

- Cloudflare Insights
- Sentry Vue App Monitoring

### Środowisko deweloperskie:

- Node.js 20
- Vite
- Unplugin Auto Imports
- Unplugin Vue Components
- Vite PWA Plugin
