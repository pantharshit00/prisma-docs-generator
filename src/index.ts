import { generatorHandler } from "@prisma/generator-helper";
import HTMLPrinter from "./printer";
import transformDMMF from "./generator/transformDMMF";
import * as fs from "fs";
import * as path from "path";

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "./docs",
      prettyName: "Prisma Docs Generator",
    };
  },
  async onGenerate(options) {
    const dmmf = transformDMMF(options.dmmf);
    const html = new HTMLPrinter(dmmf);
    if (options.generator.output) {
      const styleFile = await fs.promises.readFile(
        path.join(__dirname, "styles", "main.css")
      );
      await fs.promises.mkdir(options.generator.output, {
        recursive: true,
      });
      await fs.promises.mkdir(path.join(options.generator.output, "styles"), {
        recursive: true,
      });
      await fs.promises.writeFile(
        path.join(options.generator.output, "index.html"),
        html.toHTML()
      );

      await fs.promises.writeFile(
        path.join(options.generator.output, "styles", "main.css"),
        styleFile
      );
    }
  },
});
