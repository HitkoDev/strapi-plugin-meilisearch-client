// Destructure search results and return them in appropriate/sanitized format
const buildGraphqlResponse = async (searchResults, auth) => {
  const { sanitizeOutput } = require("../utils/sanitizeOutput");
  const { getPluginService } = require("../utils/getPluginService");
  const { toEntityResponseCollection } = getPluginService(
    strapi,
    "format",
    "graphql"
  ).returnTypes;

  const resultsResponse = {};

  // Map over results instead of using for each so promises can be resolved
  // and thus resultsResponse can be build properly
  searchResults.map((res) => {
    resultsResponse[res.pluralName] = toEntityResponseCollection(
      res.hits.map(async (hit) => {
        const sanitizedEntity = await sanitizeOutput(
          hit,
          res.contentType,
          auth
        );

        return sanitizedEntity;
      })
    );
  });

  return resultsResponse;
};

module.exports = {
  buildGraphqlResponse,
};
