// ============================================
// TIPOS — Dominio de empresa de mudanzas
// ============================================

export type ServiceCategory =
  | 'local'
  | 'nacional'
  | 'internacional'
  | 'oficina'
  | 'express';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  distanceKm: number;
  durationHours: number;
  vehicleAssigned:
    | 'camion'
    | 'furgoneta'
    | 'camion_grande'
    | 'camion_mediano'
    | 'camion_pequeno';
  active: boolean;
}

export interface ServiceSummary {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: Service;
  cheapest: Service;
  serviceCategories: string[];
  totalDistance: number;
}

export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: ServiceSummary;
  items: Service[];
}