// ============================================
// WRITER — Escribe el reporte en output/report.json
// ============================================

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import type { Report } from './types.js';
import { FileWriteError, isApplicationError } from './errors.js';

export async function writeReport(report: Report): Promise<void> {
  const currentDir = fileURLToPath(new URL('.', import.meta.url));
  const outputDir = join(currentDir, '..', 'output');

  try {
    await mkdir(outputDir, { recursive: true });

    const reportPath = join(outputDir, 'report.json');
    await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    console.log(`Reporte guardado en ${reportPath}`);
  } catch (error) {
    if (isApplicationError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      throw new FileWriteError(`Error escribiendo el reporte: ${error.message}`);
    }

    throw new FileWriteError('Error desconocido al escribir el reporte');
  }
}
