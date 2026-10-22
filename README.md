# Assembly Cocoa YouTube Player

A minimalist, high-performance Cocoa window YouTube interface with offline caching, cross-device sync, performant buffering, ad-blocking, and an integrated page builder.

---

## Prerequisites on macOS

Ensure you have **Node.js** (v18 or higher recommended) and **npm** installed on your Mac:

```bash
# Check if Node is installed
node -v
npm -v
```

If you do not have Node installed, install it via [Homebrew](https://brew.sh):
```bash
brew install node
```

---

## Option 1: Run Locally in Development Mode (Fastest)

1. Open **Terminal.app** and navigate into your downloaded/cloned project directory:
   ```bash
   cd assembly-cocoa-youtube-player
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local Vite server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```

---

## Option 2: Build a Production Bundle & Preview

To compile the optimized, production-ready static assets:

1. Build the application:
   ```bash
   npm run build
   ```
   This generates an optimized standalone static bundle in the `./dist` folder.

2. Preview the production build locally:
   ```bash
   npm run preview
   ```

3. Open `http://localhost:4173` (or the port indicated in terminal).

---

## Option 3: Run as a Native macOS Desktop App (.app)

You have two simple ways to turn this into a standalone macOS window application:

### A. Chrome / Edge / Brave (Single-Click Web App)
1. Run `npm run dev` and open `http://localhost:3000` in Google Chrome or Microsoft Edge.
2. In the browser menu, click **More Tools** → **Save and Share** (or **Install page as app...**).
3. Name it **Assembly Player** and check **Open as window**.
4. The player will now launch in its own native macOS Cocoa window with an app icon in your macOS Dock and Spotlight!

### B. Standalone macOS App via Nativefier / Electron
If you want an independent `.app` bundle:
```bash
# 1. Install nativefier globally or via npx
npx nativefier --name "AssemblyPlayer" \
  --title-bar-style "hiddenInset" \
  --width 1400 \
  --height 900 \
  "http://localhost:3000"
```
This produces an `AssemblyPlayer.app` inside the folder that you can drag straight into `/Applications`.

---

## Troubleshooting on Mac

- **Port 3000 in use**: Run with a different port:
  ```bash
  npx vite --port 3001
  ```
- **Permission issues**: Make sure the project folder has write permissions for your user account.
