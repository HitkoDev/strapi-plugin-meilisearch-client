const { getPluginService } = require("../utils/getPluginService");
const { NotFoundError } = require("@strapi/utils/lib/errors");
const { sanitizeOutput } = require("../utils/sanitizeOutput");

module.exports = ({ strapi }) => ({
  async search(ctx) {
    const query = ctx.query.query;
    const locale = ctx.query.locale;
    const { auth } = ctx.state;

    const searchResults = await getPluginService(
      strapi,
      "meilisearchClientService"
    ).getResults(query, locale);

    const resultsResponse = {};
  
    // Map over results instead of using for each so promises can be resolved
    // and thus resultsResponse can be build properly
    await Promise.all(
      searchResults.map(async (res) => {
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
      })
    );

    return resultsResponse;
  },
});
