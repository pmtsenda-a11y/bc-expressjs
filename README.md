# Proyecto de Mudanza — Procesador de Datos con Node.js + TypeScript

Dominio: **Empresa de mudanzas**
Recurso principal: **Service**

## Descripción
Esta herramienta de línea de comandos lee servicios de mudanza desde `data/services.json`, aplica filtros por categoria de servicio, calcula un resumen del catálogo y genera un reporte en `output/report.json`.

Cada servicio tiene los siguientes campos:
- `id`
- `name`
- `category` (local, nacional, express, internacional, oficina)
- `price`
- `distanceKm`
- `durationHours`
- `vehicleAssigned` (camion, furgoneta, camion_grande, camion_mediano, camion_pequeno)
- `active`

Categorías permitidas: `local`, `nacional`, `express`, `internacional`, `oficina`.

## Cómo correr el proyecto

Desde `bootcamp/week-01-nodejs_fundamentals/3-proyecto/starter`:

```bash
npm install
npm start
npm start -- --category nacional
npm start -- --category local
npm start -- --category express
```

## Funcionalidades

- Lee un archivo JSON de entrada (`data/services.json`).
- Muestra resumen en consola: total de servicios, activos, inactivos, precio promedio, distancia total, servicio más caro y más barato, categorías disponibles.
- Filtra por categoría con `--category` (valida contra `ServiceCategory` para type safety).
- Calcula el servicio más barato entre las categorías `local` y `oficina`, priorizando precio y menor distancia.
- Calcula el servicio más caro entre las categorías `internacional`, `express` y `nacional`, priorizando precio.
- Genera un reporte legible en `output/report.json`.
- Maneja errores si no existe el archivo de datos o si la categoría no es válida.
