# EFREI — Academic Platform | TI402 Web Project

> A responsive, multi-page academic website built with vanilla HTML, CSS, and JavaScript for the EFREI Computer Science Department.

**Live Demo:** [benoittailhades.github.io/Fotso_Tailhades_WebProject](https://benoittailhades.github.io/Fotso_Tailhades_WebProject/)
**Repository:** [github.com/benoitTailhades/Fotso_Tailhades_WebProject](https://github.com/benoitTailhades/Fotso_Tailhades_WebProject.git)

---

## Overview

This project is an interactive academic platform developed as part of the TI402 Web Programming course at EFREI Paris. It centralizes information about courses, faculty, research publications, and weekly schedules in a single cohesive web experience.

---

## Pages

| Page | Description |
|---|---|
| **Home** (`index.html`) | Landing page with featured news cards linking to external articles |
| **Formations** (`html/formations.html`) | Course catalog grouped by year (P1 → ING3) with carousel navigation |
| **Syllabus** (`html/syllabus.html`) | Dynamically generated course detail page with topics, outcomes, and evaluation |
| **Teachers** (`html/teachers.html`) | Faculty list dynamically loaded from JSON |
| **Teacher Profile** (`html/teacher_profile.html`) | Individual profile with biography, office hours, and published articles |
| **Planning** (`html/planning.html`) | Weekly calendar with year/semester filters and a real-time time indicator |
| **Research** (`html/research.html`) | List of research publications loaded dynamically from JSON |
| **Articles** (`html/articles/`) | Four in-depth research articles with MathJax-rendered equations |
| **Contact / About** (`html/contact.html`) | Contact form with JS validation and an About Us section |

---

## Key Features

- **Animated Navigation Bar** — A smooth sliding underline cursor follows the active nav item using CSS transitions and JS.
- **Dynamic Content** — Teachers, formations, planning events, research articles, and syllabi are all driven by JSON data files, making the site easy to maintain.
- **Interactive Calendar** — Weekly schedule generated in JavaScript with color-coded events, a filter system (year & semester), and a red line indicating the current time.
- **JS Form Validation** — The contact form validates all fields client-side (name, email format, 10-digit phone number, message) before submission.
- **Responsive Design** — Full mobile support via CSS media queries, including a hamburger menu for small screens.
- **MathJax Integration** — Research article pages render LaTeX mathematical notation in the browser.
- **Course Carousels** — Formations are browsable via smooth-scrolling carousels, adapting to 1 card per row on mobile.

---

## Tech Stack

- **HTML5** — Semantic structure, forms, tables
- **CSS3** — Flexbox, Grid, custom properties (CSS variables), transitions, media queries
- **JavaScript (ES6+)** — DOM manipulation, `fetch` API, `async/await`, dynamic rendering
- **MathJax 3** — LaTeX equation rendering in research articles
- **JSON** — Data source for teachers, formations, planning events, and articles

---

## Project Structure

```
/
├── index.html                  # Home page
├── css/
│   └── style.css               # Global stylesheet
├── js/
│   └── script.js               # All JavaScript logic
├── html/
│   ├── formations.html
│   ├── syllabus.html
│   ├── teachers.html
│   ├── teacher_profile.html
│   ├── planning.html
│   ├── research.html
│   ├── contact.html
│   └── articles/
│       ├── Article1.html       # Distributed Optimization
│       ├── Article2.html       # Spectral Graph Analysis
│       ├── Article3.html       # PCA & Diagonalization
│       └── Article4.html       # Shannon Entropy
├── json/
│   ├── formations_data.json    # All course data + syllabi
│   ├── teacher_data.json       # Faculty profiles
│   ├── articles_data.json      # Research publication metadata
│   └── office_hour.json        # Planning calendar events
└── img/                        # All image assets
```

---

## Color Palette

| Variable | Hex | Usage |
|---|---|---|
| `--dark-navy` | `#00171F` | Hero backgrounds, footers |
| `--mid-navy` | `#003459` | Nav border, table headers, meta bars |
| `--teal-hero` | `#007EA7` | Section accents |
| `--accent-cyan` | `#00A8E8` | Active nav, buttons, highlights |


---

## Authors

- **Nolann FOTSO**
- **Benoît TAILHADES** 
- Team project — EFREI Paris, Département Informatique, 2025–2026