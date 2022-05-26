import { FastifyPluginAsync } from "fastify";
import { Settings } from "../../models/Settings";
import { UpdateSchema, GetSchemas } from "./schema";

/**
 * Builds DDB pk
 * @param namespace
 * @returns
 */
const pk = (setting: string) => `schema#${setting}`;

/**
 * Builds DDB sk
 * @param setting
 * @returns
 */
const sk = (namespace: string) => `namespace#${namespace}`;

export const route: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: typeof UpdateSchema.$static }>(
    "/UpdateSchema",
    {
      schema: {
        body: UpdateSchema,
      },
    },
    async ({ body }, reply) => {
      const { ns, schema, setting } = body;

      await Settings.update({
        pk: pk(setting),
        sk: sk(ns),
        ns,
        setting,
        schema,
      });

      return reply.code(200).send();
    }
  );

  fastify.post<{ Body: typeof GetSchemas.$static }>(
    "/GetSchemas",
    {
      schema: {
        body: GetSchemas,
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
};
