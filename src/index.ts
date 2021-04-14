import { generatorHandler } from '@prisma/generator-helper';
import HTMLPrinter from './printer';
import transformDMMF from './generator/transformDMMF';
import * as fs from 'fs';
import * as path from 'path';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './docs',
      prettyName: 'Prisma Docs Generator',
    };
  },
  async onGenerate(options) {
    const dmmf = transformDMMF(options.dmmf);
    const html = new HTMLPrinter(dmmf);

    const output = options.generator.output?.value;

    if (output) {
      const styleFile = await fs.promises.readFile(
        path.join(__dirname, 'styles', 'main.css')
      );
      try {
        await fs.promises.mkdir(output, {
          recursive: true,
        });
        await fs.promises.mkdir(path.join(output, 'styles'), {
          recursive: true,
        });
        await fs.promises.writeFile(
          path.join(output, 'index.html'),
          html.toHTML()
        );

        await fs.promises.writeFile(
          path.join(output, 'styles', 'main.css'),
          styleFile
        );
      } catch (e) {
        console.error('Error: unable to write files for Prisma Docs Generator');
        throw e;
      }
    } else {
      throw new Error('No output was specified for Prisma Docs Generator');
    }
  },
});
