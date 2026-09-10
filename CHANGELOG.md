# Changelog

All notable EMBERFALL project changes should be recorded here.

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
