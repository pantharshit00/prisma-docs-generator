import ModelGenerator from '../generator/model';
import transformDMMF from '../generator/transformDMMF';
//@ts-ignore
import { getDMMF } from '@prisma/sdk';

describe('model generator', () => {
  it('renders model directive html correctly', async () => {
    const datamodelString = /* Prisma */ `
      model User {
        id String @default(cuid())
        name String
        @@index([name])
        @@id([name, id])
        @@unique([name])
      }
    `;

    const dmmf = await getDMMF({ datamodel: datamodelString });
    const transformedDmmf = transformDMMF(dmmf);

    const modelGen = new ModelGenerator(transformedDmmf);
    const spy = jest.spyOn(modelGen, 'getModelDiretiveHTML');

    // Run the generator against the model
    modelGen.toHTML();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({
      name: '@@index',
      values: ['name'],
    });
    expect(spy).toHaveBeenCalledWith({
      name: '@@id',
      values: ['name', 'id'],
    });
    expect(spy).toHaveBeenCalledWith({
      name: '@@unique',
      values: ['name'],
    });

    // snapshot for record
    expect(
      modelGen.getModelDiretiveHTML({ name: '@@id', values: ['name', 'id'] })
    ).toMatchSnapshot();
  });

  it('renders model field table row correctly', async () => {
    const datamodelString = /* Prisma */ `
      model User {
        id String @id @default(cuid())
        name String
        /// this the email of the user
        email String @unique
        password String
      }

      model Post {
        id String @id @default(cuid())
        title String?
      }
    `;

    const dmmf = await getDMMF({ datamodel: datamodelString });
    const transformedDmmf = transformDMMF(dmmf);

    const modelGen = new ModelGenerator(transformedDmmf);
    const spy = jest.spyOn(modelGen, 'getModelFieldTableRow');

    // Run the generator against the model
    modelGen.toHTML();

    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy).toHaveBeenCalledWith(
      {
        name: 'id',
        type: 'String',
        bareTypeName: 'String',
        directives: ['@id', '@default(cuid())'],
        required: true,
      },
      'User'
    );

    expect(spy).toHaveBeenCalledWith(
      {
        name: 'email',
        type: 'String',
        bareTypeName: 'String',
        directives: ['@unique'],
        documentation: 'this the email of the user',
        required: true,
      },
      'User'
    );

    expect(spy).toHaveBeenCalledWith(
      {
        name: 'title',
        type: 'String?',
        bareTypeName: 'String',
        directives: [],
        required: false,
      },
      'Post'
    );

    expect(
      modelGen.getModelFieldTableRow(
        {
          name: 'title',
          type: 'String?',
          bareTypeName: 'String',
          directives: [],
          required: false,
        },
        'Post'
      )
    ).toMatchSnapshot();

    expect(
      modelGen.getModelFieldTableRow(
        {
          name: 'email',
          type: 'String',
          bareTypeName: 'String',
          directives: [],
          documentation: 'This is some docs',
          required: true,
        },
        'User'
      )
    ).toMatchSnapshot();
  });

  it('renders model operation html correctly', async () => {
    const datamodelString = /* Prisma */ `
      model User {
        id String @default(cuid()) @id
        name String
        otherField Int
        posts Post[]
      }

      model Post {
        id String @id @default(cuid())
        title String?
        userId String
        user User @relation(fields:[userId], references:[id])
      }
    `;

    const dmmf = await getDMMF({ datamodel: datamodelString });
    const transformedDmmf = transformDMMF(dmmf);

    const modelGen = new ModelGenerator(transformedDmmf);
    const spy = jest.spyOn(modelGen, 'getModelOperationMarkup');
    modelGen.toHTML();

    expect(spy).toHaveBeenCalled();

    expect(
      modelGen.getModelOperationMarkup(
        {
          name: 'findOne',
          description: 'Find zero or one user',
          usage: 'Example usage',
          opKeys: [
            {
              name: 'where',
              required: false,
              types: [
                {
                  type: 'UserWhereInput',
                  isList: false,
                  location: 'inputObjectTypes',
                },
              ],
            },
          ],
          output: { type: 'User', required: true, list: false },
        },
        'User'
      )
    ).toMatchSnapshot();
  });

  // TODO: add more tests for operations transform
});
