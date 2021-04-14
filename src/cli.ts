#!/usr/bin/env node

import meow from 'meow';
import kleur from 'kleur';
import express from 'express';
import { getSchemaPath, getGenerators } from '@prisma/sdk';
import { Server } from 'http';

const cli = meow(
  `
  Usage
  $ prisma-docs-generator [command] [flags]

  Options
    -v Prints out the version number

    ${kleur.bold('serve')}
      --port -p   Specify the port from which this cli should serve the docs
    
`,
  {
    flags: {
      port: {
        type: 'number',
        alias: 'p',
        default: 5858,
      },
      version: {
        alias: 'v',
      },
    },
  }
);

class ExpressService {
  exp: express.Express;
  appInstance: Server | null;
  port: number;
  servePath: string;

  constructor(port: number, path: string) {
    this.port = port;
    this.servePath = path;
    this.exp = express();
    this.appInstance = null;
  }

  start() {
    this.exp.use('/', express.static(this.servePath));
    this.appInstance = this.exp.listen(this.port, () => {
      console.log(
        `Prisma Docs Generator started at http://localhost:${this.port}`
      );
    });
  }

  exit() {
    if (this.appInstance) {
      this.appInstance.close();
    }
  }
}

async function execute<T extends meow.AnyFlags>(cli: meow.Result<T>) {
  const {
    flags: { port },
    input,
  } = cli;
  if (input.length < 1) {
    console.error(kleur.red('No sub command was specified'));
    cli.showHelp();
  }

  const mainSubcommand = input[0];

  switch (mainSubcommand) {
    case 'serve': {
      //@ts-ignore
      const schemaPath = await getSchemaPath();
      if (!schemaPath) {
        console.error(kleur.red('Unable to find schema.prisma file'));
        process.exit(1);
      }
      const gens = await getGenerators({ schemaPath: schemaPath });
      const docsGen = gens.find(
        (gen) => gen.manifest?.prettyName === 'Prisma Docs Generator'
      );
      if (!docsGen) {
        console.error(
          kleur.red('Prisma Docs Generator was not specified in the schema')
        );
        process.exit(1);
      }

      const servePath = docsGen.options?.generator.output?.value;
      if (!servePath) {
        console.error(
          kleur.red('Unable to resolve output path for the generator')
        );
        process.exit(1);
      }

      const server = new ExpressService(port as number, servePath);
      server.start();

      process.on('SIGTERM', () => {
        server.exit();
      });

      break;
    }
    default: {
      console.error(kleur.red(`Unknown command ${kleur.bold(mainSubcommand)}`));
      cli.showHelp();
    }
  }
}

execute(cli);
