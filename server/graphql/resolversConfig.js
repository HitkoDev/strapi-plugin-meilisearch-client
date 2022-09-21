const getResolversConfig = () => {
  return {
    "Query.search": {
      auth: {
        scope: "plugin::meilisearch-client.searchController.search",
      },
    },
  };
};

module.exports = {
  getResolversConfig,
};
