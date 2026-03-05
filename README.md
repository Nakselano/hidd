# Uruchomienie

## Wymagania
* Runtime: Node.js (18 lub nowszy)
* Zależności: ```RSS-parser``` oraz ```Playwright```
## Pobieranie
```npm install```
```npx playwright install chromium```
## Uruchomienie 
1. Wewnątrz folderu uruchamiamy polecenie ```node .```.
2. Jako, że plik ```state.json``` nie istnieje, otworzy się widoczne okno przeglądarki.
3. Po otworzeniu się okna mamy 60 sekund na zalogowanie się na swoje konto Google.
4. Po upływie czasu skrypt zapisze naszą sesję do pliku ```state.json``` i zacznie generować "szum".
5. Przy następnych uruchomieniach wykryjemy istanienie pliku ```state.json```, dzieki czemu nie musimy się już logować.

