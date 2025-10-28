# 🔍 Animacja X-Ray - Efekt Prześwietlania Produktu

## Opis
Animacja symulująca prześwietlanie produktu na obrazie przez poruszanie okręgiem (maską) podążającym za kursorem myszy. W okręgu wyświetla się fragment obrazu X-Ray.

## Funkcje
- ✅ Okrąg podąża za kursorem myszy z płynną animacją
- ✅ Automatyczny ruch gdy mysz opuści obszar
- ✅ Efekt prześwietlenia - ujawnia alternatywny obraz w okręgu
- ✅ Świecąca ramka okręgu dla lepszego efektu wizualnego
- ✅ Interaktywne kontrolki (rozmiar maski, prędkość, start/stop)
- ✅ Responsywny design

## Jak używać własnych obrazów z Figma

### Krok 1: Wyeksportuj obrazy z Figma
1. Otwórz projekt w Figma
2. Wyeksportuj pierwszy obraz (normalny widok palety) jako `paleta-normal.jpg`
3. Wyeksportuj drugi obraz (widok X-Ray) jako `paleta-xray.jpg`

### Krok 2: Umieść obrazy w projekcie
```bash
# Utwórz folder dla obrazów
mkdir -p public/images

# Skopiuj swoje obrazy do folderu:
# public/images/paleta-normal.jpg  - obraz tła (paleta produktów)
# public/images/paleta-xray.jpg   - obraz prześwietlenia (X-Ray)
```

### Krok 3: Uruchom animację
```bash
# Otwórz plik w przeglądarce
open xray-effect-test.html
```

## Struktura plików
```
App01/
├── xray-effect-test.html          # Główny plik animacji
├── public/
│   └── images/
│       ├── paleta-normal.jpg      # Obraz tła (z Figma)
│       └── paleta-xray.jpg        # Obraz X-Ray (z Figma)
└── README.md                      # Ten plik
```

## Parametry do dostosowania

W pliku `xray-effect-test.html` możesz zmienić:

```javascript
// Rozmiar okręgu prześwietlenia
this.maskRadius = 150;  // piksele

// Płynność ruchu (0-1)
this.smoothing = 0.12;

// Prędkość automatycznego ruchu
this.autoMoveSpeed = 0.02;

// Promień automatycznego ruchu
this.autoMoveRadius = 120;
```

## Kontrolki interaktywne
- **Przycisk Start/Stop** - włącza/wyłącza automatyczny ruch
- **Suwak rozmiaru** - zmienia wielkość okręgu (50-300px)
- **Suwak prędkości** - dostosowuje prędkość ruchu (1-10)

## Fallback
Jeśli obrazy z Figma nie zostaną załadowane, animacja automatycznie użyje wygenerowanych placeholderów, więc zawsze będzie działać.

## Integracja z projektem
Aby osadzić animację na stronie internetowej, skopiuj zawartość pliku `xray-effect-test.html` do swojego projektu i dostosuj ścieżki do obrazów.







