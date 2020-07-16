import { Generatable } from "./helpers";
import { DMMF } from "@prisma/generator-helper";
import { DMMFDocument } from "./transformDMMF";

type ModelGeneratorStructure = {
  model: MGModel[];
  // types
};

type MGModel = {
  documentation?: string;
  name: string;
  directives: MGModelDirective[];
  fields: MGModelField[];
};

type MGModelDirective = {
  name: string;
  values: string[];
};

type MGModelField = {
  name: string;
  type: string;
  directives: string[];
  documentation?: string;
  required: boolean;
};

interface FieldDefault {
  name: string;
  args: any[];
}

let fieldDirectiveMap = new Map<string, string>([
  ["isUnique", "@unique"],
  ["isId", "@id"],
  ["hasDefaultValue", "@default"],
  ["isUpdatedAt", "@updatedAt"],
  ["hasDefaultValue", "@default"],
]);

export default class ModelGenerator
  implements Generatable<ModelGeneratorStructure> {
  data: ModelGeneratorStructure;

  constructor(d: DMMFDocument) {
    this.data = this.getData(d);
  }

  getModelDirective(model: DMMF.Model): MGModelDirective[] {
    let directiveValue: MGModelDirective[] = [];

    if (model.idFields.length > 0) {
      directiveValue.push({ name: "@@id", values: model.idFields });
    }

    if (model.uniqueFields.length > 0) {
      model.uniqueFields.forEach((uniqueField) => {
        directiveValue.push({
          name: "@@unique",
          values: uniqueField,
        });
      });
    }

    if (model.uniqueIndexes.length > 0) {
      model.uniqueIndexes.forEach((uniqueIndex) => {
        directiveValue.push({ name: "@@index", values: uniqueIndex.fields });
      });
    }
    return directiveValue;
  }

  getModelFields(model: DMMF.Model): MGModelField[] {
    return model.fields.map((field) => {
      const filteredEntries = Object.entries(field).filter(([_, v]) =>
        Boolean(v)
      );
      let directives: string[] = [];
      filteredEntries.forEach(([k]) => {
        const mappedDirectiveValue = fieldDirectiveMap.get(k);
        if (mappedDirectiveValue) {
          if (k === "hasDefaultValue" && field.default !== undefined) {
            console.log(typeof field.default, field.default);
            if (
              typeof field.default === "string" ||
              typeof field.default === "number" ||
              typeof field.default === "boolean"
            ) {
              directives.push(`${mappedDirectiveValue}(${field.default})`);
            }
            if (typeof field.default === "object") {
              directives.push(
                `${mappedDirectiveValue}(${
                  (field.default as FieldDefault).name
                }(${(field.default as FieldDefault).args.join(",")}))`
              );
            }
          } else {
            directives.push(mappedDirectiveValue);
          }
        }
      });
      return {
        name: field.name,
        type: this.getFieldType(field),
        documentation: (field as any).documentation,
        directives,
        required: field.isRequired,
      };
    });
  }

  getFieldType(field: DMMF.Field): string {
    let name = field.type;
    if (!field.isRequired && !field.isList) {
      name += "?";
    }
    if (field.isList) {
      name += "[]";
    }
    return name;
  }

  getModels(dmmfModels: DMMF.Model[]): MGModel[] {
    return dmmfModels.map((model) => {
      return {
        name: model.name,
        documentation: (model as any).documentation as string, // TODO: Open issue for generator helper
        directives: this.getModelDirective(model),
        fields: this.getModelFields(model),
      };
    });
  }

  getData(d: DMMFDocument) {
    return {
      model: this.getModels(d.datamodel.models),
    };
  }

  toHTML() {
    return JSON.stringify(this.data, null, 2);
  }
}
