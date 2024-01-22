import { ValueTransformer } from "typeorm";

const camelcaseObjectDeep = require("camelcase-object-deep");

export const toCamelCase: ValueTransformer = {
  to(value: any) {
    return camelcaseObjectDeep(value, { deep: true });
  },
  from: function (value: any) {
    return camelcaseObjectDeep(value, { deep: true });
  },
};
