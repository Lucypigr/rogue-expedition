# EMBERFALL · Portability

## Current target

EMBERFALL is Web-first and currently uses HTML, CSS, native JavaScript modules, Canvas and Web Audio.

## Architecture requirements for portability

- Simulation rules stay independent from DOM APIs.
- Rendering remains replaceable.
- Input sources map to shared actions.
- Platform APIs stay behind small adapters.
- Skills, enemy statistics and future encounter data remain data-driven.
- Save data must use an explicit schema version before persistent progression is expanded.

## Web / PWA

The existing static build is suitable for GitHub Pages and similar static hosting. A PWA can later add installability, offline caching and home-screen launch without changing core gameplay.

## Android / iOS wrapper

Capacitor is the preferred first evaluation path if a native-store package is needed while preserving the Web runtime. Platform-specific work would still be required for safe areas, lifecycle, audio interruptions, orientation, storage and store packaging.

## Desktop wrapper

Tauri should be evaluated before Electron when a desktop package is required because EMBERFALL does not currently need a large Node runtime in production. Electron remains an option if future integrations require its ecosystem.

## Unity port

There is no one-click conversion from the Web project to Unity. A Unity version would reuse design rules, balance data, source art/audio and acceptance tests, while rewriting rendering, input/platform integration and most runtime code in C#.

Suggested mapping:

| Web system | Unity equivalent |
| --- | --- |
| `engine.js` simulation | C# gameplay/domain systems |
| `renderer.js` Canvas drawing | SpriteRenderer / URP / VFX systems |
| `input.js` | Unity Input System action maps |
| `audio.js` Web Audio | AudioSource / mixer or middleware |
| `world.js` collision/spatial hash | custom spatial system, Physics2D or DOTS depending scale |
| `data.js` registries | ScriptableObjects and/or JSON data |

A Unity port should begin only after the Web gameplay loop and content structure are stable enough to justify maintaining another runtime.

## Mobile verification checklist

- No hover-only controls.
- Pointer/touch capture behaves correctly with multiple fingers.
- Page does not scroll or zoom accidentally during gameplay.
- iPhone safe areas are respected.
- Portrait and landscape layouts remain usable.
- Audio is unlocked after a user gesture.
- Device pixel ratio is capped for GPU stability.
- Memory and particle/enemy caps are appropriate for mobile hardware.
- iOS Safari and Android Chrome are tested separately.
