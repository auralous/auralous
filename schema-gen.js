/* eslint-disable @typescript-eslint/no-var-requires */
const graphql = require("graphql");
const fetch = require("node-fetch"); // or your preferred request in Node.js
const fs = require("fs");
const {
  getIntrospectedSchema,
  minifyIntrospectionQuery,
} = require("@urql/introspection");

fetch("http://localhost:4000/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: graphql.getIntrospectionQuery({ descriptions: false }),
  }),
})
  .then((result) => result.json())
  .then(({ data }) => {
    const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));
    fs.writeFileSync("./src/graphql/schema.json", JSON.stringify(minified));
    console.log("schema.json written");
  });
