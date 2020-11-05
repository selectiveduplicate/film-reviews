# film-reviews

Building on the [previous app](https://github.com/selectiveduplicate/graphql-filmquery), this app explores how we can use [custom queries](https://dgraph.io/docs/graphql/custom/directive/#calling-graphql-custom-resolvers) in GraphQL schema to request data from a [remote server](https://play.dgraph.io/) to use. Essentially, it demonstrates how an app could work that combines remote data and user-supplied data, saving the final result in the app's own database after processing.

You can search for a film and write a review about it. Your username, rating and review content all get stored in the database. The stored information is accessible at any time from the UI. 

I've walked through the process of building both apps on DEV which you can find on my account page [here](https://dev.to/selectiveduplicate).

## Tools used

* [Slash GraphQL](https://dgraph.io/slash-graphql) as backend
* [Apollo](https://www.apollographql.com/) as GraphQL client
* [React](https://reactjs.org/) and [Material-UI](https://material-ui.com/) for the UI

Favicon from the awesome [Feather](https://feathericons.com/).

## How to run

First, change the `uri` of `APOLLO_CLIENT` in `src/index.js` to your own endpoint that has been deployed with `schema.graphql`. The current `uri` won't work. Then run:

```shell
npm install
npm start
```
