# MiawMainGame 🐱🎮

A lightweight, mobile-first web game collection built with Next.js 15, Tailwind CSS, and Framer Motion.

## 🌟 Features

- **4 Unique Stages**:
  1.  **Ketuk Tepat** (Timing): Test your reflex accuracy.
  2.  **Kisi Memori** (Memory): Simon Says style pattern memorization.
  3.  **Tahan & Lepas** (Hold): Charge power to the perfect level (don't explode!).
  4.  **Boss Survival**: Tap rapidly to defeat the boss in 15s (Shake & Flash effects included!).
- **Progressive Unlock**: Complete stages sequentially to face the Boss.
- **Economy System**: Earn 1 Token per stage win.
- **Gacha System**: Spend Tokens to cycle through Zonk, Secret, and Mythic rewards (Reset every 5 pulls).

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand (Persisted locally)
- **Icons**: Lucide React

## 🚀 Getting Started

1.  **Clone the repo:**

    ```bash
    git clone https://github.com/HiroAozora/miawmaingame.git
    cd miawmaingame
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run locally:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` (or your local IP for mobile testing).

## 🌐 Deployment (Vercel)

This project is optimized for Vercel.

1.  Push this code to GitHub.
2.  Go to [Vercel](https://vercel.com) -> **Add New Project**.
3.  Import `miawmaingame` from your GitHub.
4.  **Build Command**: Auto-detected (`next build`).
5.  **Output Directory**: Auto-detected (`.next`).
6.  Click **Deploy**!

> **Note**: No environment variables are required for the base game.
