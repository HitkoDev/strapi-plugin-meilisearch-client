const { getPluginService } = require("../utils/getPluginService");
const { buildGraphqlResponse } = require("../utils/buildGraphqlResponse");

const getCustomTypes = (strapi, nexus) => {
  const { naming } = getPluginService(strapi, "utils", "graphql");
  const { contentTypes } = getPluginService(strapi, "settingsService").get();
  const { getEntityResponseCollectionName, getFindQueryName } = naming;

  // Get response names
  contentTypes.forEach((type) => {
    type.model.responseName = getEntityResponseCollectionName(type.model);
  });

  // Extend the SearchResponse type for each registered model
  const extendSearchType = (nexus, model) => {
    return nexus.extendType({
      type: "SearchResponse",
      definition(t) {
        t.field(getFindQueryName(model), { type: model.responseName });
      },
    });
  };

  const returnTypes = [
    nexus.objectType({
      name: "SearchResponse",
      definition() { },
    }),
    nexus.extendType({
      type: "Query",
      definition(t) {
        t.field("search", {
          type: "SearchResponse",
          args: {
            query: nexus.nonNull(
              nexus.stringArg(
                "The query string by which the models are searched"
              )
            ),
            locale: nexus.arg({ type: "I18NLocaleCode", description: "The locale by which to filter the models" }),
          },
          async resolve(_parent, args, ctx) {
            // Destructure the args to get query value
            const { query, locale } = args;
            const { auth } = ctx.state;

            const searchResults = await getPluginService(
              strapi,
              "meilisearchClientService"
            ).getResults(query, locale);

            const resultsResponse = await buildGraphqlResponse(
              searchResults,
              auth
            );
            /**
             * Error handling
             * TODO: Implement error handling
             * TODO: Locale==null Handling
             */
            if (resultsResponse) {
              return resultsResponse;
            } else {
              throw new Error(ctx.koaContext.response.message);
            }
          },
        });
      },
    }),
  ];

  contentTypes.forEach((type) => {
    returnTypes.unshift(extendSearchType(nexus, type.model));
  });

  return returnTypes;
};

module.exports = {
  getCustomTypes,
};
