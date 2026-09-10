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

### Build observation

The archive directory indicates a Windows Unity Mono build with `MonoBleedingEdge`, `Assembly-CSharp.dll`, FMOD and Rewired, plus many Unity level files. However, the uploaded `Death Howl.zip` reports that it is the last disk of a multi-part ZIP archive. Earlier volumes are missing, so internal extraction is not reliable and no deeper package inspection is recorded here.

### Public gameplay characteristics

Death Howl is an open-world tactical deckbuilder built around deliberate enemy patterns, grid positioning, build archetypes and a punishing-but-readable death loop. Public developer commentary emphasizes pattern recognition and learning enemy behavior.

### What EMBERFALL should learn

- Difficult attacks should remain readable and learnable.
- Elite and boss enemies need recognizable identities rather than only more HP and damage.
- Future chapters can have distinct regions and encounter rules.
- Death can teach the player something about the next attempt.

### What EMBERFALL should not copy

- Turn-based grid combat
- Card/deck structure
- Narrative, characters, world, enemy designs or proprietary systems

## Combined design target for EMBERFALL

The desired blend is:

- **Core action:** EMBERFALL's existing movement + dash + automatic casting.
- **Run pacing:** fast action-survival escalation similar in principle to Megabonk.
- **Adventure layer:** exploration choices under a looming boss timer, inspired by the design principle seen in He is Coming.
- **Build depth:** strongly interacting upgrades inspired by the combinatorial philosophy of 9 Kings.
- **Enemy mastery:** telegraphed, learnable enemy and boss patterns inspired by the design philosophy discussed around Death Howl.

This combination should remain an original real-time Web roguelike rather than reproducing any one reference game.

## Recommended implementation order

1. Enemy finite-state behavior and blocked-path recovery.
2. Skill tags, hooks and synergy rules.
3. Three to five procedural points-of-interest.
4. Elite encounters tied to optional rewards.
5. Boss phase overhaul with clear telegraphs.
6. Additional biome/chapter after the first loop is polished.
