
const { ApolloServer } = require('apollo-server');
const {typeDefs}=require('./graphql/schema');
const {resolvers}=require('./graphql/resolvers');
const mongoose=require('mongoose');
require('dotenv').config();

const MONGODB = process.env.MONGODB_URI;
const port = process.env.PORT;

const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(MONGODB)
.then(()=>{
    console.log("mongodb connected");
    return server.listen({ port });
})
.then ((res)=>{
    console.log(`Server running at ${res.url}`);
})
.catch(err => console.error("MongoDB connection error:", err));