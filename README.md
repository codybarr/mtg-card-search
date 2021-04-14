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

4. Visit http://localhost:8080
5. Profit

## Scripts

`docker-compose up -d`

Spin up express / mongo containers (app stack)

`docker-compose down`

Spin it down ;)

`docker-compose logs -f mtg-card-search_server`

Follow the logs in the server container

`docker exec -it mtg-card-search_mongo mongo -u root -p somepass`

Drop into the mongo shell in the mongo container

## Mongo Commands

`db.getCollection("cards").distinct('setCode')`

Get a unique list of all MtG set codes.
