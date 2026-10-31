# ShortsStream — YouTube Shorts Channel Player

A minimalist, responsive web player designed specifically for YouTube Shorts. Built with clean vanilla JavaScript, HTML5, and CSS3.

## ✨ Features

- **Channel & Link Parser:**
  - Enter channel handles (e.g., `@veritasium`, `@mkbhd`, `@TEDx`)
  - Paste full YouTube channel URLs or direct YouTube Shorts links
  - Instant preset chips for trending creators (Veritasium, MKBHD, Zach King, TEDx, MrBeast)
- **True 9:16 Vertical Player Frame:**
  - Phone-style bezel with smooth rounded corners and dark aesthetics
  - Minimal translucent bottom overlay with channel badge and video title
- **Intuitive Navigation:**
  - **Next / Previous:** Up / Down arrow buttons or keyboard `↓` / `↑` (or `J` / `K`)
  - **Scroll / Touch gestures:** Mouse wheel scroll or touch swipe up/down to flip shorts
  - **Play / Pause:** Spacebar or floating play button
  - **Mute / Unmute:** `M` key or volume button
  - **Auto-advance & Loop toggles:** Automatically advances to the next short when finished or loops the current one
- **Side Queue Drawer:**
  - Slide-in playlist showing upcoming shorts with thumbnails
  - 1-click jump to any short, plus Shuffle and Clear controls
- **Share & External links:**
  - Copy current short URL in one click
  - Direct shortcut to open the video on YouTube

## 🚀 How to Run

1. Open `index.html` directly in any modern web browser:
   ```powershell
   Start-Process index.html
   ```
2. Or use any local static server (e.g. `npx serve`, Python `python -m http.server 3000`, or Live Server).

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `↓` or `J` | Next Short |
| `↑` or `K` | Previous Short |
| `Space` | Play / Pause |
| `M` | Mute / Unmute |
