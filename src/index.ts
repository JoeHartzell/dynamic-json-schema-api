import * as Dynamoose from "dynamoose";
import { fastify } from "fastify";
import { route as settings } from "./routes/settings";
import { route as schema } from "./routes/schema";

Dynamoose.aws.sdk.config.update({
  region: "us-east-1",
});

Dynamoose.aws.ddb.local("http://localhost:8000");

const server = fastify({ logger: true });

server.register(settings);
server.register(schema);

// start
(async () => {
  server.listen(3000);
  console.log("🚀 Launched on port 3000");
})();
