const getFilteredEntries = async (ids, model) => {
  return await strapi.db.query(model).findMany({
    filters: {
      id: {
        $in: ids,
      },
    },
  });
};

module.exports = {
  getFilteredEntries,
};
