import { DMMF } from "@prisma/generator-helper";

class DocsGenerator {
  #dmmf: DMMF.Document;

  constructor(dmmf: DMMF.Document) {
    this.#dmmf = dmmf;
  }
}

export default DocsGenerator;
