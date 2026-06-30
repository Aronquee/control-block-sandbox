# 🧠 Control Block Diagram Sandbox

> A visual, interactive sandbox for manually building and rearranging control‑system block diagrams.  
> No automatic simplification — just you and the diagram, exactly like solving an exercise by hand.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/react-18.x-61dafb)
![Vite](https://img.shields.io/badge/vite-5.x-646cff)

<p align="center">
  <img src="demo.gif" alt="Block diagram sandbox demo" width="700"/>
</p>

## 🎯 Why this exists

Control‑theory exercises often require you to manually manipulate block diagrams: move summing points, pickoff points, and feedback loops, then simplify them step by step. This tool is a **pure drawing board** – it gives you the pieces and lets you arrange, connect, and re‑arrange them without any automatic algebra. You stay in full control.

Perfect for students, teachers, or anyone who wants a friction‑less way to sketch feedback systems and experiment with signal flow.

## ✨ Features

- **Drag & drop toolbox** – Blocks, summing points, pickoff points, input/output terminals, and text notes.
- **Bidirectional connections** – Draw arrows **from and to any side** of a block. Build feedback loops naturally.
- **Red feedback edges** – Toggle a mode to draw back‑propagation paths in red.
- **Interactive waypoints** – Double‑click an edge to add bend points. Drag them to route lines exactly where you want.
- **Editable labels** – Click any block or note to type a transfer function or annotation.
- **Save / Load** – Export your diagram as a JSON file and load it later.
- **Pan & zoom** – Infinite canvas with minimap and controls.
- **Clean, modern UI** – Lightweight, responsive, and built for mouse + keyboard.

## 🛠️ Tech Stack

| Layer        | Technology |
|--------------|------------|
| UI framework | React 18   |
| Graph engine | [React Flow](https://reactflow.dev/) |
| Build tool   | Vite       |
| Styling      | CSS (custom) |
| Deployment   | Netlify / GitHub Pages / any static host |

## 🚀 Quick Start (run locally)

Make sure you have **Node.js 18+** and **npm** installed.


# Clone the repository
git clone https://github.com/Aronquee/control-block-sandbox.git
cd control-block-sandbox

# Install dependencies
npm install

# Start the development server
npm run dev
Open http://localhost:5173 in your browser.
The sandbox is ready!

📖 How to Use

    Drag components from the left toolbar onto the canvas.

    Connect them by dragging from one handle (small dot) to another.

        Right‑click a node to delete it.

        Double‑click a block’s text to edit the transfer function.

        Double‑click on any edge to add a waypoint; drag the waypoint to bend the line.

        Toggle “Red feedback edge” in the toolbar to draw feedback paths in red.

    Use the minimap (bottom‑right) and controls (top‑left) to navigate.

    Save your diagram as a .json file (button in toolbar) and load it back anytime.

🗺️ Planned Features (maybe)

    Undo / Redo

    Automatic alignment and snap‑to‑grid

    Grouping nodes into subsystems

    Export to SVG / PNG for reports

📦 Deployment

You can host the sandbox on any static hosting service.
For example, to deploy on Netlify:

    Push your code to GitHub.

    Go to Netlify, import the repository.

    Set build command: npm run build, publish directory: dist.

    Done! You’ll get a public URL.

For GitHub Pages, add a vite.config.js base path and use the gh-pages package – see the Vite deployment guide for details.

🤝 Contributing

This is a side project for a university discipline, but ideas and pull requests are welcome!
If you find a bug or have a feature idea, open an issue or reach out.

📄 License

MIT – feel free to use, modify, and share.

