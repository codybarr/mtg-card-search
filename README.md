# mtg-card-search

Simple card search API for Magic the Gathering.

Tech used: Express, Apollo Server, MongoDB, Mongoose, GraphQL, React, Snowpack, TailwindCSS, Docker Compose.

## Set Up

_Pre-reqs: Install Docker (and make sure docker compose is installed)_

1. Clone the repo
2. `mv client/.env.sample client/.env`
3. Run `docker-compose up` _(initial startup may take a while - wait for client to finish)_
4. In another terminal tab run `npm run seed` to seed the card collection.
   _(it should look something like this)_

```
➜ npm run seed

> mtg-card-search@1.0.0 seed
> docker exec mtg-card-search_mongo mongoimport --db=mtg-search --collection=cards --authenticationDatabase=admin --authenticationMechanism=SCRAM-SHA-256 -u=root -p=somepass --drop --type=csv --headerline --file=/data/seed/cards.csv

2021-04-13T22:56:55.551+0000	connected to: mongodb://localhost/
2021-04-13T22:56:55.555+0000	dropping: mtg-search.cards
2021-04-13T22:56:58.552+0000	[###########.............] mtg-search.cards	24.8MB/53.5MB (46.3%)
2021-04-13T22:57:01.516+0000	[#####################...] mtg-search.cards	48.1MB/53.5MB (89.8%)
2021-04-13T22:57:02.218+0000	[########################] mtg-search.cards	53.5MB/53.5MB (100.0%)
2021-04-13T22:57:02.218+0000	56946 document(s) imported successfully. 0 document(s) failed to import.
```

4. React client frontend can be accessed at: http://localhost:8080
5. Apollo GraphQL playground can be accessed at: http://localhost:4000

## Scripts

`docker-compose up -d`

Spin up express / mongo containers (app stack)

`docker-compose down`

Spin it down ;)

`docker-compose logs -f server`

Follow the logs in the server container

`docker exec -it mtg-card-search_mongo mongo -u root -p somepass`

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
