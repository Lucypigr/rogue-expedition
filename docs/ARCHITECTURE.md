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
| `dist/js/engine.js` | DOM-independent simulation, combat orchestration, progression and run state |
| `dist/js/ai.js` | Enemy state transitions, attack timing, pursuit, spacing and blocked-path recovery |
| `dist/js/synergies.js` | Build-combination requirements and active combat modifiers |
| `dist/js/encounters.js` | Seeded points of interest and encounter reward effects |
| `dist/js/renderer.js` | Canvas drawing, camera, terrain cache, culling and minimap |
| `dist/js/input.js` | Keyboard and touch input abstraction |
| `dist/js/audio.js` | User-gesture unlocked Web Audio and rate limiting |
| `dist/js/main.js` | UI binding, fixed-step loop, HUD, announcements and state overlays |

## Architectural constraints

1. Core gameplay simulation must remain independent of the DOM.
2. Input sources must map to shared game actions rather than directly controlling gameplay code.
3. New skills and enemies should be data-driven whenever practical.
4. Rendering must consume simulation state rather than own gameplay rules.
5. Platform-specific behavior must stay outside the game simulation.
6. Mobile and desktop controls must share the same action interface.
7. Random generation must remain seedable for reproducible tests.

## Implemented gameplay foundations

### Enemy state machine

Enemy behavior is now delegated to `ai.js` and uses explicit runtime states:

- `spawn`
- `pursue`
- `reposition`
- `windup`
- `recover`
- `dead` reserved for later expansion

The AI preserves existing melee, shaman and boss attack timing while adding blocked-path detection. Enemies that repeatedly fail to make progress enter a short lateral reposition state instead of continuously pushing into the same obstacle.

Future enemy types should extend behavior through composable movement and attack policies rather than growing the main engine loop again.

### Skill synergy pipeline

`synergies.js` evaluates owned-skill requirements and exposes aggregated combat modifiers. Three initial working combinations exist:

- `烈焰齊射`: Multi-shot + Blast increases splash damage.
- `霜穿長槍`: Frost + Pierce increases direct damage against already slowed enemies.
- `餘燼壁壘`: Orbit + Ward increases orbiting-fire damage.

The engine records awakened synergy IDs so the same combination only announces once per run.

Future expansion should add effect tags and event hooks such as `onCast`, `onHit`, `onKill`, `onDash`, `onPickup` and `onBossSpawn` before the synergy catalog grows large.

### World encounters

`encounters.js` generates seeded points of interest separately from terrain decoration and collision obstacles. The first three encounter types are:

- `餘燼祭壇`: raises maximum HP and heals.
- `失落靈匣`: grants immediate XP.
- `灰誓祭壇`: trades a small amount of HP for permanent run damage.

Encounter markers are stationary and do not use the XP magnet behavior. Reaching a marker resolves it once and emits an event for UI feedback.

This is the base for later shrines, ruins, elite challenges, relic events and chapter-specific landmarks.

## Next structural work

1. Split boss behavior into its own pattern/phase controller.
2. Add reusable enemy movement and attack policy objects before introducing many new archetypes.
3. Give encounters dedicated rendering instead of sharing the current crystal visual language.
4. Add a region/biome layer above seeded world generation.
5. Expand the synergy system with tags and event hooks rather than hard-coded pair logic.

## Performance

Keep the existing bounded-collection approach. Continue using spatial partitioning, viewport culling, capped DPR and a fixed simulation step. Avoid allocating temporary arrays in high-frequency combat paths where possible.

## Testing strategy

Keep deterministic simulation tests for:

- seeded world generation
- obstacle collision
- enemy attack timing and damage
- enemy state transitions and blocked recovery
- projectile hit behavior
- skill selection / rarity
- synergy activation and combat modifiers
- deterministic encounter generation and reward resolution
- boss spawn and phase behavior
- death / restart
- dash invulnerability
- collection caps and long-run stability

Add tests as new systems are introduced rather than relying only on visual inspection.
