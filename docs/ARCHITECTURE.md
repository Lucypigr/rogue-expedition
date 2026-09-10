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
| `dist/js/ai.js` | Enemy state transitions, archetype movement, attack timing and blocked-path recovery |
| `dist/js/boss.js` | Ashen Guardian health phases, attack patterns, cadence and boss-specific pressure |
| `dist/js/synergies.js` | Build-combination requirements and active combat modifiers |
| `dist/js/encounters.js` | Seeded points of interest, presentation metadata and encounter reward effects |
| `dist/js/renderer.js` | Canvas drawing, camera, terrain cache, culling and minimap |
| `dist/js/input.js` | Keyboard and touch input abstraction |
| `dist/js/audio.js` | User-gesture unlocked Web Audio and rate limiting |
| `dist/js/main.js` | UI binding, fixed-step loop, HUD, exploration route markers, announcements and overlays |

## Architectural constraints

1. Core gameplay simulation must remain independent of the DOM.
2. Input sources must map to shared game actions rather than directly controlling gameplay code.
3. New skills and enemies should be data-driven whenever practical.
4. Rendering must consume simulation state rather than own gameplay rules.
5. Platform-specific behavior must stay outside the game simulation.
6. Mobile and desktop controls must share the same action interface.
7. Random generation must remain seedable for reproducible tests.

## Implemented gameplay foundations

### Enemy state machine and archetypes

Enemy behavior is delegated to `ai.js` and uses explicit runtime states:

- `spawn`
- `pursue`
- `flank`
- `kite`
- `reposition`
- `windup`
- `recover`
- `dead` reserved for later expansion

Current movement/attack identities:

- Crawler: direct pursuit and short melee wind-up.
- Runner: lateral flanking movement, extended-range charge wind-up, then a burst toward the stored aim direction.
- Shaman: approaches from long range, retreats when crowded and strafes while maintaining a preferred ranged band.
- Brute: slower approach and a longer, heavier melee wind-up.
- Boss: movement and attack cadence are delegated to the dedicated boss controller.

Blocked-path detection remains shared. Enemies that repeatedly fail to make progress enter a short lateral reposition state instead of continuously pushing into terrain.

### Boss controller

`boss.js` owns Ashen Guardian-specific behavior instead of expanding generic enemy logic.

The boss has three health stages:

1. `甦醒`: baseline movement and alternating radial/aimed attacks.
2. `焚心`: faster movement, shorter cadence and expanded projectile/ground-zone patterns.
3. `末焰`: highest pressure with the shortest wind-up/cooldown and denser patterns.

Phase changes reset the local attack-pattern sequence and emit a `bossPhase` event for UI feedback.

### Skill synergy pipeline

`synergies.js` evaluates owned-skill requirements and exposes aggregated combat modifiers. Three initial working combinations exist:

- `烈焰齊射`: Multi-shot + Blast increases splash damage.
- `霜穿長槍`: Frost + Pierce increases direct damage against already slowed enemies.
- `餘燼壁壘`: Orbit + Ward increases orbiting-fire damage.

The engine records awakened synergy IDs so the same combination only announces once per run.

Future expansion should add effect tags and event hooks such as `onCast`, `onHit`, `onKill`, `onDash`, `onPickup` and `onBossSpawn` before the synergy catalog grows large.

### World encounters and route guidance

`encounters.js` generates seeded points of interest separately from terrain decoration and collision obstacles. The first three encounter types are:

- `餘燼祭壇`: raises maximum HP and heals.
- `失落靈匣`: grants immediate XP.
- `灰誓祭壇`: trades a small amount of HP for permanent run damage.

Each encounter exposes its own glyph and accent metadata. `main.js` renders lightweight screen-space route markers above the Canvas without moving gameplay rules into the DOM layer. Markers follow world positions, clamp to screen edges while off-screen and suppress long labels on narrow layouts.

This is the base for later shrines, ruins, elite challenges, relic events and chapter-specific landmarks.

## Next structural work

1. Add reusable enemy attack/movement policy objects if the archetype catalog grows beyond the current set.
2. Add optional elite encounters that connect world exploration with build rewards.
3. Expand the synergy system with tags and event hooks rather than hard-coded pair logic.
4. Add a region/biome layer above seeded world generation.
5. Move exploration marker styling into a dedicated UI stylesheet/module if the marker catalog becomes larger.

## Performance

Keep the existing bounded-collection approach. Continue using spatial partitioning, viewport culling, capped DPR and a fixed simulation step. The screen-space exploration marker layer is capped by the small encounter count and does not participate in the simulation loop.

## Testing strategy

Keep deterministic simulation tests for:

- seeded world generation
- obstacle collision
- enemy attack timing and damage
- enemy state transitions and blocked recovery
- archetype-specific flank/kite/charge/heavy-windup behavior
- projectile hit behavior
- skill selection / rarity
- synergy activation and combat modifiers
- deterministic encounter generation, presentation and reward resolution
- boss spawn, phase transitions and attack cadence
- death / restart
- dash invulnerability
- collection caps and long-run stability

Add tests as new systems are introduced rather than relying only on visual inspection.
