# 燼境 · EMBERFALL

Playable desktop/mobile survival roguelike in HTML, CSS and native JavaScript ES modules, with no production dependencies.

## Play

Run `npm start` and open http://localhost:8080. The root page forwards to `dist/` for GitHub Pages.
Desktop: WASD/arrows move, Space dashes, Escape/P pauses, B opens inventory. Mobile: touch joystick, dash button, ◈ inventory.

- Start with exactly one Fireball gem and a two-socket staff. Each run resets gems, equipment and currency.
- Every level pauses combat for three distinct gem choices. Click/tap or press 1–3 to choose, then equip through inventory. Unowned gems are prioritized.
- Active rewards grant 1/2/3 refinement levels for common/rare/epic, each adding 12% base damage. Support effects depend on the gem, independent of rarity. Once all gems are owned, active refinements remain available.
- A run has exactly 3 rounds of 15 waves. Normal waves contain a finite enemy quota and advance only after all enemies die. Waves 5, 10 and 15 contain a boss. Boss XP is collected immediately; resulting level rewards resolve before the separate weapon/active/support boss choice.
- Independent equipment drop chance per kill: normal 3%, boss 80%, additional to boss reward choices. Drops automatically enter inventory and auto-equip an empty matching slot; gems require manual placement.
- Three weapon slots, a cloak and leg armor each support one active plus up to three linked supports. Cloaks grant armor, legs grant movement speed, and equipment grants damage to matching skill tags.
- White sockets accept all colors; other sockets require matching gem colors. Supports require compatible tags and a connection to the first socket. Each named gem may occupy only one group.
- Every fifth wave's boss victory unlocks crafting for all equipment: add socket (2 Jeweller), add link (2 Fusing), random colors (1 Chromatic), targeted color (2 Chromatic). Maximum four sockets. Invalidated gems safely return to inventory.
- Continue within the same round after waves 5/10. Wave 15 advances to the next round; only round 3 wave 15 allows expedition completion. Inventory holds 40 pieces; oldest unequipped spares recycle into two Jeweller when full. The latest eight drops appear in inventory.

## Architecture

All game modules live in `dist/js/`.

| Module | Responsibility |
| --- | --- |
| engine.js | DOM-independent simulation, AI and state transitions |
| progression.js | Level/boss rewards, drop rates, equipment slots and crafting |
| gems.js | 26 ordinary active and 22 ordinary support definitions, plus legendary exclusives, compatibility, local stats |
| combat.js / advanced-combat.js | Projectiles, chains, forks, echo, totems and fields |
| data.js / monsters.js | Balance, eleven enemy types and three boss variants |
| world.js | Seeded terrain, collision and spatial hash |
| renderer.js / extra-render.js | Cached terrain, spell effects and enemies |
| build-ui.js / main.js | Inventory, linked sockets, rewards and HUD |
| input.js / audio.js | Keyboard, multitouch and synthesized audio |

For compatibility, `bag.weapons` stores every equipment type; `weaponFor` resolves any slot. Item `slot` distinguishes weapon/cloak/legs. Equipment stats are derived rather than cumulatively applied on swaps.

Fixed 60 Hz simulation, capped catch-up, cached terrain, viewport culling, capped pixel density, bounded combat/effect queues and 10 Hz HUD updates. No network requests during play. Best survival time persists locally.

## Verification

```sh
npm run check
npm test
```

Automated tests cover terrain, collision, AI, all active skills/bosses, combat effects, pause/restart, bounded simulations, unique gem rewards, queued boss/level rewards, exact drop boundaries, armor slots and independent casting, crafting costs/colors/links, inventory recycling and all 45 waves, nine bosses, forge checkpoints and final victory.

Physical-device touch and browser-specific audio still require device verification. Mechanics and visuals are original ARPG-inspired implementations; no Path of Exile assets are copied.

## Encounter and socket clarity update

Normal waves now range from 22 to 56 enemies, spawning in packs of 6/8/10 according to round. Boss waves add 9/12/15 finite reinforcements; boss defeat disperses remaining guards. Boss HP is increased 30% and damage raised. Wave budget, composition and pacing live in `encounters.js`. Entity caps remain unchanged. The HUD includes remaining scheduled/live enemies.

Socket maps always display all four positions. Thick gold links mean connected to the active socket, broken links mean inactive, and dashed square sockets mean not yet opened. Text labels distinguish empty connected sockets from working support gems; the count describes linked sockets rather than incorrectly counting edges. Crafting previews use the same socket-state model as inventory.

Figma inspection was blocked by the Starter MCP rate limit. Canva infographic generation was rejected because the connected endpoint accepts only document/email types. This update's UI was therefore implemented directly in HTML/CSS, with no claim of exported Figma/Canva artwork.

## Inventory and legendary shop

Equipment, Backpack and Shop are separate tabs. Equipment retains socket crafting; Backpack lists gear and gem collections. Boss camps open the shop. Each kill grants 5 gold, bosses 150. Stock refreshes once per checkpoint. Equipped items cannot be sold. Buying and drawing reject full inventories before charging.

Threshold tickets cost 180 gold. Each ticket rolls legendary 3%, epic weapon 12%, rare weapon 30%, common weapon 55%. Within the legendary branch only, weapon and unowned legendary support each have 50% weight, uniformly within their category. After all legendary supports are collected, the 3% legendary branch gives weapons; its total probability does not increase. No real-money transactions. Gold, tickets and shop state reset each run.

Legendary weapons: Phoenix staff (180 base area damage and 12% maximum-health healing), Astral bow (five piercing arrows), Judgment hammer (260 base area damage and 70% slow). Each has an immutable intrinsic active, four linked white sockets and +50% matching hit damage; auxiliary sockets accept compatible supports. The fixed first socket cannot be recolored. Duplicate intrinsic weapons cannot be equipped simultaneously. Phoenix visuals use a system emoji with flame effects; rendering varies by platform.

Legendary supports: Infinity adds 10 projectiles without penalty, Dominion triples hit damage, Eternity adds eight chains and 50% cast rate. These rewards are exclusive to the shop lottery; normal level/boss pools exclude them. Projectile and effect caps still apply to extreme builds.

## Wildlife and healing pools

Eleven normal enemy types now include a telegraphed long-range sniper, a proximity bomber and a healer that restores living nearby allies. Composition expands with wave progress. Five seeded healing pools are placed clear of obstacles, including one near the starting clearing. Contact restores 25% maximum HP and starts a 45-second cooldown; full-health players do not consume pools. Cooldowns pause with simulation and reset with a new run. Pools show their ready/cooldown state on the map.

## Trails, auras and weapon affixes

- Gem names use their red/green/blue/white socket color throughout rewards, equipment and inventory.
- New active gems: Ember Trail, Frost Trail, Toxic Trail, Swift Aura, Wrath Aura, Renewal Aura, Sunshot and Thornburst. New supports: Heavy, Wide, Lingering and Siphon. Trails are emitted only while moving and use bounded, timed area effects.
- Equip an aura into an active socket, then toggle it with the arena or equipment button. Auras start off: Swift grants +35% movement and 25% less damage; Wrath grants 45% more damage and -4 armor; Renewal grants 4 HP/s and -18% movement. Effects end when disabled or unequipped. Auras do not accept supports or damage refinements.
- Ordinary weapons have no affixes; rare weapons roll one prefix and suffix, epic weapons two each. Legendary weapons retain fixed exclusive powers. Eight affix families cover damage, spell/projectile damage, flat damage, cast speed, critical chance, armor and movement speed. Each family occurs at most once per item. Tier progresses from T3 to T1 with encounter stage.
- Damage/cast/critical affixes apply only to the equipped weapon's skill group; armor/movement affixes affect the character. Item cards expose each affix, tier and value before equipping or buying.
- `affixes.js` owns rolling and display; `auras.js` derives temporary bonuses; `aura-ui.js` supplies accessible toggle controls.
