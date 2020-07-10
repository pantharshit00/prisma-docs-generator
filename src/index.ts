import { generatorHandler } from "@prisma/generator-helper";

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "./output", // the value here doesn't matter, as it's resolved in https://github.com/prisma/prisma/blob/master/cli/sdk/src/getGenerators.ts
      prettyName: "Prisma Docs Generator",
      requiresEngines: ["queryEngine"],
      //version: clientVersion,
    };
  },
  async onGenerate(options) {
    console.log(options.dmmf);
  },
});

