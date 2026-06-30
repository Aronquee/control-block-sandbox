# ⚙️ Control Block Diagram Sandbox

[![GitHub last commit](https://img.shields.io/github/last-commit/Aronquee/control-block-sandbox)](https://github.com/Aronquee/control-block-sandbox)
[![GitHub repo size](https://img.shields.io/github/repo-size/Aronquee/control-block-sandbox)](https://github.com/Aronquee/control-block-sandbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://img.shields.io/netlify/your-netlify-id)](https://app.netlify.com/sites/your-site-name/deploys)

**A visual sandbox for building, connecting, and rearranging control‑system block diagrams by hand.**  
No automatic simplification — just you, the canvas, and the rules of signal flow.

![Block diagram sandbox screenshot](screenshot.png)

## ✨ Features

- 🧱 **Drag & drop** blocks, summing points, pickoff points, input/output terminals, and text notes
- ✏️ **Inline editing** – click any label or note to rename transfer functions
- 🔗 **Full‑side connections** – attach wires to **any side** of a block; the arrow follows the drag direction
- 🔴 **Red feedback edges** – toggle a checkbox to draw feedback paths in red
- 🖱️ **Interactive waypoints** – double‑click any wire to add bend points, then drag to shape the path
- 📐 **Reconnectable edges** – grab the arrowhead and rewire without deleting
- 💾 **Save / load** – export your diagram as a JSON file and reopen it later
- 🎨 **Engineering‑inspired UI** – mini‑map, zoom/pan, snap‑to‑grid, and a clean toolbar


## 🧠 Why “sandbox”?

Unlike automatic solvers, this tool respects how you learn control systems:  
**you** decide the block arrangement, **you** move the pickoff points, **you** draw the feedback loops.  
It’s a scratchpad that helps you reason about Mason’s rule, signal‑flow graphs, and block‑diagram algebra **without the computer doing the thinking**.

## 🧰 Tech Stack

- **React 18** + **Vite** (fast development & production builds)
- **React Flow** (custom node/edge rendering, drag‑and‑drop, mini‑map)
- **Plain CSS** (no heavy component library – lightweight and modifiable)

## 🚀 Getting Started (local)

```bash
# clone the repo
git clone https://github.com/Aronquee/control-block-sandbox.git
cd control-block-sandbox

# install dependencies
npm install

# start the dev server
npm run dev
