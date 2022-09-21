"use strict";

const yup = require("yup");

const pluginConfigSchema = yup.object({
  contentTypes: yup.array().of(
    yup.object({
      uid: yup.string().required(),
      modelName: yup.string().required(),
      limit: yup.number(),
    })
  ),
  minQueryLength: yup.number(),
});

module.exports = {
  pluginConfigSchema,
};
