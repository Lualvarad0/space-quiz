# Órbita — Simulador de misión espacial

Un MVP web en español para gestionar una expedición ficticia a Europa, la luna de Júpiter. Cada jornada consume recursos y, en días señalados, la tripulación debe decidir cómo responder a los eventos de la misión.

## Requisitos

- Node.js 22 o posterior
- npm

## Desarrollo

```sh
npm install
npm run dev
```

## Comprobaciones

```sh
npm run lint
npm run build
```

## Cómo jugar

Avanza las jornadas para completar la trayectoria, administra combustible, energía, suministros e integridad del casco, y resuelve los eventos de los días 2, 4 y 6. La misión concluye al terminar el día 7. Tu partida se guarda automáticamente en este navegador y se restaura al volver; puedes iniciar otra expedición al finalizar.

Las reglas del simulador están en `src/mission.ts` y la interfaz en español en `src/App.tsx`.

## Pruebas

```sh
npm test
```
