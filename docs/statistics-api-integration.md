# Integracja statystyk z zewnętrznego API (zamiast Drupala)

**Status:** Moduł `lib/statistics-api/` jest zaimplementowany (client, mappers, `getStatisticsForCategory`). Integracja w serwisach stron (podmiana `field_statistics_items` na wywołanie API) jest **nie zrobiona** – strony nadal korzystają z Drupala.

## 1. Co dokładnie jest w queries

### 1.1 Patents (oraz industrial designs, plants, integrated circuits)

**Widok:** `vw_ip_information_patents`  
**Pole `domain`:** `iac_application_category_desc` – rozróżnia: Patents, Industrial designs, Plant varieties, Integrated circuits.

| Typ            | Kolumna roku                      | Zwracane pola                                      |
|----------------|------------------------------------|----------------------------------------------------|
| **Filing**     | `extract(year from iai_filling_date_g)`  | `domain`, `year`, `count_of_applications`, `applicant_category` |
| **Registered** | `extract(year from ici_certificate_grant_date_g)` | to samo                                            |

Grupowanie: `domain`, rok, `applicant_category`.  
Na froncie: wykres liniowy „Filing by year”, wykres liniowy „Registered by year”, wykres kołowy „Applicant type” (z `applicant_category`).

---

### 1.2 Trademarks

**Widok:** `vw_ip_information_trademarks`

| Typ            | Kolumna roku              | Zwracane pola (po poprawce)                         |
|----------------|---------------------------|-----------------------------------------------------|
| **Filing**     | `extract(year from fillingdate)`   | `count_of_applications`, **year** (obecny błąd: alias `count_of_applications`), `owner_type` |
| **Registered** | `extract(year from registrationdate)` | to samo                                            |

Filtr: `year >= 2019`.  
**Uwaga:** W oryginalnym SQL druga kolumna ma alias `count_of_applications` zamiast `year` – na serwerze powinna zwracać rok i mieć alias `year`.

Na froncie: line „Filing by year”, line „Registered by year”, pie „Owner type” (z `owner_type`).

---

### 1.3 Copyrights

**Widok:** `vw_ip_information_copyrights`

| Typ            | Kolumna roku                | Zwracane pola                          |
|----------------|-----------------------------|----------------------------------------|
| **Filing**     | `extract(year from submission_date)`   | `year`, `applicant_category` (claimanttype), `count_of_applications` |
| **Registered** | `extract(year from registration_date)` | to samo                                |

Na froncie: line „Filing by year”, line „Registered by year”, pie „Applicant/claimant type” (z `applicant_category`).

---

## 2. Mapowanie: strona → dane → karty w UI

Obecnie na każdej stronie (Patents, Trademarks, Copyrights, Designs, Plant Varieties, Integrated Circuits) sekcja statystyk dostaje z Drupala **tablicę kart** w formacie `StatisticsCardType[]`:

- **Karta 1:** `chartType: 'line'` – np. „Number of patent applications in 2023”, `chartData: [{ value }, ...]`
- **Karta 2:** `chartType: 'line'` – np. „Number of registered patents in 2023”
- **Karta 3:** `chartType: 'pie'` – np. „Applicant's type”, `breakdown: [{ label, value, displayValue, color }]`

Źródło ma się zmienić z: **Drupal (paragraph `statistics_item`)** na **odpowiedzi z zewnętrznego API**, zmapowane do tego samego formatu.

| Strona / kategoria | Źródło API (propozycja) | Karty do wygenerowania |
|--------------------|-------------------------|-------------------------|
| **Patents**        | `GET .../patents/filing`, `.../patents/registered` | Line: filing by year (sum po roku). Line: registered by year. Pie: breakdown po `applicant_category`. |
| **Trademarks**     | `GET .../trademarks/filing`, `.../trademarks/registered` | Line: filing by year. Line: registered by year. Pie: breakdown po `owner_type`. |
| **Copyrights**    | `GET .../copyrights/filing`, `.../copyrights/registered` | Line: filing by year. Line: registered by year. Pie: breakdown po `applicant_category` (claimanttype). |
| **Designs**        | Ten sam widok co Patents, filtr po `domain` = odpowiednia wartość (np. Industrial designs) | Jak wyżej, dane tylko dla jednego `domain`. |
| **Plant varieties** | Jak wyżej, `domain` = Plant varieties | Jak wyżej. |
| **Integrated circuits** | Jak wyżej, `domain` = odpowiednia wartość | Jak wyżej. |

---

## 3. Zaimplementowany client (ścieżki)

Moduł `lib/statistics-api/client.ts` wywołuje (relative do `NEXT_PUBLIC_STATISTICS_API_URL`):

- `GET {base}/patents/filing?domain=...` (parametr `domain` opcjonalny)
- `GET {base}/patents/registered?domain=...`
- `GET {base}/trademarks/filing`
- `GET {base}/trademarks/registered`
- `GET {base}/copyrights/filing`
- `GET {base}/copyrights/registered`

Timeout: 15 s. Oczekiwany response: JSON – tablica obiektów w kształtach z sekcji 3.1–3.3 poniżej.

---

## 4. Kontrakt API (co ma zwracać serwer)

Serwer wykonuje podane SQL-e i udostępnia wyniki przez REST. Propozycja:

### 3.1 Patents (oraz domain dla designs/plants/ICs)

- **Filing:** np. `GET /api/statistics/patents/filing` lub `.../patents?type=filing`, opcjonalnie `?domain=...` (Patents | Industrial designs | Plant varieties | Integrated circuits).
- **Odpowiedź:** tablica obiektów:
  - `domain: string`
  - `year: number`
  - `count_of_applications: number`
  - `applicant_category: string`

- **Registered:** np. `GET /api/statistics/patents/registered` (albo `?type=registered`), ten sam kształt odpowiedzi.

### 3.2 Trademarks

- **Filing:** `GET /api/statistics/trademarks/filing`  
  Odpowiedź: `{ year: number, count_of_applications: number, owner_type: string }[]`
- **Registered:** `GET /api/statistics/trademarks/registered` – to samo.

(W SQL drugą kolumnę roku trzeba zwracać jako `year`, nie `count_of_applications`.)

### 3.3 Copyrights

- **Filing:** `GET /api/statistics/copyrights/filing`  
  Odpowiedź: `{ year: number, applicant_category: string, count_of_applications: number }[]`
- **Registered:** `GET /api/statistics/copyrights/registered` – to samo.

---

## 5. Jak zintegrować w kodzie (do zrobienia)

### 5.1 Zmienna środowiskowa

- Dodać np. `NEXT_PUBLIC_STATISTICS_API_URL` w `.env*` (bez końcowego slasha).
- Użyć jej tylko do wywołań statystyk (nie Drupal).

### 5.2 Moduł API statystyk (gotowy)

**Lokalizacja:** `saip/lib/statistics-api/` — pliki: `config.ts`, `types.ts`, `client.ts`, `mappers.ts`, `index.ts`.

- **`config.ts`** — `getStatisticsApiBaseUrl()`, `isStatisticsApiConfigured()` (czy ustawiono `NEXT_PUBLIC_STATISTICS_API_URL`).
- **`types.ts`** — `PatentsStatRow`, `TrademarksStatRow`, `CopyrightsStatRow`, `StatisticsCategory`, `PatentsDomain`.
- **`client.ts`**  
  - Funkcje: `fetchPatentsFiling(domain?: string)`, `fetchPatentsRegistered(domain?)`, `fetchTrademarksFiling()`, `fetchTrademarksRegistered()`, `fetchCopyrightsFiling()`, `fetchCopyrightsRegistered()`.
  - Wewnątrz: `fetch(`${process.env.NEXT_PUBLIC_STATISTICS_API_URL}/...`)`, obsługa błędów, zwrot surowych tablic (np. typy `PatentsStatRow[]` itd.).

- **`mappers.ts`**  
  - Wejście: surowe wiersze z API.  
  - Wyjście: `StatisticsCardType[]` (zgodne z `StatisticsSection.types.ts`).
  - Dla **line:** grupowanie po `year`, suma `count_of_applications` → `chartData: [{ date: String(year), value }]` (lub `value` tylko, jeśli komponent nie wymaga `date`). Etykiety kart z tłumaczeń (np. „Number of patent applications by year”).
  - Dla **pie:** grupowanie po `applicant_category` / `owner_type`, suma count, procenty, kolory (np. paleta z `StatisticsCard`) → `breakdown: [{ label, value, displayValue, color }]`.

- **`index.ts`**  
  - Eksport: np. `getStatisticsForCategory(category: 'patents' | 'trademarks' | 'copyrights', domain?: string): Promise<StatisticsCardType[]>`.
  - W środku: wywołanie odpowiednich `fetch*`, potem mapper. Dla designs/plants/ICs: wywołać `fetchPatents*` z odpowiednim `domain`.

### 5.3 Gdzie podstawić API zamiast Drupala

W każdym serwisie strony (Patents, Trademarks, Copyrights, Designs, Plant Varieties, Integrated Circuits) sekcja `overview.statistics` jest ustawiana w jednym miejscu: w funkcji, która buduje obiekt strony (transform po nodzie Drupal) lub w fallbacku.

**Obecny przepływ (np. Patents):**

1. `getPatentsPageData(locale)` ładuje node strony z Drupala.
2. `transformPatentsPage(...)` czyta `node.relationships.field_statistics_items` i mapuje paragrafy przez `transformStatisticsItem` → `statisticsItems`.
3. Jeśli `statisticsItems.length === 0`, jest dodatkowe fetchowanie paragrafów `statistics_item` po `parent_id`.
4. `data.overview.statistics = { statistics: statisticsItems, statisticsTitle, ... }`.
5. Przy błędzie Drupala używany jest `getPatentsFallbackData()` z na stałe wpisanymi kartami.

**Docelowy przepływ:**

1. Nadal ładujesz resztę strony z Drupala (hero, guide, publications, journey, services, media, relatedPages).
2. **Statystyki:** zamiast brać je z `field_statistics_items` i paragrafów:
   - Wywołaj `getStatisticsForCategory('patents')` (albo odpowiednio `'trademarks'`, `'copyrights'`, dla designs/plants/ICs: `'patents'` z `domain`).
   - Jeśli odpowiedź OK: `data.overview.statistics.statistics = result`.
   - Tytuł/CTA sekcji możesz dalej brać z Drupala (`field_statistics_title`, `field_statistics_cta_*`) albo z tłumaczeń; jeśli API nie zwraca metadanych, użyj stałych/tłumaczeń.
3. Jeśli wywołanie API rzuci błąd (sieć, 5xx): użyj **fallbacku** – np. obecna tablica z fallbacku w serwisie (jak w `getPatentsFallbackData`) albo pusta tablica + komunikat w UI (zgodnie z wymaganiami).

**Konkretne pliki do edycji:**

| Plik | Zmiana |
|------|--------|
| `saip/lib/drupal/services/patents.service.ts` | W `getPatentsPageData`, po zbudowaniu `data` z transform: nie uzupełniaj statystyk z Drupala; wywołaj `getStatisticsForCategory('patents')`, podstaw wynik pod `data.overview.statistics.statistics`. W catch: zostaw obecny fallback (już ma statystyki). |
| `saip/lib/drupal/services/trademarks.service.ts` | Analogicznie: źródło `overview.statistics.statistics` = `getStatisticsForCategory('trademarks')`, fallback przy błędzie. |
| `saip/lib/drupal/services/copyrights.service.ts` | To samo dla `getStatisticsForCategory('copyrights')`. |
| `saip/lib/drupal/services/designs.service.ts` | Źródło statystyk = `getStatisticsForCategory('patents', 'Industrial designs')` (wartość `domain` do ustalenia z backendem). Fallback jak teraz. |
| `saip/lib/drupal/services/plant-varieties.service.ts` | `getStatisticsForCategory('patents', 'Plant varieties')` (lub wartość z widoku). |
| `saip/lib/drupal/services/topographic-designs.service.ts` (integrated circuits) | `getStatisticsForCategory('patents', '...')` z odpowiednim `domain`. |

W każdym z tych serwisów można **usunąć lub pominąć**:
- pobieranie `field_statistics_items` z noda,
- ewentualne osobne fetchowanie paragrafów `statistics_item` dla tej strony.

Tytuły i CTA sekcji statystyk (`statisticsTitle`, `statisticsCtaLabel`, `statisticsCtaHref`) można nadal brać z Drupala (jeśli node je ma) albo z jednego miejsca/tłumaczeń.

### 5.4 Format kart (przypomnienie)

`StatisticsCardType` (z `StatisticsSection.types.ts`):

- `label: string`
- `value?: string | number` (opcjonalnie, np. ostatnia wartość lub suma)
- `chartType?: 'line' | 'pie' | 'bar'`
- `chartData?: Array<{ value: number, date?: string }>` – dla line
- `breakdown?: Array<{ label: string, value: number, displayValue?: string, color: string }>` – dla pie
- `trend?: { value: string, direction: 'up' | 'down' | 'neutral', description?: string }` – opcjonalnie

Mapper powinien produkować dokładnie taki format, żeby `StatisticsSection` / `StatisticsCard` działały bez zmian.

---

## 6. Podsumowanie

- **Queries:** dają wiersze po domain (patents view), year, count, applicant/owner/claimant category; osobno filing i registered.
- **Serwer:** ma wystawić endpointy (filing/registered) per kategoria i zwracać JSON jak wyżej; w trademarks drugą kolumnę zwracać jako `year`.
- **Front:** jeden moduł `lib/statistics-api/` (client + mappers → `StatisticsCardType[]`), jedna funkcja `getStatisticsForCategory(category, domain?)`. W serwisach stron Patents, Trademarks, Copyrights, Designs, Plant Varieties, Integrated Circuits – zamiast Drupala podstawiasz wynik tej funkcji do `overview.statistics.statistics`, z fallbackiem przy błędzie API.

Po tych krokach istniejące statystyki na podstronach Patents, Trademarks, Copyrights itd. będą korzystać z zewnętrznego API zamiast danych wprowadzanych w Drupalie.
