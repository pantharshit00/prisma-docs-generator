import { getDMMF } from '@prisma/sdk';
import TOCGenerator from '../generator/toc';
import transformDMMF from '../generator/transformDMMF';

const datamodel = /* Prisma */ `
  model Post {
    id String @id @default(cuid())
    name String
    @@index([name])
  }

  model User {
    userId String @id @default(cuid())
    something String
  }
`;

describe('TOC', () => {
  it('renders TOC Subheader correctly', async () => {
    const dmmf = await getDMMF({ datamodel });
    const toc = new TOCGenerator(transformDMMF(dmmf));
    const spy = jest.spyOn(toc, 'getTOCSubHeaderHTML');
    // trigger the function
    toc.toHTML();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('Post');
    expect(spy).toHaveBeenCalledWith('User');
    expect(toc.getTOCSubHeaderHTML('Post')).toMatchSnapshot();
  });

  it('renders TOC subfield correctly', async () => {
    const dmmf = await getDMMF({ datamodel });
    const toc = new TOCGenerator(transformDMMF(dmmf));

    const spy = jest.spyOn(toc, 'getSubFieldHTML');
    toc.toHTML();

    expect(spy).toHaveBeenCalled();
    // every case of model name and one case of others
    expect(spy).toHaveBeenCalledWith('model', 'Post', 'id');
    expect(spy).toHaveBeenCalledWith('model', 'Post', 'name');
    expect(spy).toHaveBeenCalledWith('model', 'User', 'userId');
    expect(spy).toHaveBeenCalledWith('model', 'User', 'something');
    expect(spy).toHaveBeenCalledWith('model', 'User', 'findOne');
    expect(spy).toHaveBeenCalledWith('type', 'inputType', 'UserWhereInput');
    expect(spy).toHaveBeenCalledWith('type', 'outputType', 'User');

    expect(toc.getSubFieldHTML('model', 'Post', 'userId')).toMatchSnapshot();
  });

  it('renders on toHTML', async () => {
    const dmmf = await getDMMF({ datamodel });
    const toc = new TOCGenerator(transformDMMF(dmmf));

    const subheaderSpy = jest.spyOn(toc, 'getTOCSubHeaderHTML');
    const subfieldSpy = jest.spyOn(toc, 'getSubFieldHTML');
    const result = toc.toHTML();

    // one case of each just to make sure code calls them
    expect(subheaderSpy).toHaveBeenCalledWith('Post');
    expect(subfieldSpy).toHaveBeenCalledWith('model', 'Post', 'id');

    expect(result).toMatchSnapshot();
  });
});
