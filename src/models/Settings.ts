import { model, Schema } from "dynamoose";

const schema = new Schema(
  {
    pk: {
      type: String,
      required: true,
      hashKey: true,
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
);

export const Settings = model("Settings", schema);
