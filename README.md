# mtg-card-search

Simple card search API for Magic the Gathering.

Tech used: Express, Apollo Server, MongoDB, Mongoose, GraphQL, React, Vite, TailwindCSS, Docker Compose.

## Set Up

_Pre-reqs: Install Docker (and make sure docker compose is installed)_

1. Clone the repo
2. `mv client/.env.sample client/.env`
3. `mv server/.env.sample server/.env`
4. Run `docker-compose up` _(initial startup may take a while - wait for client to finish)_
5. In another terminal tab run `npm run seed` to download MTGJSON AllPrintings data and seed the card collection.
   The seed file is fetched at runtime, so you do not need Git LFS or a checked-in `seed/cards.csv`.

```
➜ npm run seed

> mtg-card-search@1.1.0 seed
> docker exec mtg-card-search_server npm run seed

Downloading MTGJSON data from https://mtgjson.com/api/v5/AllPrintings.json.gz
MongoDB connected
Dropping existing cards collection
Imported 10,000 cards...
...
Seed complete: imported 100,000+ cards from 900+ sets
```

6. React client frontend can be accessed at: http://localhost:8080
7. Apollo GraphQL playground can be accessed at: http://localhost:4000

## Scripts

`docker-compose up -d`

Spin up express / mongo containers (app stack)

`docker-compose down`

Spin it down ;)

`docker-compose logs -f server`

Follow the logs in the server container

`npm run seed`

Download `AllPrintings.json.gz` from MTGJSON and rebuild the `cards` collection. Optional env vars when running inside `server`: `MTGJSON_URL` and `SEED_BATCH_SIZE`.

`docker exec -it mtg-card-search_mongo mongosh -u root -p somepass`

Drop into the mongo shell in the mongo container

## Mongo Commands

`db.getCollection("cards").distinct('setCode')`

Get a unique list of all MtG set codes.

## GraphQL Queries

Access the GraphQL playground at: http://localhost:4000

Here's some example queries you can run:

### Regular whole card database search with pagination

```js
query CardSetSearchWithPagination {
  pagination: cardPagination(
    perPage: 50
    page: 11
    filter: { _operators: { originalReleaseDate: { exists: true	} } }
    sort: RARITY_DESC
  ) {
    items {
      _id
      name
      manaCost
      rarity
      set {
        releaseDate
        name
        code
      }
      convertedManaCost
      colorIdentity
      text
      scryfallId
    }
    pageInfo {
      itemCount
      pageCount
      perPage
      currentPage
    }
  }
}
```

### Search for cards by text in card name

```js
// query
query SearchCards($name: RegExpAsString) {
  cardMany(
    limit: 10
    filter: { _operators: { name: { regex: $name } } }
  ) {
    _id
    name
    manaCost
    rarity
    setCode
    convertedManaCost
    colorIdentity
    text
  }
}
```

```js
// Query Variables
{
	"name": "/Garruk/i"
}
```

### Search for cards in a particular set

```js
query {
  cardMany(
  	filter:{
      _operators:{
        setCode:{
          in:["8E"]
        }
      }
    }
    limit:10
    sort: _ID_DESC
  ) {
    _id
    name
    manaCost
    rarity
    setCode
    convertedManaCost
    colorIdentity
    text
    type
    types
  }
}
```

### Get a list of all core release sets sorted by release date

```js
query Sets {
  setMany(
    sort: RELEASEDATE_DESC
    filter:{
      _operators:{
      	code:{
          regex:"/^[0-9]+E.?$/"
        }
      }
    }
  ) {
    name
    type
    code
    releaseDate
  }
  setCount
}
```
