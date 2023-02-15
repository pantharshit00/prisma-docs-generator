import transformDMMF from '../generator/transformDMMF';
//@ts-ignore
import { getDMMF } from '@prisma/sdk';

describe('transformDMMF', () => {
  it('show relation fields when includeRelationFields = true', async () => {
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
    const transformedDmmf = transformDMMF(dmmf, {
      includeRelationFields: true,
    });

    expect(transformedDmmf).toMatchObject({
      datamodel: {
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id' },
              { name: 'name' },
              { name: 'otherField' },
              { name: 'posts' },
            ],
          },
          {
            name: 'Post',
            fields: [
              { name: 'id' },
              { name: 'title' },
              { name: 'userId' },
              { name: 'user' },
            ],
          },
        ],
      },
    });
  });

  it('hide relation fields when includeRelationFields = false', async () => {
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
    const transformedDmmf = transformDMMF(dmmf, {
      includeRelationFields: false,
    });

    expect(transformedDmmf).toMatchObject({
      datamodel: {
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id' },
              { name: 'name' },
              { name: 'otherField' },
            ],
          },
          {
            name: 'Post',
            fields: [
              { name: 'id' },
              { name: 'title' },
              { name: 'userId' },
            ],
          },
        ],
      },
    });
  });
});
