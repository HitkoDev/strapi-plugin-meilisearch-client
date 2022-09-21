"use strict";

const { registerGraphlQLQuery } = require("./graphql");

module.exports = ({ strapi }) => {
  if (strapi.plugin("graphql")) {
    strapi.log.info("[meilisearch-client] graphql detected, registering queries");
    registerGraphlQLQuery(strapi);
  }
};
