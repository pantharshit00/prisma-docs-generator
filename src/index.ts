import { generatorHandler } from "@prisma/generator-helper";
import HTMLPrinter from "./printer";
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
    const html = new HTMLPrinter(dmmf);
    await fs.promises.writeFile("./test.html", html.toHTML());
  },
});
