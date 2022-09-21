const { getFilteredEntries } = require("../utils/getFilteredEntries");
const { getPluginService } = require("../utils/getPluginService");

module.exports = ({ strapi }) => ({
  async getResults(query, locale) {
    const { contentTypes } = getPluginService(strapi, "settingsService").get();
    const meilisearch = getPluginService(strapi, "meilisearch", "meilisearch");
    const indexes = await meilisearch.getIndexes()
      .then(indexes => indexes.reduce((t, v) => {
        t[v.uid] = v;
        return t;
      }, {}));

    // Get all projects, news and articles for a given locale and query filter, to be able to filter through them
    // Doing this in the resolver so we always have the newest entries
    const filteredEntries = await Promise.all(
      contentTypes.map(async (contentType) => {
        const limit = Math.max(1, Math.min(1000, contentType.limit || 1000));
        const indexName = meilisearch.getIndexNameOfContentType({ contentType: contentType.modelName });
        const index = indexes[indexName];
        let hits = [];
        if (index) {
          hits = (await index.search(query, { limit })).hits;
        }
        const ids = locale
          ? hits
            .map(h => h[locale]?._id)
            .filter(h => !!h)
          : hits
            .map(h => h._id)
            .filter(h => !!h);

        const resolved = await getFilteredEntries(ids, contentType.model.uid)
          .then(res => res.reduce((t, v) => {
            t[v.id] = v;
            return t
          }, {}));

        return {
          pluralName: contentType.model.info.pluralName,
          hits: ids.map(id => resolved[id]).filter(v => !!v),
          contentType: contentType.model
        }
      })
    );

    return filteredEntries;
  },
});
