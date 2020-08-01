## Prisma Documentation Generator

Automatically generate a reference from your Prisma Schema. This package contains a prisma generator so reference will automatically update everytime you will run `prisma generate`

![screenshot](https://user-images.githubusercontent.com/22195362/89097596-edeadc00-d3fd-11ea-91ea-86d5d8076da0.png)


## Getting Started

1. Install this package using:
```shell
npm install prisma-docs-generator
```

2. Add the generator to the schema
```prisma
generator docs {
  provider = "node node_modules/prisma-docs-generator"
}
```

3. Run `npx prisma generate` to trigger the generator. This will create a `docs` folder in `prisma/docs`
4. Serve the docs using `npx prisma-docs-generator serve`


## Options

### Specifying Output

You can specify the out of the docs using the output property

```prisma
generator docs {
  provider = "node node_modules/prisma-docs-generator"
  output = "../../docs"
}
```

## CLI

// TODO

### License

MIT Harshit Pant

(This is not an official Prisma project. It is personally maintained by Harshit)

