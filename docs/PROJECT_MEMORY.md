# Project memory
User confirmed free sockets on 2026-09-12: remove dedicated active/support slots and color restrictions; compatible supports work only through links; allow several active gems per linked group and auras in spare sockets. Click/tap installation is required.
Also requested ground drops rather than automatic inventory delivery: ordinary gems 5%, bosses higher (implemented default 35%); equipment rates retained at 3% / 80%. Gem names retain their colors.
Do not change renderer style, enemy encounters or core controls as part of this update. Legendary intrinsic first socket remains immutable to retain the existing special weapon behavior.
Starting snapshot: dce63555cab59d4520a18c2f007f493997a0af39.
Validation: original 49 synchronous tests passed in available V8 runtime; updated 55 tests passed with a synchronous assertion adapter. Node CLI and actual browser/mobile runtime unavailable in this session; no claim of physical-device verification.
Current workspace reported exec-server handshake timeout. GitHub connector used for repository access.

## Verification follow-up — 2026-09-13
Local execution recovered. Ran actual Node `npm test`: 56/56 passed, and `npm run check`: passed. Added a failing-then-passing Canvas command regression for free-socket aura/orbit rendering and supported orbit radius. Fixed extra-render.js to consume equippedSkills. Browser connection to local server was blocked with ERR_BLOCKED_BY_CLIENT; physical mobile and live browser interaction remain unverified. No verified public deployment URL is available.
