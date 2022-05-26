import { Type } from "@sinclair/typebox";

export const UpdateSchema = Type.Object({
  ns: Type.String(),
  setting: Type.String(),
  schema: Type.Record(Type.String(), Type.Any()),
});

export const GetSchemas = Type.Array(
  Type.Object(
    {
      ns: Type.String(),
      setting: Type.String(),
    },
    { additionalProperties: false }
  ),
  {
    minItems: 1,
    uniqueItems: true,
  }
);
