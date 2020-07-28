import { Generatable } from "./helpers";
import { DMMFDocument } from "./transformDMMF";
import { DMMF } from "@prisma/generator-helper";

type TypesGeneratorStructure = {
  inputTypes: TGInputType[];
  // TODO: start generating outputTypes after defining a html theme for them
  //outputTypes: any;
  // TODO: evaluate calling them enums as that can be ambigious
  //enums: any;
};

type TGInputType = {
  name: string;
  fields: TGInputTypeField[];
};

type TGInputTypeField = {
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

  getInputTypeFieldHTML(field: TGInputTypeField): string {
    return `
    <tr>
      <td class="px-4 py-2 border">
        ${field.name}
      </td>
      <td class="px-4 py-2 border">
        ${field.type}
      </td>

      <td class="px-4 py-2 border">
        ${field.kind}
      </td>

      <td class="px-4 py-2 border">
        ${field.required ? "<strong>Yes</strong>" : "No"}
      </td>

      <td class="px-4 py-2 border">
        ${field.list ? "<strong>Yes</strong>" : "No"}
      </td>
      <td class="px-4 py-2 border">
        ${field.nullable ? "<strong>Yes</strong>" : "No"}
      </td>
    </tr>
    `;
  }

  getInputTypeHTML(inputType: TGInputType): string {
    return `
      <div>
        <h3 class="mb-2 text-xl" id="type-inputType-${inputType.name}">${
      inputType.name
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
          ${inputType.fields
            .map((field) => this.getInputTypeFieldHTML(field))
            .join("\n")}
          </tbody>
        </table>
      </div>
    `;
  }

  toHTML() {
    return `<h1 class="text-3xl">Types</h1>
        <div>
          <div class="ml-4">
            <h3 class="mb-2 text-2xl font-normal">Input Types</h3>
            <div class="ml-4">
              ${this.data.inputTypes
                .map((inputType) => this.getInputTypeHTML(inputType))
                .join(`<hr class="my-4" />`)}
            </div>
          </div>
        </div>
`;
  }

  getInputTypes(dmmfInputType: DMMF.InputType[]): TGInputType[] {
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

  getData(d: DMMFDocument) {
    return {
      inputTypes: this.getInputTypes(d.schema.inputTypes),
      //outputTypes: {},
    };
  }
}

export default TypesGenerator;
