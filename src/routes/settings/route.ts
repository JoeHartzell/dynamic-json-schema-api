import { FastifyPluginAsync } from "fastify";
import { GetSettings, UpdateSettings } from "./schema";
import { Static } from "@sinclair/typebox";
import { Settings } from "../../models/Settings";
import Ajv from "ajv";
import { ObjectType } from "dynamoose/dist/General";

const pk = (key: string) => `setting#${key}`;

const sk = (namespace: string) => `namespace#${namespace}`;

const ajv = new Ajv();

export const route: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: Static<typeof GetSettings> }>(
    "/GetSettings",
    {
      schema: {
        body: GetSettings,
      },
    },
    async ({ body }) => {
      const keys = body.map(({ ns, setting }) => {
        return {
          pk: pk(setting),
          sk: sk(ns),
        };
      });

      const results = await Settings.batchGet(keys);

      return results.toJSON();
    }
  );

  fastify.post<{ Body: Static<typeof UpdateSettings> }>(
    "/UpdateSettings",
    {
      schema: {
        body: UpdateSettings,
      },
    },
    async ({ body }, reply) => {
      const schemaKeys = body.map(({ ns, setting }) => {
        return {
          pk: `schema#${setting}`,
          sk: sk(ns),
        };
      });

      // get the schemas for the update
      const schemas = await Settings.batchGet(schemaKeys);

      const updates: ObjectType[] = [];
      for (const { ns, setting, value } of body) {
        const result = schemas.find(
          (schema) => schema.ns === ns && schema.setting === setting
        );

        if (result === undefined) {
          return reply
            .code(400)
            .send({ message: "Invalid namespace and setting" });
        }

        const isValid = ajv.compile(result.schema)(value);

        if (!isValid) {
          return reply.code(400).send({ message: "Invalid request" });
        }

        updates.push({
          pk: pk(setting),
          sk: sk(ns),
          scope: "",
          ns,
          setting,
          value,
        });
      }

      return await Settings.batchPut(updates);
    }
  );
};
