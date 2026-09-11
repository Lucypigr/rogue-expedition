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
| gems.js | 18 active and 18 support definitions, compatibility, local stats |
| combat.js / advanced-combat.js | Projectiles, chains, forks, echo, totems and fields |
| data.js / monsters.js | Balance, eight enemy types and three boss variants |
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
