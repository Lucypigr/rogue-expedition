# EMBERFALL · Project Memory

## Project identity

- Name: `燼境 · EMBERFALL`
- Repository: `Lucypigr/rogue-expedition`
- Primary branch: `main`
- Active development branch: `feature/gameplay-foundations-20260910`
- Product: short-session Web action roguelike / survival adventure
- Primary targets: desktop browsers and mobile browsers
- Current implementation: HTML, CSS and native JavaScript ES modules

## Confirmed product decisions

- Continue the existing EMBERFALL project; do not start a replacement game.
- Preserve automatic targeting / automatic basic casting.
- Player manually controls movement and dash.
- Runs target about 4–6 minutes.
- The Ashen Guardian currently appears after 03:00.
- Level-ups offer three randomized skills.
- Skill rarity uses common / rare / epic tiers.
- The world is procedurally arranged and includes terrain collision.
- Desktop and mobile must remain first-class targets.
- GitHub is the authoritative project version.

## User quality requirements

- Work must result in a playable, testable project rather than isolated code snippets.
- Do not claim completion without verification.
- Do not break existing functionality to implement a new feature.
- Enemy attacks must genuinely cause damage and include readable combat timing.
- Mobile support cannot be inferred from desktop success.
- Keep the architecture suitable for continued expansion and later packaging / porting.

## Reference games supplied on 2026-09-10

- `9 Kings`
- `He is Coming`
- `Megabonk`
- `Death Howl`

The supplied archives are Windows Unity builds, not Unity source projects. They are reference material only. General mechanics, pacing and architectural clues may inform EMBERFALL, but third-party source code, characters, art, music, maps and proprietary assets must not be copied.

## Reference priorities for EMBERFALL

- `Megabonk`: action-survival pacing, random upgrades, rarity, escalating builds, map pressure.
- `He is Coming`: exploration with an approaching boss threat, preparation choices, points of interest.
- `9 Kings`: combinatorial stacking and satisfying build synergies.
- `Death Howl`: readable enemy patterns, deliberate counterplay, modular exploration/combat separation and future region structure.

## Death Howl verified build notes

- The supplied `Death Howl.z01` + `Death Howl.zip` pair is complete; the merged 755 MB inspection archive passes a full compressed-data integrity test.
- The build uses Unity `2022.3.62f2` with the Mono scripting backend.
- The build exposes 60 scenes, including a persistent manager scene and 56 world-part scenes.
- Safe assembly metadata shows separate systems for Exploration, CombatSystem, Cards, Map, WorldInfrastructure, Characters/AI, Audio and save/profile handling.
- Relevant structural lessons for EMBERFALL: separate exploration from combat responsibilities; use modular enemy movement/attack behaviors; use explicit boss flow/phases; use reusable skill/effect primitives; design future biomes as region modules with landmarks and optional encounters.
- Do not copy Death Howl's turn-based grid combat, card/deck content, proprietary classes, assets, layouts, narrative or source implementation.

## Implemented gameplay foundations on 2026-09-10

### Enemy AI

- Enemy behavior has been moved out of the main simulation loop into `dist/js/ai.js`.
- Runtime states now include spawn, pursue, reposition, wind-up and recovery.
- Existing melee, shaman and boss attacks still use real telegraphs and damage windows.
- Blocked enemies can enter a short sidestep recovery instead of continuously pushing into terrain.

### Skill synergies

- `dist/js/synergies.js` now evaluates combinations of owned upgrades.
- `烈焰齊射`: Multi-shot + Blast raises splash damage.
- `霜穿長槍`: Frost + Pierce raises direct damage against already slowed enemies.
- `餘燼壁壘`: Orbit + Ward raises orbiting-fire damage.
- Synergy awakening is recorded once per run and surfaced to the UI through events.

### Exploration encounters

- `dist/js/encounters.js` generates three seeded points of interest per run.
- Current events: 餘燼祭壇, 失落靈匣 and 灰誓祭壇.
- Encounter markers stay fixed instead of being pulled by the XP magnet.
- Reaching an encounter resolves a real run effect and emits UI feedback.

## Verification status

- Before the gameplay-foundations refactor, the original automated suite passed 11/11 tests under Node.js 22.16.0.
- After the refactor, the expanded suite passes 15/15 tests.
- The 230-second bounded full-run simulation still passes.
- All modified JavaScript files pass `node --check`.
- Physical iOS/Android touch behavior, browser-specific audio and responsive layout still require real-device re-verification after this branch is deployed.

## Next engineering priorities

1. Give exploration encounters dedicated art/markers and clearer route guidance.
2. Split the Ashen Guardian into a dedicated boss phase/pattern controller.
3. Add reusable movement/attack policy modules before creating more enemy archetypes.
4. Expand synergy logic with tags and event hooks instead of accumulating pair-specific conditions.
5. Add optional elite encounters and stronger risk/reward world choices.
6. Add a region/biome abstraction before building a second chapter.
7. Re-run automated tests and desktop/mobile checks after each gameplay change.
