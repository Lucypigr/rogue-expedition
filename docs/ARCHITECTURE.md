# EMBERFALL · Architecture

## Current stack

- HTML / CSS / native JavaScript ES modules
- Canvas rendering
- No production runtime dependencies
- Node.js only for checks and tests
- Web Audio for synthesized sound
- Static hosting compatible with GitHub Pages

## Current module boundaries

| Module | Responsibility |
| --- | --- |
| `dist/js/data.js` | Balance constants, enemy definitions, rarity data and skill registry |
| `dist/js/world.js` | Seeded randomness, terrain generation, obstacle collision and spatial hash |
| `dist/js/engine.js` | DOM-independent simulation, combat, enemy behavior, progression and run state |
| `dist/js/renderer.js` | Canvas drawing, camera, terrain cache, culling and minimap |
| `dist/js/input.js` | Keyboard and touch input abstraction |
| `dist/js/audio.js` | User-gesture unlocked Web Audio and rate limiting |
| `dist/js/main.js` | UI binding, fixed-step loop, HUD and state overlays |

## Architectural constraints

1. Core gameplay simulation must remain independent of the DOM.
2. Input sources must map to shared game actions rather than directly controlling gameplay code.
3. New skills and enemies should be data-driven whenever practical.
4. Rendering must consume simulation state rather than own gameplay rules.
5. Platform-specific behavior must stay outside the game simulation.
6. Mobile and desktop controls must share the same action interface.
7. Random generation must remain seedable for reproducible tests.

## Planned system improvements

### Enemy state machine

The current enemy logic is compact and functional, but future expansion should make state explicit. Recommended states:

- idle / spawn
- acquire target
- pursue / reposition
- attack wind-up
- attack active
- recovery / cooldown
- hit reaction
- blocked-path recovery
- death

Boss behavior should use a separate pattern/state controller so new phases can be added without expanding one large update loop indefinitely.

### Skill and modifier pipeline

Move toward declarative effects and tags so synergies can be expressed without hard-coding every pair. Example concepts:

- tags: `fire`, `projectile`, `explosion`, `defense`, `movement`, `orbit`
- additive and multiplicative stat modifiers
- event hooks: `onCast`, `onHit`, `onKill`, `onDash`, `onPickup`, `onBossSpawn`
- prerequisite / exclusion rules
- rarity-specific effect strength

### World encounters

Future points of interest should be generated independently from static decoration and collision obstacles. An encounter service should own spawn rules for shrines, ruins, elites, chests or relic events.

### Performance

Keep the existing bounded-collection approach. Continue using spatial partitioning, viewport culling, capped DPR and a fixed simulation step. Avoid allocating temporary arrays in high-frequency combat paths where possible.

## Testing strategy

Keep deterministic simulation tests for:

- seeded world generation
- obstacle collision
- enemy attack timing and damage
- projectile hit behavior
- skill selection / rarity
- boss spawn and phase behavior
- death / restart
- dash invulnerability
- collection caps and long-run stability

Add tests as new systems are introduced rather than relying only on visual inspection.
