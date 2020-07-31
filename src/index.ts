import { generatorHandler } from "@prisma/generator-helper";
import HTMLPrinter from "./printer";
import transformDMMF from "./generator/transformDMMF";
import * as fs from "fs";

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "./output",
      prettyName: "Prisma Docs Generator",
    };
  },
  async onGenerate(options) {
    const dmmf = transformDMMF(options.dmmf);
    const html = new HTMLPrinter(dmmf);
    await fs.promises.writeFile("./test.html", html.toHTML());
  },
});
