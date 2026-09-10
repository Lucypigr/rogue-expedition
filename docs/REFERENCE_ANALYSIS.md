# EMBERFALL · Reference Analysis

Date: 2026-09-10

## Scope and safety

The supplied archives are analyzed as reference builds only. They are commercial Unity game builds, not authoring projects. This document records general design principles, publicly observable mechanics and non-proprietary technical clues. EMBERFALL must use original code, art, audio, world design, characters and balance.

A real Unity source project would normally include folders such as `Assets/`, `Packages/` and `ProjectSettings/`. None of the supplied archives contain that source-project structure.

## 1. 9 Kings

### Build observation

The supplied package is a Windows Unity IL2CPP build. It contains `9Kings.exe`, `GameAssembly.dll`, `UnityPlayer.dll`, `global-metadata.dat` and Unity data bundles. Its scripting manifest includes Unity Entities/DOTS-related assemblies, Burst, Collections, Mathematics, Addressables, the Input System, Cinemachine and URP. The presence of these packages is evidence of available runtime systems, not proof that every gameplay feature uses them.

### Public gameplay characteristics

9 Kings is a fast-paced roguelike kingdom builder / deckbuilder in which units, buildings, spells and positioning combine into increasingly extreme builds. Its central appeal is stacking modifiers and discovering interactions that can dramatically change the strength of a run.

### What EMBERFALL should learn

- Small upgrade effects become more interesting when they interact.
- A run should develop a recognizable build identity.
- Players should occasionally discover combinations that feel dramatically stronger than the sum of their parts.
- Synergy should be explainable through tags and effects rather than hidden arbitrary bonuses.

### What EMBERFALL should not copy

- Kingdom-building board structure
- Kings, decks, units, art or card content
- Source code or data extracted from the build

## 2. He is Coming

### Build observation

The supplied package is a Windows Unity IL2CPP build. Its scripting manifest includes the Unity Input System, Unity AI Navigation, Cinemachine and DOTween, alongside platform/services libraries.

### Public gameplay characteristics

He is Coming combines roguelite exploration and auto-battler combat. The player searches for equipment and artifacts while an approaching boss creates a preparation deadline. A new major threat arrives on a recurring schedule, encouraging the player to make route and build choices with future encounters in mind.

### What EMBERFALL should learn

- The existing 03:00 Guardian timer can be more than a countdown: it can shape exploration decisions.
- Random-map points of interest can create route choice without requiring manual attack controls.
- Showing hints about an approaching elite or boss can make skill choices more tactical.
- Preparation pressure can make a short run feel like an adventure rather than only a survival arena.

### What EMBERFALL should not copy

- Item catalog, bosses, world lore, maps or art
- Exact day/night structure
- Source code or runtime assets

## 3. Megabonk

### Build observation

The supplied package is a Windows Unity IL2CPP build. Its scripting manifest includes Unity AI Navigation, Addressables, Rewired, ProBuilder-related runtime assemblies, post-processing and a toon rendering package.

### Public gameplay characteristics

Megabonk is a 3D action roguelike survival game with randomly generated maps, escalating enemy hordes, bosses, XP-based leveling, randomized upgrades and rarity-driven build growth.

### What EMBERFALL should learn

This is the closest reference to EMBERFALL's real-time core.

- Keep the moment-to-moment loop fast and readable.
- XP drops should create a satisfying movement loop through danger.
- Level-ups should happen often enough that the build changes visibly during one short run.
- Rarity should change excitement and build direction, not merely card color.
- Random maps should affect movement and enemy pressure, not just appearance.
- Input abstraction matters because the game targets both desktop and mobile.

### What EMBERFALL should not copy

- Characters, weapons, items, levels, art direction or exact upgrade values
- Unity-specific implementation details

## 4. Death Howl

### Build verification

The two supplied volumes, `Death Howl.z01` and `Death Howl.zip`, form a complete split archive. They were joined into a temporary inspection copy and the full archive integrity test completed without compressed-data errors. No executable or game DLL was run.

The build is a Windows Unity Mono release using Unity `2022.3.62f2`. The package contains `MonoBleedingEdge`, `Assembly-CSharp.dll`, Rewired, FMOD, Unity AI Navigation, Burst, Collections, Mathematics, 2D Animation, Tilemap and related runtime assemblies.

The Unity build settings expose 60 scenes. Four are system scenes (`CompanyLogos`, `TitleMenu`, `Credits`, and a persistent `Main (Managers)` scene), while 56 are world-part scenes covering outdoor regions, caves, special arenas and post-game spaces. This strongly indicates a persistent-manager plus additive/streamed-region architecture rather than one monolithic world scene.

Safe metadata inspection of `Assembly-CSharp.dll` exposes a highly modular project layout. Approximately 759 source-path identifiers are present, grouped heavily around UI, Cards, Characters, CombatSystem, Exploration, Map, Audio, Weather, GameData and WorldInfrastructure. Important architectural classes include separate `PlayerExplorationController` and `PlayerCombatController`, `CombatEntityManager`, `CombatDeckHandler`, `EnemyAI`, movement modules, `GridManager`, `Pathfinding`, `FogOfWarHandler`, `RegionDataManager`, `RegionStreaming`/world-loading components, and save/profile systems.

Enemy movement is not represented as one universal chase routine: the build contains separate movement modules for jumping, line-of-sight seeking and teleportation, alongside enemy-specific combat-turn handlers. Bosses also have dedicated flow/state classes and multi-part behavior. These identifiers support the general design conclusion that enemies and bosses are implemented as distinct behavior patterns rather than only stat variants.

The card system is similarly separated into card-data and card-effect layers, with many reusable effect types. EMBERFALL should not adopt Death Howl's card combat, but the reusable-effect architecture is relevant to our planned skill-tag and event-hook system.

### Public gameplay characteristics

Death Howl is an open-world tactical deckbuilder built around deliberate enemy patterns, grid positioning, build archetypes and a punishing-but-readable death loop. Its central combat value for EMBERFALL is learnable pattern design, not the turn-based format itself.

### What EMBERFALL should learn

- Separate exploration control from combat/simulation responsibilities instead of growing one giant controller.
- Treat future biomes as region modules with their own encounters, visuals and rules rather than a single endlessly decorated map.
- Use a persistent world/run manager and load or generate region content around it.
- Give enemy families different movement logic and attack identities instead of only changing speed, HP and damage.
- Give bosses explicit phase/flow controllers and multi-step attacks with readable telegraphs.
- Build skills from reusable effect primitives, tags and hooks so combinations can scale without hard-coding every skill pair.
- Keep map discovery, landmarks and optional encounters as first-class adventure systems.
- Preserve readable danger indicators before strong attacks.

### What EMBERFALL should not copy

- Turn-based grid combat
- Card/deck structure or proprietary card effects
- Scene layouts, region names, narrative, characters, enemy designs, art, audio or other runtime assets
- Decompiled or extracted source implementation

## Combined design target for EMBERFALL

The desired blend is:

- **Core action:** EMBERFALL's existing movement + dash + automatic casting.
- **Run pacing:** fast action-survival escalation similar in principle to Megabonk.
- **Adventure layer:** exploration choices under a looming boss timer, inspired by the design principle seen in He is Coming.
- **Build depth:** strongly interacting upgrades inspired by the combinatorial philosophy of 9 Kings.
- **Enemy mastery:** telegraphed, learnable enemy and boss patterns inspired by Death Howl's design philosophy and modular behavior structure.
- **World structure:** future chapters/biomes should be modular regions with landmarks, optional encounters and clear transitions rather than one giant undifferentiated arena.

This combination must remain an original real-time Web roguelike rather than reproducing any one reference game.

## Recommended implementation order

1. Enemy finite-state behavior and pluggable movement/attack patterns.
2. Skill tags, hooks and reusable effect primitives.
3. Three to five procedural points-of-interest in the current biome.
4. Elite encounters tied to optional rewards.
5. Boss phase overhaul with clear telegraphs and multi-step patterns.
6. Region/biome abstraction for a second chapter after the first loop is polished.
