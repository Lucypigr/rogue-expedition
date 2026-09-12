# Architecture
Native browser ES modules in dist/js, no production dependencies. Canvas renderer, fixed 60 Hz simulation, separate input/audio/UI modules.
socket-model.js is the source of truth for typed socket contents, installation validation, migration of legacy {active,supports} rows, and derived per-active skill rows. New rows use {sockets:[{kind,id}|null,...]}. Typed IDs distinguish active poison from support poison.
equippedSkills feeds combat, HUD and aura logic. Each active has its own clock keyed by equipment index, socket and gem ID. Affixes remain local to the owning equipment. Legacy rows remain readable for fixtures and old callers; production edits write schema v2.
progression.js retains gear ownership, equipment/crafting and rewards. socket-ui.js displays the same derived rule state; socket-editor.js supplies touch/click selection; build-ui.js binds actions.
ground-loot.js rolls ordinary gem drops, handles proximity pickups and draws labels/beams. engine.js calls drops once on death, pickups only while playing. Equipment uses the same ground queue. The queue is naturally bounded by finite wave quotas and clears on reset; no timed despawn.
Run npm run check and npm test with Node >=20. npm start serves dist on port 8080.
