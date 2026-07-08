# 🧬 The Game of Life (Now with 100% More Existential Dread)

Welcome to Conway's Game of Life. 

This isn't that cheerful board game where you get a plastic minivan, a dog, and fake money. No, this is a cellular automaton—a brutal, microscopic simulation where innocent pixels are born into a rigid grid, struggle desperately to survive in their chaotic neighborhoods, and inevitably die from crushing isolation or suffocating overpopulation. 

It's just like real life, but the suffering is computationally efficient and runs at 60 FPS!

## What's the point?

We're taking a classic computer science concept and adding a bit of "spice" to it. Most Game of Life clones are just sterile black-and-white grids. Boring. We're going to visualize *why* these little bastards are living or dying. 

### Planned Features (The Spice 🌶️)

*   **Heatmaps of Survival:** See which cells are stubbornly clinging to life generation after generation. The brighter they glow, the longer they've evaded the grim reaper.
*   **The Autopsy Tooltips:** Hover over any doomed cell to see *exactly* why it's about to perish in the next tick (too many neighbors? too few? just bad luck?).
*   **Demographic Collapse Charts:** Real-time line graphs showing the inevitable rise and fall of our fragile digital societies. 

## Getting Started (Assuming you want to play God)

If you want to clone this repository and run the simulation on your own machine, you'll need Node.js. 

```bash
# 1. Clone this repo of sadness
git clone https://github.com/tommardev/game-of-life.git

# 2. Enter the void
cd game-of-life

# 3. Install the dependencies (because nothing exists in isolation)
npm install

# 4. Spin up the server and watch the life cycles
npm run dev
```

## The Rules of Engagement

In case you forgot the laws of this cruel universe:

1.  **Underpopulation:** Any live cell with fewer than two live neighbors dies (loneliness is a killer).
2.  **Survival:** Any live cell with two or three live neighbors lives on to the next generation (the sweet spot of mediocrity).
3.  **Overpopulation:** Any live cell with more than three live neighbors dies (nobody likes traffic).
4.  **Reproduction:** Any dead cell with exactly three live neighbors becomes a live cell (a miracle of immaculate digital conception).

Enjoy playing God. Try not to let the power go to your head.
