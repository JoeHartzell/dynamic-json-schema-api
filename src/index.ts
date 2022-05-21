import AJV, { AnySchema } from "ajv";
import * as Dynamoose from "dynamoose";
import { S3 } from "aws-sdk";

Dynamoose.aws.sdk.config.update({
  region: "us-east-1",
});

export const Settings = Dynamoose.model(
  "Settings",
  new Dynamoose.Schema(
    {
      pk: {
        type: String,
        required: true,
        hasKey: true,
      },
      sk: {
        type: String,
        rangeKey: true,
      },

      // shared
      ns: {
        type: String,
      },
      setting: {
        type: String,
      },

      // schema
      schema: {
        type: Object,
      },

      // setting
      scope: {
        type: String,
      },
      value: [String, Number, Date, Array, Object],
    },
    {
      saveUnknown: ["schema.**", "value.**"],
    }
  )
);

// (async () => {
//   const settingsSchema = await Settings.create({
//     pk: "schema#upc",
//     sk: "schema#theme",
//     ns: "upc",
//     setting: "theme",
//     schema: {
//       $id: "https://console.aws.amazon.com/settings/theme.schema.json",
//       title: "Theme",
//       description: "Users default theme preference",
//       type: "string",
//       enum: ["default", "dark", "light"],
//     },
//   });
// })();

// const schema = {
//   pk: "schema#{ns}",
//   sk: "schema#{setting}",

//   schema: {},
// };

// const setting = {
//   pk: "setting#{ns}#{setting}",
//   sk: "scope#{arnHash}",

//   scope: "",
//   ns: "upc",
//   setting: "theme",
//   value: "dark",
// };
// const ajv = new AJV({
//   //   loadSchema: async (uri) => {
//   //     console.log("Fired");
//   //     return {};
//   //   },
// });

// // (async () => {
// //   await ajv.compileAsync({
// //     $ref: "1",
// //   });
// //   await ajv.compileAsync({
// //     $ref: "1",
// //   });
// // })();

// const upcThemeSchema: AnySchema = {
//   $id: "https://console.aws.amazon.com/settings/theme.schema.json",
//   title: "Theme",
//   description: "Users theme preference",
//   type: "string",
//   enum: ["default", "dark", "light"],
// };

// const upcLanguageSchema: AnySchema = {
//   $id: "https://console.aws.amazon.com/settings/language.schema.json",
//   title: "Language",
//   description: "Users default language preference",
//   type: "string",
// };

// ajv.addSchema(upcThemeSchema);
// ajv.addSchema(upcLanguageSchema);

// const validate = ajv.compile({
//   type: "object",
//   properties: {
//     theme: {
//       $ref: "https://console.aws.amazon.com/settings/theme.schema.json",
//     },
//     language: {
//       $ref: "https://console.aws.amazon.com/settings/language.schema.json",
//     },
//   },
// });

// const result = validate({
//   theme: "dark",
//   language: "en",
// });

// console.log(result);
