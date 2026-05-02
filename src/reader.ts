// ============================================
// READER — Lee el archivo de datos JSON
// ============================================

import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import type { Service } from './types.js';
import { FileReadError, ValidationError, isApplicationError } from './errors.js';

const allowedCategories = [
  'local',
  'nacional',
  'internacional',
  'oficina',
  'express',
] as const;

function validateCategories(items: Service[]): void {
  const invalidItems = items.filter(
    (service) => !allowedCategories.includes(service.category),
  );

  if (invalidItems.length > 0) {
    const invalidList = invalidItems
      .map((service) => `${service.id} (${service.category})`)
      .join(', ');

    throw new ValidationError(
      `Categorías inválidas en data/services.json: ${invalidList}. Categorías permitidas: ${allowedCategories.join(', ')}`,
    );
  }
}

export async function readItems(): Promise<Service[]> {
  const currentDir = fileURLToPath(new URL('.', import.meta.url));
  const filePath = join(currentDir, '..', 'data', 'services.json');

  try {
    const raw = await readFile(filePath, 'utf-8');
    const items = JSON.parse(raw) as Service[];
    validateCategories(items);
    return items;
  } catch (error) {
    if (isApplicationError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      throw new FileReadError(`Error leyendo data/services.json: ${error.message}`);
    }

    throw new FileReadError('Error desconocido al leer data/services.json');
  }
}
