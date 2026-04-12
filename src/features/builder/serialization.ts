import type { BuilderDesign } from "./model";

export const BUILDER_SERIALIZATION_VERSION = 1;

export interface BuilderSerializedPayload {
  version: number;
  generatedAt: string;
  design: BuilderDesign;
}

export const toBuilderPayload = (
  design: BuilderDesign,
): BuilderSerializedPayload => ({
  version: BUILDER_SERIALIZATION_VERSION,
  generatedAt: new Date().toISOString(),
  design,
});

export const serializeBuilderDesign = (design: BuilderDesign): string =>
  JSON.stringify(toBuilderPayload(design), null, 2);

export const deserializeBuilderDesign = (
  payload: string,
): BuilderSerializedPayload => {
  const parsed: unknown = JSON.parse(payload);

  if (!isBuilderSerializedPayload(parsed)) {
    throw new Error("Invalid builder payload format");
  }

  return parsed;
};

export const exportBuilderDesign = (
  design: BuilderDesign,
): Blob =>
  new Blob([serializeBuilderDesign(design)], {
    type: "application/json;charset=utf-8",
  });

const isBuilderSerializedPayload = (
  value: unknown,
): value is BuilderSerializedPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BuilderSerializedPayload>;

  return (
    typeof candidate.version === "number" &&
    typeof candidate.generatedAt === "string" &&
    Boolean(candidate.design)
  );
};
