# Service Provider Website Released Source Code

## Description
+ This is an API for a responsive website that allows user to register and contribute their services to other people

## Required components:
+ NodeJS >= 6.0
+ MongoDB

## Optional:
+ Robo3t
+ GraphiQL App

## Clone the repository: 
1. `git clone https://github.com/tvtienit/service-provider.git`
2. `cd service-provider/`

## How to run
1. Start MongoDB: `mongod`
2. `npm install` || `yarn install`
3. `npm start` || `yarn start`

## Build the project:
1. `npm run build` || `yarn build`

## GraphQL API Endpoint:
+ Apollo Server: `localhost:2501/graphql` (POST Request only)
+ GraphiQL: `localhost:2501/graphiql` (Development MODE Only)

## Clean modules: 
+ `yarn autoclean --init && yarn autoclean --force`