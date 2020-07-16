import { generatorHandler } from "@prisma/generator-helper";
import ModelGenerator from "./generator/model";
import transformDMMF from "./generator/transformDMMF";

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
    const model = new ModelGenerator(dmmf);
    console.log(model.toHTML());
  },
});
