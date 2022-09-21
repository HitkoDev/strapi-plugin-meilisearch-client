# Strapi-plugin-meilisearch-client

This plugin adds a search endpoint to [Meilisearch Strapi Plugin](https://market.strapi.io/plugins/strapi-plugin-meilisearch).

# Requirements

Strapi Version v4.x.x
Meilisearch Strapi Plugin v4.x.x

# Installation

Enable the `meilisearch-client` plugin in the `./config/plugins.js` of your Strapi project.

Make sure to set the appropriate permissions for the `search` route in the `Permissions` tab of the `Users & Permission Plugin` for the role to be able to access the search route.

## Options/Config

Mandatory settings are marked with `*`.

### General Options

In order to register serchable content types when Strapi starts, this plugin requires the following configurations to be set in the `.config/plugins.js` file of your Strapi project to work.

| Key            | Type             | Notes                                                                                                                                    |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| contentTypes\* | Array of Objects | List the content types you want to register. Each object requires the `uid: string` and `modelName: string` to be set for a content type |
| minQueryLength | int (positive)   | Requires query to have at least that many characters, otherwise returns no result                                                        |

### Full Example config

```JavaScript
module.exports = ({ env }) => ({
  // ...

  "meilisearch-client": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::author.author",
          modelName: "author",
          limit: 10,
        },
        {
          uid: "api::book.book",
          modelName: "book",
        },
      ],
      minQueryLength: 3,
    },
  },

  // ...
});
```

# Usage

## Search

Hitting the `/api/meilisearch-client/search?query=<your-query-string>` will return an array of matched entries for each content type registered in the config. If no match could be found an empty array will be returned. The endpoint accepts an optional `locale=<your-locale>` query as well.

Alternatively (and if the graphql plugin is installed), a search query is registered that accepts `query: String!` and `locale: I18NLocaleCode` (optional) as arguments.

**IMPORTANT:** Please not that in order to query for the locale of a content type, localization must be enabled for the content type.

# Examples

## Example Requests

### REST

```JavaScript
await fetch(`${API_URL}/api/meilisearch-client/search?query=john&locale=en`);
// GET /api/meilisearch-client/search?query=john&locale=en
```

### GraphQl

```graphql
query {
  search(query: "john", locale: "en") {
    authors {
      data {
        attributes {
          name
        }
      }
    }
    books {
      data {
        attributes {
          title
          description
        }
      }
    }
  }
}
```

## Example Responses

### REST

```json
{
  "authors": [
    {
      "id": 1,
      "name": "John Doe",
      "description": "John Doe ist an amazing author that is famous for his book \"The Rising Star\". In his works he likes to describe feelings of happiness and contempt using colorful metaphors.",
      "createdAt": "2022-05-05T13:08:19.312Z",
      "updatedAt": "2022-05-05T13:34:46.488Z",
      "publishedAt": "2022-05-05T13:22:17.310Z"
    }
  ],
  "books": [
    {
      "id": 1,
      "title": "The Rising Star",
      "description": "The Rising Star is a beautiful book written by John Doe.",
      "createdAt": "2022-05-05T13:08:43.816Z",
      "updatedAt": "2022-05-05T13:24:07.107Z",
      "publishedAt": "2022-05-05T13:22:23.764Z"
    }
  ]
}
```

### GraphQl

```json
{
  "data": {
    "search": {
      "authors": {
        "data": [
          {
            "attributes": {
              "name": "John Doe"
            }
          }
        ]
      },
      "books": {
        "data": [
          {
            "attributes": {
              "title": "The Rising Star",
              "description": "The Rising Star is a beautiful book written by John Doe."
            }
          }
        ]
      }
    }
  }
}
```

# Found a bug?

If you found a bug or have any questions please [submit an issue](https://github.com/HitkoDev/strapi-plugin-meilisearch-client/issues). If you think you found a way how to fix it, please feel free to create a pull request!
