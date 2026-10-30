# AstroPet — Hand-Crafted Pixel Desktop Companion (macOS / Windows / Linux + Web)

AstroPet is a lightweight, zero-AI-asset desktop pet companion built for the Hack Club Stardance **Playground** mission (`/missions/playground`). It runs natively on desktop (`python3 pet_desktop.py` using transparent always-on-top Tkinter windowing) and directly in the browser (`index.html`) with hand-coded 16x16 pixel sprite matrices, finite-state behavior physics, pomodoro focus hooks, and cursor-chasing kinematics.

## Features
- **100% Hand-Crafted Pixel Matrices**: Every frame (`IDLE`, `WALK_LEFT`, `WALK_RIGHT`, `SLEEP`, `JUMP`, `STUDY`, `SNACK`) is defined as an explicit 16x16 integer color-index bitmap inside `app.js` and `pet_desktop.py` — zero AI-generated art.
- **Autonomous Finite-State Machine (FSM)**: Transitions naturally between wandering along the dock/taskbar ledge, chasing the cursor, napping when idle, celebrating git commits, and eating pixel star-snacks.
- **Cross-Platform Desktop + Browser Demo**:
  - **Web / Playable Link**: `https://aariv.me/astro-pet/`
  - **Desktop Native Runner**: `python3 pet_desktop.py` (macOS / Linux / Windows borderless always-on-top window).
