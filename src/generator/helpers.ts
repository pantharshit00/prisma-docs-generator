import { DMMF } from "@prisma/generator-helper";

export interface Generatable<T> {
  toHTML(): string;
  getData(d: DMMF.Document): T;
}
