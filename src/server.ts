import Ajv from "ajv";
import { fastify } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import * as Dynamoose from "dynamoose";
import _ from "lodash";
import { Settings } from "./models/Settings";

// configure db
Dynamoose.aws.sdk.config.update({
  region: "us-east-1",
});

// setup schemas
const GetSettings = {
  $id: "console-control",
  type: "array",
  items: {
    type: "object",
    properties: {
      ns: {
        type: "string",
      },
      settings: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["ns", "settings"],
  },
} as const;
type GetSettingsSchema = FromSchema<typeof GetSettings>;

const UpdateSettings = {
  type: "array",
  items: {
    type: "object",
    properties: {
      ns: {
        type: "string",
      },
      settings: {
        type: "object",
      },
    },
    required: ["ns", "settings"],
  },
} as const;
type UpdateSettingsSchema = FromSchema<typeof UpdateSettings>;

const UpdateSchema = {
  type: "object",
  properties: {
    ns: {
      type: "string",
    },
    setting: {
      type: "string",
    },
    schema: {
      type: "object",
    },
  },
  required: ["ns", "setting", "schema"],
} as const;
type UpdateSchemaSchema = FromSchema<typeof UpdateSchema>;

// configure server
const ajv = new Ajv();
const server = fastify({ logger: true });

server.post<{ Body: GetSettingsSchema }>(
  "/GetSettings",
  { schema: { body: GetSettings } },
  async (request) => {
    const keys = _.flatMap(request.body, (x) => {
      return x.settings.map((setting) => ({
        pk: `setting#${x.ns}#${setting}`,
        sk: `scope#`,
      }));
    });

    const result = await Settings.batchGet(keys);

    console.log(result);

    return result.toJSON();
  }
);

server.post<{ Body: UpdateSettingsSchema }>(
  "/UpdateSettings",
  { schema: { body: UpdateSettings } },
  async (request, reply) => {
    const keys = _.flatMap(request.body, (x) => {
      return Object.keys(x.settings).map((setting) => ({
        pk: `schema#${x.ns}`,
        sk: `schema#${setting}`,
      }));
    });

    // get the schemas
    const results = await Settings.batchGet(keys);

    // construct a json schema for the settings requested
    const jsonSchemaMap = new Map();
    for (const { ns, setting, schema } of results) {
      const jsonSchema = jsonSchemaMap.get(ns);

      jsonSchemaMap.set(ns, {
        ...jsonSchema,
        [setting]: schema,
      });
    }

    // validate each "setting group"
    for (const sg of request.body) {
      const isValid = ajv.compile({
        type: "object",
        additionalProperties: false,
        properties: jsonSchemaMap.get(sg.ns),
      })(sg.settings);

      if (!isValid) {
        reply.statusCode = 400;
        return { message: "Invalid request" };
      }
    }

    const documents = _.flatMap(request.body, ({ ns, settings }) => {
      return Object.entries(settings).map(([setting, value]) => {
        return {
          pk: `setting#${ns}#${setting}`,
          sk: `scope#`,
          scope: "",
          ns,
          setting,
          value,
        };
      });
    });

    // write the settings
    return await Settings.batchPut(documents);
  }
);

server.post<{ Body: UpdateSchemaSchema }>(
  "/UpdateSchema",
  { schema: { body: UpdateSchema } },
  async (request) => {
    const { ns, setting, schema } = request.body;
    await Settings.update({
      pk: `schema#${ns}`,
      sk: `schema#${setting}`,
      ns,
      setting,
      schema,
    });

    return { message: "Success" };
  }
);

// start
(async () => {
  server.listen(3000);
})();
