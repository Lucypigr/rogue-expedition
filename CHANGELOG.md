# Changelog

All notable EMBERFALL project changes should be recorded here.

## 2026-09-10 — Gameplay foundations

### Added

- `dist/js/ai.js` with explicit enemy states for spawn, pursuit, repositioning, attack wind-up and recovery.
- Blocked-path recovery that makes stuck enemies sidestep instead of endlessly pushing into terrain.
- `dist/js/synergies.js` with three real build synergies: 烈焰齊射, 霜穿長槍 and 餘燼壁壘.
- `dist/js/encounters.js` with three seeded exploration encounters: 餘燼祭壇, 失落靈匣 and 灰誓祭壇.
- UI announcements when a synergy awakens or an exploration encounter is resolved.
- Four additional automated tests covering AI state transitions, synergy modifiers, one-time synergy activation and deterministic encounter rewards.

### Changed

- `engine.js` now delegates enemy behavior to the AI module instead of owning the full enemy behavior loop.
- Projectile splash, slowed-target damage and orbiting-fire damage can now be modified by active synergies.
- Exploration encounter markers do not magnetize like XP crystals and resolve only when the player reaches them.

### Verification

- Original baseline before modification: 11/11 automated tests passed under Node.js 22.16.0.
- Updated build: 15/15 automated tests passed.
- All modified JavaScript files passed `node --check`.
- The long 230-second bounded simulation test still passes after the refactor.
- Physical-device mobile play and browser-specific layout/audio remain to be re-verified on an actual device.

## 2026-09-10 — Reference analysis documentation

### Added

- `docs/GAME_DESIGN.md` with the current core loop and design priorities.
- `docs/ARCHITECTURE.md` with module boundaries and planned system evolution.
- `docs/PROJECT_MEMORY.md` with persistent project decisions and constraints.
- `docs/PORTABILITY.md` with Web, mobile-wrapper, desktop-wrapper and Unity port guidance.
- `docs/REFERENCE_ANALYSIS.md` summarizing safe design lessons from the supplied reference builds.

### Reference inputs

- 9 Kings
- He is Coming
- Megabonk
- Death Howl

### Notes

- No gameplay code was changed in this documentation pass.
- The first three supplied reference archives were confirmed to be Windows Unity IL2CPP builds rather than Unity source projects.
- The `Death Howl.z01` + `Death Howl.zip` split archive was successfully joined for temporary inspection and passed a full compressed-data integrity test.
- Death Howl was confirmed as a Unity `2022.3.62f2` Mono build with 60 scenes, including 56 world-part scenes, and modular runtime systems for exploration, combat, cards, map/world streaming, enemy AI, input, audio and saves.
- Only structural metadata and general design patterns were analyzed; no executable was run and no third-party source implementation or assets were copied into EMBERFALL.
