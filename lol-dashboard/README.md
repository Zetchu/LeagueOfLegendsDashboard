# 🧙‍♂️ League of Legends Dashboard

---

### 🌐 **Live Demo**

👉 [League of Legends Dashboard](https://league-of-legends-dashboard-five.vercel.app/)

A **React + TypeScript** project built with **Vite** and **Material UI (MUI)** that fetches real League of Legends data from the **Data Dragon API**.  
The app provides an interactive dashboard to browse champions, view details, manage favorites, and plan custom builds — all stored locally.

---

## 🚀 Tech Stack

| Technology             | Purpose                               |
| ---------------------- | ------------------------------------- |
| **Vite**               | Fast development bundler              |
| **React (TypeScript)** | Frontend framework                    |
| **Material UI (MUI)**  | UI components and styling             |
| **Axios / Fetch**      | API calls to Riot’s Data Dragon       |
| **Local Storage**      | Persist user data (favorites, builds) |
| **React Router DOM**   | Page routing between features         |

---

## 🗂️ Features Overview

### 🧩 **Champion Browser**

- Fetches all champions dynamically from the **Riot Data Dragon API**.
- Search and filter by **role/class** (Assassin, Fighter, Mage, etc.).
- Responsive grid layout using MUI’s `<Grid>` system.
- Each champion card shows:
  - Image, difficulty chip, and role tags.
  - Favorite toggle (❤️) with local storage persistence.

### 📜 **Champion Dialog**

- Opens when clicking on a champion.
- Displays detailed champion info:
  - Overview and lore
  - Abilities (Q/W/E/R + Passive)
  - Base stats
  - Skins with splash art carousel
- Built using **MUI Dialog**, **Tabs**, and responsive layout.

### 🧱 **Build Planner**

- Dedicated route `/build-planner`.
- Choose a **champion** → select up to 6 **items**.
- Calculates total **gold cost** and **aggregated stats**.
- Save builds locally with custom names.
- Saved builds are listed below with delete functionality.
- Uses `localStorage` for persistence (no backend needed).

### ❤️ **Favorites**

- Toggle favorites from champion cards.
- “Favorites only” filter to quickly view your marked champions.
- All stored locally (even after reload).

---

## 🧠 Implementation Highlights

- **MUI Theming:**  
  Global dark theme using `ThemeProvider` and custom fonts (`Cinzel`, `Inter`, `Roboto`).

- **Routing:**  
  Implemented via `BrowserRouter` with routes for:

  - `/` → Champion Dashboard
  - `/builds` → Build Planner Page

- **Data Layer:**  
  API logic organized under `/api` and `/hooks` folders for cleaner reusability.

- **Code Quality:**  
  Functional components with hooks, strong TypeScript typing, and modular file structure:

```bash
  src/
  ├── api/                  # All API calls (fetch champion & item data)
  ├── app/                  # Theme setup, context providers
  ├── champions/            # Champion-related logic & components
  │   ├── components/       # ChampionCard, ChampionDialog, etc.
  │   └── skins/            # SkinCarousel and related logic
  ├── hooks/                # Custom React hooks for fetching & storage
  ├── pages/                # App routes (e.g., BuildPlanner, Home)
  ├── types/                # Shared TypeScript type definitions
  ├── main.tsx              # Application entry point
  ├── App.tsx               # Router + layout
  └── index.css             # Global styling
```


---

## 🧭 Getting Started

# 1️⃣ Install dependencies

```bash
npm install
```

# 2️⃣ Run locally

```bash
npm run dev
```

# 3️⃣ Build for production

```bash
npm run build
npm run preview
```

## 💾 Data Source

All champion and item data comes from:

Riot Games Data Dragon API
https://ddragon.leagueoflegends.com/
