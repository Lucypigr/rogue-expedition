# Changelog
## Free sockets and ground loot — 2026-09-12
- Any opened socket accepts any ordinary active, support or aura gem of any color.
- Multiple active skills cast independently with shared compatible linked supports.
- Typed gem IDs prevent active/support poison collisions.
- Tap/click a socket then choose or remove its gem; per-skill stats and inactive supports are visible.
- Ground drops show beams and names; proximity pickup required. Ordinary gem 5%, boss 35%; equipment 3% / 80%.
- Level choices refine owned gems or grant currency; boss choices grant gear or currency. Legendary shop rewards retained.
- Updated changed-rule tests and added six acceptance tests. 55 tests passed in V8 adapter; Node/browser/device verification pending.

## Free-socket effects follow-up — 2026-09-13
- Fixed aura rings and orbit blades disappearing after installing gems into free sockets. Rendering now uses the same per-active skill rows as combat.
- Actual Node tests: 56 passed, 0 failed; syntax/local entrypoint asset checks passed.
- Browser local-server access blocked; deployment and physical-device checks remain pending.
