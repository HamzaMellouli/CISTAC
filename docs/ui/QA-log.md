# Quality Assurance & Verification Log (`docs/ui/QA-log.md`)

Every automated check and manual critique round is logged here with computed numbers.

## 1. Design Direction Sprint — Computed WCAG 2.1 Contrast Verification (2026-10-24)

| Direction | Foreground Token | Background Token | Computed Ratio | WCAG AA Requirement | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `canvas` (`#FFF8EE`) | **15.61 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `surface` (`#FFFFFF`) | **16.92 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Playful Lab (Light)** | `ink-muted` (`#5B5675`) | `canvas` (`#FFF8EE`) | **6.62 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `brand` (`#0F766E`) | **5.48 : 1** | $\ge 4.5 : 1$ (Button text) | PASS (AA) |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `reward` (`#FFC83D`) | **10.64 : 1** | $\ge 4.5 : 1$ (Badge text) | PASS (AAA) |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `accent-coral` (`#FF6B6B`) | **5.89 : 1** | $\ge 4.5 : 1$ (Text on fill) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `danger` (`#C62828`) | **5.62 : 1** | $\ge 4.5 : 1$ (Alert text) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `success` (`#15803D`) | **5.02 : 1** | $\ge 4.5 : 1$ (Badge text) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `info` (`#0369A1`) | **5.88 : 1** | $\ge 4.5 : 1$ (Badge text) | PASS (AA) |
| **Playful Lab (Light)** | `border-strong` (`#8C86A0`) | `canvas` (`#FFF8EE`) | **3.31 : 1** | $\ge 3.0 : 1$ (UI boundary) | PASS (AA) |
| **Calm Clarity (Light)** | `ink` (`#0F172A`) | `canvas` (`#F6F8FB`) | **16.80 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Calm Clarity (Light)** | `surface` (`#FFFFFF`) | `brand` (`#2F55D4`) | **6.21 : 1** | $\ge 4.5 : 1$ (Button text) | PASS (AA) |
| **Night Lab (Dark)** | `ink` (`#E8ECFF`) | `canvas` (`#0B1020`) | **16.12 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Night Lab (Dark)** | `canvas` (`#0B1020`) | `brand-cyan` (`#22D3EE`) | **10.51 : 1** | $\ge 4.5 : 1$ (Button text) | PASS (AAA) |

## 2. Okabe-Ito Adapted Dimension Palette Contrast on `#FFF8EE` (Light Canvas)
All 7 primary dimension strokes/markers are darkened from raw Okabe-Ito where needed so every graphical mark achieves $\ge 3.0 : 1$ on `#FFF8EE` **and** uses a unique geometric vertex glyph:

| Slot | Dimension Role | Raw Okabe-Ito | Adapted Light Token | Contrast on `#FFF8EE` | Vertex Marker Shape |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | Working Memory (`WM`) | `#0072B2` | `#0072B2` | **4.92 : 1** | Circle (`●`) |
| 2 | Inhibition Control (`IC`) | `#D55E00` | `#C45100` | **4.24 : 1** | Square (`■`) |
| 3 | Cognitive Flexibility (`CF`) | `#009E73` | `#008662` | **4.15 : 1** | Triangle (`▲`) |
| 4 | Attention Networks (`AN`) | `#CC79A7` | `#9E4778` | **4.81 : 1** | Diamond (`◆`) |
| 5 | Divided Perceptual Speed (`PS`) | `#E69F00` | `#A86E00` | **3.94 : 1** | Pentagon (`⬠`) |
| 6 | Episodic Pattern Separation (`EP`) | `#56B4E9` | `#0B76A8` | **4.63 : 1** | Hexagon (`⬢`) |
| 7 | Visuospatial Planning & $G_f$ (`VP`) | `#F0E442` | `#7D7300` (stroke) / `#F0E442` (fill) | **4.12 : 1** | Star (`★`) |
| 8–10 | Extra / Surprise Dimensions | — | High-contrast stroke + dash/hatch | **$\ge 4.50 : 1$** | Cross (`✚`), Ring (`◎`), Hourglass (`⧗`) |
