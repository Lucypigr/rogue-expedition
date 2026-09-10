# 燼境 · EMBERFALL

A complete single-run survival roguelike built with HTML, CSS and native JavaScript ES modules. No production dependencies, external assets, build step, tracking, or API keys.

## Play

Use the deployed Site, or serve this repository over HTTP. The root `index.html` forwards to `dist/`, making existing GitHub Pages deployments compatible.

```sh
npm start
# Open http://localhost:8080
```

Desktop: WASD / arrows to move, Space to dash, Escape or P to pause, B to open/close the gem workshop. The diamond button also opens the workshop on mobile. Opening it freezes simulation, and closing it returns to the previous menu, pause, upgrade selection, or live combat state. Three presets can be freely edited. Socket configurations survive restarting within the same page; gem refinements reset each run. Mobile: left joystick and right dash button. Fireballs automatically target nearby enemies. Collect crystals to level up, choose one of three randomized upgrades, and defeat the boss that appears after 3 minutes. A complete run normally takes 4–6 minutes. Refreshing resets the current run; the longest survival time is saved locally when storage is available.

## Implemented

- Seeded 2400×2400 forest maps, rocks, trees, paths, a starting ruin, terrain collision, camera and desktop minimap.
- Eight enemy archetypes: melee crawler, fast runner, ranged shaman, heavy brute, charging beast, poison spitter, summoner, and terrain-phasing wraith.
- One of three bosses is randomly selected per run: Ash Guardian (fire barrages / blasts), Winter Queen (ice fans / delayed frost circles), or Brood Mother (summons / poison pools / poison rings). Each attacks faster below half health.
- Experience, escalating level requirements, common / rare / epic refinement rewards and global passive upgrades.
- Three simultaneously equipped skill groups, each linking one active gem and three compatible support gems. Six active gems: fireball, ice lance, chain lightning, ice nova, orbit blades, meteor. Ten supports: multi-shot, pierce, chain, fork, echo, area, fast casting, ignite, life leech, culling. All gems are usable at the beginning of a run. Each gem may only occupy one socket; incompatible combinations and duplicate placements are rejected. Supports alter only their linked skill and include explicit damage tradeoffs.
- Hit flashes, floating damage, bounded particles, camera shake and synthesized Web Audio effects.
- Title, HUD, objectives, skill loadout, level selection, pause, victory, death, restart and sound toggle.
- Touch pointer capture, multitouch dash, keyboard input, hidden-tab auto pause, responsive portrait and landscape layouts.

## Architecture

| Module | Responsibility |
| --- | --- |
| `dist/js/data.js` | Balance constants, enemy definitions, rarity weights, upgrade registry |
| `dist/js/world.js` | Seeded randomness, terrain generation, spatial hash, collision |
| `dist/js/engine.js` | DOM-independent simulation, AI, combat, progression and run state |
| `dist/js/renderer.js` | Canvas rendering, terrain cache, culling, camera, minimap |
| `dist/js/input.js` | Keyboard and touch input, focus/cancellation handling |
| `dist/js/audio.js` | Gesture-unlocked, rate-limited Web Audio voices |
| `dist/js/gems.js` | Active/support registry, tag validation, presets, per-link stat compilation |
| `dist/js/combat.js` | Skill casting, projectiles, chain/fork/echo, ignite, leech and culling |
| `dist/js/monsters.js` | Additional enemy registry, three boss variants, attack patterns |
| `dist/js/extra-render.js` | New enemy silhouettes and linked spell effects |
| `dist/js/build-ui.js` | Paused skill workshop, sockets, live stats, enemy guide |
| `dist/js/main.js` | UI events, 60 Hz fixed-step loop and HUD updates |
| `dist/style.css` | Responsive UI and overlays |

Add active/support gems through `ACTIVE_GEMS` and `SUPPORT_GEMS`, plus casting behavior when required. Add global passives through `SKILLS`. Add enemy statistics through `ENEMIES` / `EXTRA_ENEMIES` plus corresponding AI/render behavior. The simulation emits events rather than touching the DOM, allowing later changes to rendering, audio or platform wrappers independently. Native app packaging can reuse this Web project; a Unity port would need a separate renderer and platform integration.

## Performance

Static terrain is drawn once per seed. Simulation uses a fixed 1/60-second step with a six-step catch-up ceiling, spatial hashes for collision queries, viewport culling, capped device pixel ratio (1.75), and bounded enemy / projectile / particle collections. HUD updates at 10 Hz. No network requests occur during play.

## Verification

```sh
npm run check
npm test
```

22 automated tests cover gem tag compatibility, duplicate socket rejection, local support effects, all six active skills, chain/fork/echo behavior, ignite/leech/culling, all boss variants and preset stress simulations, plus seed reproducibility, terrain collision, automatic damage, melee attacks, ranged fire, upgrade selection and pause behavior, all three rarities, three-fireball multi-shot, boss spawn and victory, death/restart, dash and a 230-second bounded simulation. Desktop and mobile canvas renders were executed and inspected using a native Canvas implementation. Physical-device touch, browser-specific audio behavior and browser layout have not been verified on actual devices.

The existing repository's earlier grid prototype remains recoverable from Git history.

## Balance and limits

Each linked support is a single available gem (not a consumable). Unlink a support before placing it elsewhere. Pierce resolves before chain; fork children cannot fork again; echoes cannot schedule further echoes. Ignite refreshes the strongest burn instead of stacking without limit. Life leech uses an 8-HP capacity replenishing at 8 HP/second. Effects, delayed meteors, echoes and hostile pools have hard bounds. Gem refinement improves one named active skill regardless of which group equips it; character passives apply globally.
