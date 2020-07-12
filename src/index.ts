import { generatorHandler } from "@prisma/generator-helper";
import GeneratorTOC from "./generator/toc";
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
    const test = new GeneratorTOC(transformDMMF(options.dmmf));
    console.log(test.toHTML());
  },
});
