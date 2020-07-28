import { DMMF } from "@prisma/generator-helper";

export interface Generatable<T> {
  data: T;
  toHTML(): string;
  getData(d: DMMF.Document): T;
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

export function lowerCase(name: string): string {
  return name.substring(0, 1).toLowerCase() + name.substring(1);
}
