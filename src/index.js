import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();
app.use(cors());

const schema = gql`
    type Query {
        users: [User!]
        user(id: ID!): User
        me: User

        messages: [Message!]!
        message(id: ID!):Message!
    }

    type User {
        id: ID!
        username: String!
        messages: [Message!]
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }
`;

let messages = {
    1: {
        id: "1",
        text: "This is going great",
        userId: "1",
        messageIds: [1],
    },
    2: {
        id: "2",
        text: "This is the second message",
        userId: "2",
        messageIds: [2],
    },
}

let users = {
    1: {
        id: "1",
        username: "Jaron King",
        firstname: "jaron",
        lastname: "King",
    },
    2: {
        id: "2",
        username: "Jotham King",
        firstname: "Jotham",
        lastname: "King",
    },
};

const me = users[1];

const resolvers = {
    Query: {
        users: () => {
            return Object.values(users);
        },
        user: (parent, { id }) => {
            return users[id];
        },
        me: (parent, args, { me }) => {
            return me;
        },
        messages: () => {
            return Object.values(messages);
        },
        message: (parent, {id}) => {
            return messages[id];
        },
    },
    Message: {
        user: (parent, args, { me }) => {
            return users[message.userId];
        },
    },
    User: {
        messages: user => {
            return Object.values(messages).filter(
                message => message.userId === user.id,
            )
        }
    },
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1],
    }
});

const startApollo = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
    app.listen({ port: 8000 }, () => {
        console.log("Appolo Server on https://localhost:8000/graphql");
    });
  } catch (error) {
    console.log(error);
  }
}

startApollo();
