# ✈️ Windows on the World

**WEB102 – Project 5 | Hien Vo**

An interactive, StumbleUpon-style aviation photography discovery app built with **React + Vite**.

---

## 🌍 What It Does

Every click of the **🔀 Discover!** button randomly selects an aviation-themed phrase, queries the [Unsplash API](https://unsplash.com/developers) for a landscape photo, and displays it alongside four descriptive tags.

| Feature | Description |
|---|---|
| **Topic Roulette** | 35+ aviation phrases randomly selected per request |
| **Tag Display** | The last 4 (most unique) tags from the API response are shown in a 2×2 grid |
| **Ban List** | Click a tag to ban it — future images containing that tag are silently skipped |
| **Unbanning** | Click a banned tag in the right sidebar to remove it from the ban list |
| **History** | The 4 most recently discovered images are tracked in the left sidebar |

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Node.js ≥ 18
- A free [Unsplash Developer](https://unsplash.com/developers) account (Demo tier)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your API Key

Create a `.env.local` file in the project root and add your Unsplash Access Key:

```
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

> **Note:** The Demo tier allows 50 requests/hour. If images stop loading during heavy testing, you may have hit the rate limit.

### 3. Start the Dev Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🗂️ Project Structure

```
src/
├── App.jsx            # Main component – state, API logic, layout
├── App.css            # 3-column flexbox layout + component styles
├── aviationTopics.jsx # Curated array of 35+ aviation query phrases
├── index.css          # Global CSS reset
└── main.jsx           # React entry point
```

---

## ⚙️ Key Technical Concepts

- **Complex State Management** – `currentImage`, `currentTags`, `banList`, `history` state variables
- **API Integration & Filtering** – Unsplash REST API with client-side ban-collision detection
- **Recursive Fetching** – `fetchRandomImage` calls itself when a banned tag is detected
- **Responsive Layout** – 3-column Flexbox (250px | flex-grow | 250px)

---

## 🎥 Demo GIF

- Place your preview GIF in the [public](public) folder (e.g., `public/demo.gif`) so Vite serves it at `/demo.gif`.
- After adding it, you can embed it here:

```markdown
![App preview](public/demo.gif)
```
