# EMBERFALL · Game Design

## Product direction

EMBERFALL is a short-session action roguelike survival adventure for desktop and mobile Web. A standard run targets roughly 4–6 minutes. The player explores a procedurally arranged wilderness, automatically casts at nearby threats, collects Spirit Crystals, chooses randomized upgrades, survives escalating pressure, and defeats the Ashen Guardian.

## Current core loop

1. Enter the Ashen Wilds.
2. Move through a seeded world with terrain collision and obstacles.
3. Auto-target nearby enemies and cast fireballs.
4. Collect Spirit Crystals for XP.
5. On level-up, choose one of three randomized upgrades.
6. Build combinations across common / rare / epic skills.
7. Survive until the Ashen Guardian appears at 03:00.
8. Defeat the boss to complete the expedition, or die and restart.

## Controls

- Desktop: WASD / arrow keys to move, Space to dash, Escape / P to pause.
- Mobile: virtual joystick for movement and a dedicated dash control.
- Combat targeting and basic casting are automatic.

## Current combat identity

- Movement is the player's primary manual combat decision.
- Basic attacks are automatic so attention stays on positioning, avoidance and build choices.
- Dash grants brief invulnerability and should remain an important defensive skill.
- Enemy attacks must include readable preparation, an actual damage window, cooldown and recovery.
- Boss attacks should be telegraphed and become more dangerous below half health.

## Current build system

Existing build directions include damage, cast speed, multi-shot, explosion radius, movement speed, maximum HP, pickup radius, regeneration, piercing, slow, orbiting fire and armor.

Rarity is part of the run identity:

- Common: reliable numerical improvements.
- Rare: mechanics-changing upgrades and stronger scaling.
- Epic: build-defining effects and major synergies.

## Reference-derived design principles

The four supplied reference games are used only for general design analysis. No third-party code, art, music, maps, characters or proprietary assets are to be copied.

### 9 Kings

Use the principle of highly combinable modifiers. The important lesson is not kingdom building itself, but allowing simple effects to stack into visibly powerful, surprising builds. EMBERFALL should reward discovering interactions rather than only increasing raw numbers.

### He is Coming

Use the principle of exploration under a visible approaching threat. The boss timer should become more meaningful by allowing the player to discover world events, relic opportunities or risk/reward encounters before the boss arrives. Boss information can eventually influence which upgrades the player values.

### Megabonk

Use the principle of fast action-survival progression: random maps, frequent XP rewards, escalating hordes, randomized upgrade offers, rarity and strong build escalation. This aligns most directly with EMBERFALL's existing real-time combat.

### Death Howl

Use the principle of deliberate enemy-pattern learning and world structure. EMBERFALL remains real-time rather than turn-based, but bosses and elites should have readable attack identities, and future chapters can use distinct regions/checkpoints without copying Death Howl's card or narrative systems.

## Near-term design priorities

1. Upgrade enemy AI from simple pursuit into explicit combat states: detect, pursue, wind-up, attack, cooldown, hit reaction, death and blocked-path recovery.
2. Add build synergies so upgrades interact instead of existing only as independent bonuses.
3. Add meaningful exploration targets to the random map: shrines, ruins, relic events or elite encounters.
4. Improve boss counterplay with readable patterns and phase transitions.
5. Preserve 4–6 minute run length while increasing decisions per run.
6. Keep desktop and mobile input feature-equivalent from the start.

## Non-goals

- Do not turn EMBERFALL into a clone of any reference game.
- Do not change the game to turn-based combat.
- Do not remove the current automatic casting identity.
- Do not bind core gameplay rules to browser DOM APIs.
- Do not sacrifice mobile support for desktop-only effects.
