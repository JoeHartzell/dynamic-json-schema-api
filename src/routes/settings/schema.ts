import { Type } from "@sinclair/typebox";

export const GetSettings = Type.Array(
  Type.Object(
    {
      ns: Type.String(),
      setting: Type.String(),
    },
    { additionalProperties: false }
  ),
  {
    minItems: 1,
  }
);

export const UpdateSettings = Type.Array(
  Type.Object(
    {
      ns: Type.String(),
      setting: Type.String(),
      value: Type.Any(),
      options: Type.Optional(Type.Any()),
    },
    { additionalProperties: false }
  ),
  {
    minItems: 1,
  }
);
