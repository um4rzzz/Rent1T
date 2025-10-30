import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import passport from 'passport';
import './config/passport';
import googleAuthRoutes from './routes/authGoogle';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use('/api/auth', googleAuthRoutes);

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  return res.status(500).json({ error: err.message || 'Server Error' });
});

async function startApollo() {
  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();
  apollo.applyMiddleware({ app, path: '/graphql' });
}

startApollo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`GraphQL playground ready at http://localhost:${PORT}/graphql`);
  });
});
