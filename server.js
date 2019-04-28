import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import fs from 'fs';
import https from 'https';
import http from 'http';
import Twitter from './apis/twitter';
require('dotenv').config();
import mongo from './config/mongo';
import GenderML from "./apis/genderML";
import MLJob from "./jobs/genderAIJob";



const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: false, port: 4000, hostname: 'example.com' },
    development: { ssl: false, port: 4000, hostname: 'localhost' }
};

const environment = process.env.NODE_ENV || 'production';
const config = configurations.development;


const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: () => console.log('Connected to websocket'),
    },
    dataSources: () => {
        return {
            twitter: new Twitter(),
            genderML: new GenderML(),
        };
    },
    context: ({req}) => {
        return {
            token: "",
        };
    },
});

const app = express();
apollo.applyMiddleware({
    app,
    // path: '/api'
});

// Create the HTTPS or HTTP server, per configuration
let server;
if (config.ssl) {
    // Assumes certificates are in .ssl folder from package root. Make sure the files
    // are secured.
    server = https.createServer(
        {
            key: fs.readFileSync(`./ssl/${environment}/server.key`),
            cert: fs.readFileSync(`./ssl/${environment}/server.cert`)
        },
        app
    )
} else {
    server = http.createServer(app)
}

// Add subscription support
apollo.installSubscriptionHandlers(server)

server.listen({ port: config.port }, () =>{
    console.log(
        'Server ready at',
        `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`
    );
        MLJob;
});