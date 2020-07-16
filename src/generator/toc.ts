import { Generatable } from "./helpers";
import { DMMF } from "@prisma/generator-helper";
import { DMMFDocument, DMMFMapping } from "./transformDMMF";

type TOCStructure = {
  models: TOCModel[];
  types: TOCTypes;
};

type TOCModel = {
  name: string;
  fields: string[];
  operations: string[];
};

type TOCTypes = {
  inputTypes: string[];
  outputTypes: string[];
  enums: string[];
};

export default class TOCGenerator implements Generatable<TOCStructure> {
  data: TOCStructure;

  constructor(d: DMMFDocument) {
    this.data = this.getData(d);
  }

  getTOCSubHeaderHTML(name: string): string {
    return `
    <div class="font-semibold text-gray-700">
      <a href="#model-${name}">${name}</a>
    </div>
   `;
  }

  getSubFieldHTML(identifier: string, root: string, field: string): string {
    return `<li><a href="#${identifier}-${root}-${field}">${field}</a></li>`;
  }

  toHTML() {
    return `
        <div>
          <h5 class="mb-2 font-bold">Models</h5>
          <ul class="mb-2 ml-1">
              ${this.data.models
                .map(
                  (model) => `
            <li class="mb-4">
                ${this.getTOCSubHeaderHTML(model.name)}
                  <div class="mt-1 ml-2">
                    <div class="mb-1 font-medium text-gray-600">Fields</div>
                      <ul class="pl-3 ml-1 border-l-2 border-gray-400">
                      ${model.fields
                        .map((field) =>
                          this.getSubFieldHTML("model", model.name, field)
                        )
                        .join("\n")}
                      </ul>
                  </div>
                  <div class="mt-2 ml-2">
                    <div class="mb-1 font-medium text-gray-600">Operations</div>
                    <ul class="pl-3 ml-1 border-l-2 border-gray-400">
                    ${model.operations
                      .map((op) =>
                        this.getSubFieldHTML("model", model.name, op)
                      )
                      .join("\n")}
                    </ul>
                  </div>
            </li>
              `
                )
                .join("\n")}
            </ul>
          <h5 class="mt-12 mb-2 font-bold">Types</h5>
          <ul class="mb-2 ml-1">
            <li class="mb-4">
              <div class="font-semibold text-gray-700">
                <a href="#types-InputTyoes">Input Types</a>
              </div>
              <ul class="pl-3 ml-1 border-l-2 border-gray-400">
              ${this.data.types.inputTypes
                .map((inputType) =>
                  this.getSubFieldHTML("type", "inputType", inputType)
                )
                .join("\n")}
              </ul>
            </li>
            <li class="mb-4">
              <div class="font-semibold text-gray-700">
                <a href="#model-User">Output Types</a>
              </div>
              <ul class="pl-3 ml-1 border-l-2 border-gray-400">
              ${this.data.types.outputTypes
                .map((outputType) =>
                  this.getSubFieldHTML("type", "outputType", outputType)
                )
                .join("\n")}
              </ul>
            </li>
          </ul>
        </div>
    `;
  }

  getModels(dmmfModel: DMMF.Model[], mappings: DMMFMapping[]): TOCModel[] {
    return dmmfModel.map((model) => {
      return {
        name: model.name,
        fields: model.fields.map((field) => field.name),
        operations: Object.keys(
          mappings.find((x) => x.model === model.name) ?? {}
        ).filter((op) => op !== "model"),
      };
    });
  }

  getTypes(dmmfSchema: DMMF.Schema): TOCTypes {
    return {
      inputTypes: dmmfSchema.inputTypes.map((inputType) => inputType.name),
      outputTypes: dmmfSchema.outputTypes.map((outputType) => outputType.name),
      enums: dmmfSchema.enums.map((x) => x.name), // can't use enum as variable as it is reserved word in TS
    };
  }

  getData(d: DMMFDocument) {
    return {
      models: this.getModels(d.datamodel.models, d.mappings),
      types: this.getTypes(d.schema),
    };
  }
}
