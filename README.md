# 燼境 · EMBERFALL

A complete single-run survival roguelike built with HTML, CSS and native JavaScript ES modules. No production dependencies, external assets, build step, tracking, or API keys.

## Play

Use the deployed Site, or serve this repository over HTTP. The root `index.html` forwards to `dist/`, making existing GitHub Pages deployments compatible.

```sh
npm start
# Open http://localhost:8080
```

Desktop: WASD / arrows to move, Space to dash, Escape or P to pause. Mobile: left joystick and right dash button. Fireballs automatically target nearby enemies. Collect crystals to level up, choose one of three randomized upgrades, and defeat the boss that appears after 3 minutes. A complete run normally takes 4–6 minutes. Refreshing resets the current run; the longest survival time is saved locally when storage is available.

## Implemented

- Seeded 2400×2400 forest maps, rocks, trees, paths, a starting ruin, terrain collision, camera and desktop minimap.
- Four enemy archetypes: melee crawler, fast runner, ranged shaman, heavy brute.
- Boss with telegraphed radial barrages and ground explosions; faster attacks below half health.
- Experience, escalating level requirements, 12 upgrade types, common / rare / epic rarity.
- Fireballs, explosions, multiple projectiles (+2 each upgrade), piercing, slow, orbiting fire, armor, regeneration and pickup radius.
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
| `dist/js/main.js` | UI events, 60 Hz fixed-step loop and HUD updates |
| `dist/style.css` | Responsive UI and overlays |

Add skills through `SKILLS`; add enemy statistics through `ENEMIES` plus corresponding AI/render behavior. The simulation emits events rather than touching the DOM, allowing later changes to rendering, audio or platform wrappers independently. Native app packaging can reuse this Web project; a Unity port would need a separate renderer and platform integration.

## Performance

Static terrain is drawn once per seed. Simulation uses a fixed 1/60-second step with a six-step catch-up ceiling, spatial hashes for collision queries, viewport culling, capped device pixel ratio (1.75), and bounded enemy / projectile / particle collections. HUD updates at 10 Hz. No network requests occur during play.

## Verification

```sh
npm run check
npm test
```

Automated tests cover seed reproducibility, terrain collision, automatic damage, melee attacks, ranged fire, upgrade selection and pause behavior, all three rarities, three-fireball multi-shot, boss spawn and victory, death/restart, dash and a 230-second bounded simulation. Desktop and mobile canvas renders were executed and inspected using a native Canvas implementation. Physical-device touch, browser-specific audio behavior and browser layout have not been verified on actual devices.

The existing repository's earlier grid prototype remains recoverable from Git history.
