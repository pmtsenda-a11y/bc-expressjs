// ============================================
// ERRORES — Tipos de errores personalizados
// ============================================

export class ApplicationError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode: number = 1) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'ApplicationError';
  }
}

export class FileReadError extends ApplicationError {
  constructor(message: string) {
    super('FILE_READ_ERROR', message, 2);
    this.name = 'FileReadError';
  }
}

export class FileWriteError extends ApplicationError {
  constructor(message: string) {
    super('FILE_WRITE_ERROR', message, 3);
    this.name = 'FileWriteError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 4);
    this.name = 'ValidationError';
  }
}

export class InvalidCategoryError extends ValidationError {
  constructor(category: string, available: string[]) {
    super(
      `Categoría inválida: "${category}". Categorías permitidas: ${available.join(', ')}`
    );
    this.name = 'InvalidCategoryError';
  }
}

export class NoDataError extends ValidationError {
  constructor(message: string = 'No hay servicios para analizar.') {
    super(message);
    this.name = 'NoDataError';
  }
}

export class MissingArgumentError extends ValidationError {
  constructor(argumentName: string) {
    super(
      `El argumento --${argumentName} requiere un valor. Ejemplo: --${argumentName} express`
    );
    this.name = 'MissingArgumentError';
  }
}

export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError;
}
