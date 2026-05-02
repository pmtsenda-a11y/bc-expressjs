// ============================================
// ENTRY POINT — Orquesta todo el flujo
// ============================================

import { readItems } from './reader.js';
import { filterByCategory, calculateSummary } from './processor.js';
import { writeReport } from './writer.js';
import type { Report, ServiceCategory } from './types.js';
import { MissingArgumentError, InvalidCategoryError, isApplicationError } from './errors.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // 🔹 Buscar argumento --category
  const categoryIndex = args.indexOf('--category');

  let categoryFilter: ServiceCategory | null = null;

  // 🔹 Validar y obtener valor
  if (categoryIndex !== -1) {
    if (
      categoryIndex + 1 >= args.length ||
      args[categoryIndex + 1].startsWith('--')
    ) {
      throw new MissingArgumentError('category');
    }

    const value = args[categoryIndex + 1];
    const validCategories: ServiceCategory[] = ['local', 'nacional', 'internacional', 'oficina', 'express'];

    if (!validCategories.includes(value as ServiceCategory)) {
      throw new InvalidCategoryError(value, validCategories);
    }

    categoryFilter = value as ServiceCategory;
  }

  // 🔹 Flujo principal
  const services = await readItems();
  const filteredServices = filterByCategory(services, categoryFilter);
  const summary = calculateSummary(filteredServices, services);

  const report: Report = {
    generatedAt: new Date().toISOString(),
    appliedFilter: categoryFilter,
    summary,
    items: filteredServices,
  };

  // 🔹 Salida en consola
  console.log(' --- Reporte de Servicios de Mudanza ---');
  console.log(` Total servicios: ${summary.total}`);
  console.log(` Activos: ${summary.active}`);
  console.log(` Inactivos: ${summary.inactive}`);
  console.log(` Precio promedio: $${summary.averagePrice}`);
  console.log(` Distancia total: ${summary.totalDistance} km`);
  console.log(` Más caro: ${summary.mostExpensive.name} ($${summary.mostExpensive.price})`);
  console.log(` Más barato: ${summary.cheapest.name} ($${summary.cheapest.price})`);
  console.log(` Categorías de servicio: ${summary.serviceCategories.join(', ')}`);

  await writeReport(report);
}

main().catch((error) => {
  if (isApplicationError(error)) {
    console.error(`[${error.code}] ${error.message}`);
    process.exit(error.statusCode);
  } else if (error instanceof Error) {
    console.error(`[ERROR] ${error.message}`);
    process.exit(1);
  } else {
    console.error('[ERROR] Error desconocido');
    process.exit(1);
  }
});
