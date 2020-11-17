import { DMMF as ExternalDMMF } from '@prisma/generator-helper';

export function lowerCase(name: string): string {
  return name.substring(0, 1).toLowerCase() + name.substring(1);
}

export type DMMFDocument = ExternalDMMF.Document;

export default function transformDMMF(
  dmmf: ExternalDMMF.Document
): DMMFDocument {
  return dmmf;
}
