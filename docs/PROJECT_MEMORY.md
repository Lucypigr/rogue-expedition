# EMBERFALL · Project Memory

## Project identity

- Name: `燼境 · EMBERFALL`
- Repository: `Lucypigr/rogue-expedition`
- Primary branch: `main`
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

## Current repository status observed on 2026-09-10

The `main` branch contains a modular Web build under `dist/`, automated Node tests, a project check script and documentation in `README.md`. The latest observed commit before this documentation branch was `8a5bf3691f314f9da879dcec6067a1ad062bf2c7` (`Build Emberfall: complete desktop and mobile survival roguelike`).

## Next engineering priorities

1. Preserve current working baseline.
2. Convert enemy behavior into clearer explicit states and pluggable movement/attack patterns before adding many more enemy types.
3. Add skill synergy infrastructure using tags, hooks and reusable effects rather than only flat-stat upgrades.
4. Add procedural exploration points of interest and optional elite encounters.
5. Expand the boss into more readable phases and counterplay.
6. Add a region/biome abstraction before building a second chapter.
7. Re-run automated tests and browser/mobile checks after each gameplay change.
