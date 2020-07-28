import { generatorHandler } from "@prisma/generator-helper";
import TypesGenerator from "./generator/apitypes";
import transformDMMF from "./generator/transformDMMF";
import * as fs from "fs";

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "./output", // the value here doesn't matter, as it's resolved in https://github.com/prisma/prisma/blob/master/cli/sdk/src/getGenerators.ts
      prettyName: "Prisma Docs Generator",
      //version: clientVersion,
    };
  },
  async onGenerate(options) {
    const dmmf = transformDMMF(options.dmmf);
    const typesgen = new TypesGenerator(dmmf);
    await fs.promises.writeFile("./test.html", typesgen.toHTML());
  },
});
