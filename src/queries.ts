import * as Dynamoose from "dynamoose";
import AJV from "ajv";
import { Settings } from ".";

const ajv = new AJV();

Dynamoose.aws.sdk.config.update({
  region: "us-east-1",
});

(async () => {
  const result = await Settings.batchGet([
    {
      pk: "schema#upc",
      sk: "schema#language",
    },
    {
      pk: "schema#upc",
      sk: "schema#theme",
    },
  ]);

  result.forEach((s) => ajv.addSchema(s.schema));

  const s = ajv.compile({
    type: "object",
    properties: result.reduce(
      (p, r) => ({
        ...p,
        [r.setting]: {
          $ref: r.schema.$id,
        },
      }),
      {}
    ),
  });

  console.log(s.schema);

  console.log(
    s({
      language: null,
      theme: "asdf",
    })
  );
})();
