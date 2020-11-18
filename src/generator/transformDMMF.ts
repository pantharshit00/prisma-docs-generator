import { DMMF as ExternalDMMF } from '@prisma/generator-helper';

export function lowerCase(name: string): string {
  return name.substring(0, 1).toLowerCase() + name.substring(1);
}

export interface DMMFMapping {
  model: string;
  findOne?: string | null;
  findFirst?: string | null;
  findMany?: string | null;
  create?: string | null;
  update?: string | null;
  updateMany?: string | null;
  upsert?: string | null;
  delete?: string | null;
  deleteMany?: string | null;
}

export type DMMFDocument = Omit<ExternalDMMF.Document, 'mappings'> & {
  mappings: DMMFMapping[];
};

export default function transformDMMF(
  dmmf: ExternalDMMF.Document
): DMMFDocument {
  return {
    ...dmmf,
    mappings: getMappings(dmmf.mappings, dmmf.datamodel),
  };
}

function getMappings(
  mappings: ExternalDMMF.Mappings,
  datamodel: ExternalDMMF.Datamodel
): DMMFMapping[] {
  const modelOperations = mappings.modelOperations
    .filter((mapping) => {
      const model = datamodel.models.find((m) => m.name === mapping.model);
      if (!model) {
        throw new Error(`Mapping without model ${mapping.model}`);
      }
      return model.fields.some((f) => f.kind !== 'object');
    })
    .map((mapping: any) => ({
      model: mapping.model,
      findUnique: mapping.findSingle || mapping.findOne,
      findFirst: mapping.findFirst,
      findMany: mapping.findMany,
      create: mapping.createOne || mapping.createSingle || mapping.create,
      delete: mapping.deleteOne || mapping.deleteSingle || mapping.delete,
      update: mapping.updateOne || mapping.updateSingle || mapping.update,
      deleteMany: mapping.deleteMany,
      updateMany: mapping.updateMany,
      upsert: mapping.upsertOne || mapping.upsertSingle || mapping.upsert,
    }));

  return modelOperations;
}
