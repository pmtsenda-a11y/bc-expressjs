// ============================================
// PROCESSOR — Filtra y calcula estadísticas
// ============================================

import type { Service, ServiceSummary, ServiceCategory } from './types.js';
import { InvalidCategoryError, NoDataError } from './errors.js';

const cheapCategories: ServiceCategory[] = ['local', 'oficina'];
const expensiveCategories: ServiceCategory[] = ['internacional', 'express'];

export function filterByCategory(items: Service[], categoryFilter: ServiceCategory | null): Service[] {
  if (!categoryFilter) return items;

  const filtered = items.filter(
    (service) => service.category === categoryFilter,
  );

  if (filtered.length === 0) {
    const available = Array.from(new Set(items.map((s) => s.category)));
    throw new InvalidCategoryError(categoryFilter, available);
  }

  return filtered;
}

function pickCheapestByRules(items: Service[]): Service {
  const candidates = items.filter((service) =>
    cheapCategories.includes(service.category),
  );

  const source = candidates.length > 0 ? candidates : items;

  return source.reduce((cheapest, service) => {
    if (service.price < cheapest.price) return service;
    if (service.price === cheapest.price && service.distanceKm < cheapest.distanceKm) return service;
    return cheapest;
  });
}

function pickMostExpensiveByRules(items: Service[]): Service {
  const candidates = items.filter((service) =>
    expensiveCategories.includes(service.category),
  );

  const source = candidates.length > 0 ? candidates : items;

  return source.reduce((mostExpensive, service) => {
    if (service.price > mostExpensive.price) return service;
    if (service.price === mostExpensive.price && service.distanceKm > mostExpensive.distanceKm) return service;
    return mostExpensive;
  });
}

export function calculateSummary(items: Service[], allServices: Service[]): ServiceSummary {
  if (items.length === 0) {
    throw new NoDataError('No hay servicios para analizar.');
  }

  const total = items.length;
  const active = items.filter((s) => s.active).length;
  const inactive = total - active;

  const totalDistance = items.reduce((acc, s) => acc + s.distanceKm, 0);
  const totalPrice = items.reduce((acc, s) => acc + s.price, 0);

  const averagePrice = Number((totalPrice / total).toFixed(2));
  const mostExpensive = pickMostExpensiveByRules(allServices);
  const cheapest = pickCheapestByRules(allServices);

  const serviceCategories = Array.from(new Set(items.map((s) => s.category)));

  return {
    total,
    active,
    inactive,
    averagePrice,
    mostExpensive,
    cheapest,
    serviceCategories,
    totalDistance,
  };
}
