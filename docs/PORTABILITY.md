# Portability
Keep simulation, typed gem data, connection rules, loot and affix calculations independent of DOM. Web input remains shared across keyboard and touch.
Save format: socket schema v2 uses typed gem objects; socketGems reads legacy active/support rows. Currently only best survival time persists; there is no saved run migration to execute.
PWA / Capacitor can wrap the web build after device testing. Desktop wrappers are optional. Unity requires rewriting Canvas/UI/input adapters in C# and reproducing the socket, damage, loot and aura acceptance tests; it is not a one-click conversion.
Acceptance still needed on iOS Safari and Android Chrome: four socket buttons fit at narrow widths, gem picker scrolls without moving arena, touch selection installs/removes, aura buttons remain reachable, audio unlock works.
