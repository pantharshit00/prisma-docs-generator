import { Generatable, isScalarType } from './helpers';
import { DMMFDocument } from './transformDMMF';
import { DMMF } from '@prisma/generator-helper';

type TypesGeneratorStructure = {
  inputTypes: TGType[];
  outputTypes: TGType[];
  // TODO: evaluate calling them enums as that can be ambigious
  //enums: any;
};

type TGType = {
  name: string;
  fields: TGTypeField[];
};

type TGTypeField = {
  name: string;
  type: string;
  kind: string;
  required: boolean;
  list: boolean;
  nullable: boolean;
};

class TypesGenerator implements Generatable<TypesGeneratorStructure> {
  data: TypesGeneratorStructure;

  constructor(d: DMMFDocument) {
    this.data = this.getData(d);
  }

  getTypeFieldHTML(
    field: TGTypeField,
    kind: 'inputType' | 'outputType'
  ): string {
    return `
    <tr>
      <td class="px-4 py-2 border">
        ${field.name} </td>
      <td class="px-4 py-2 border">
        ${
          isScalarType(field.type)
            ? field.type
            : `<a href="#type-${kind}-${field.type}">${field.type}</a>`
        }
      </td>

      <td class="px-4 py-2 border">
        ${field.kind}
      </td>

      <td class="px-4 py-2 border">
        ${field.required ? '<strong>Yes</strong>' : 'No'}
      </td>

      <td class="px-4 py-2 border">
        ${field.list ? '<strong>Yes</strong>' : 'No'}
      </td>
      <td class="px-4 py-2 border">
        ${field.nullable ? '<strong>Yes</strong>' : 'No'}
      </td>
    </tr>
    `;
  }

  getTypeHTML(type: TGType, kind: 'inputType' | 'outputType'): string {
    return `
      <div>
        <h3 class="mb-2 text-xl" id="type-${kind}-${type.name}">${
      type.name
    }</h3>
        <table class="table-auto">
          <thead>
            <tr>
              <th class="px-4 py-2 border">Name</th>
              <th class="px-4 py-2 border">Type</th>
              <th class="px-4 py-2 border">Kind</th>
              <th class="px-4 py-2 border">Required</th>
              <th class="px-4 py-2 border">List</th>
              <th class="px-4 py-2 border">Nullable</th>
            </tr>
          </thead>
          <tbody>
          ${type.fields
            .map((field) => this.getTypeFieldHTML(field, kind))
            .join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  toHTML() {
    return `<div>
    <h1 class="text-3xl" id="types">Types</h1>
        <div>
          <div class="ml-4">
            <h3 class="mb-2 text-2xl font-normal" id="input-types">Input Types</h3>
            <div class="ml-4">
              ${this.data.inputTypes
                .map((inputType) => this.getTypeHTML(inputType, 'inputType'))
                .join(`<hr class="my-4" />`)}
            </div>
          </div>
          <div class="ml-4">
            <h3 class="mb-2 text-2xl font-normal" id="output-types">Output Types</h3>
            <div class="ml-4">
              ${this.data.outputTypes
                .map((outputType) => this.getTypeHTML(outputType, 'outputType'))
                .join(`<hr class="my-4" />`)}
            </div>
          </div>
        </div>
      </div>
`;
  }

  getInputTypes(dmmfInputType: DMMF.InputType[]): TGType[] {
    return dmmfInputType.map((inputType) => ({
      name: inputType.name,
      fields: inputType.fields.map((ip) => ({
        kind: ip.inputType.kind,
        name: ip.name,
        nullable: ip.inputType.isNullable,
        required: ip.inputType.isRequired,
        list: ip.inputType.isList,
        type: ip.inputType.type,
      })),
    }));
  }

  getOutputTypes(dmmfOutputTypes: DMMF.OutputType[]): TGType[] {
    return dmmfOutputTypes.map((outputType) => ({
      name: outputType.name,
      fields: outputType.fields.map((op) => ({
        kind: op.outputType.kind,
        name: op.name,
        nullable: (op.outputType as any).isNullable, // TODO: report this to Tim so that he fix the typings
        required: op.outputType.isRequired,
        list: op.outputType.isList,
        type: op.outputType.type,
      })),
    }));
  }

  getData(d: DMMFDocument) {
    return {
      inputTypes: this.getInputTypes(d.schema.inputTypes),
      outputTypes: this.getOutputTypes(
        d.schema.outputTypes.filter(
          (op) => op.name !== 'Query' && op.name !== 'Mutation'
        )
      ),
    };
  }
}

export default TypesGenerator;
