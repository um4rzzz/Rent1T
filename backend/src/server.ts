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
const PORT = parseInt(process.env.PORT || '5001', 10);

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', googleAuthRoutes);

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  return res.status(500).json({ error: err.message || 'Server Error' });
});

async function startApollo() {
  try {
    const apollo = new ApolloServer({ typeDefs, resolvers });
    await apollo.start();
    apollo.applyMiddleware({ app, path: '/graphql' });
    console.log(`✅ GraphQL playground ready at http://localhost:${PORT}/graphql`);
  } catch (error) {
    console.error('⚠️  Failed to start Apollo Server:', error);
    console.error('⚠️  Server will continue without GraphQL endpoint');
  }
}

// Start server regardless of Apollo status
// This ensures the REST API endpoints (like /api/auth/google) are always available
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 REST API available at http://0.0.0.0:${PORT}/api`);
  console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🔐 Google OAuth: http://0.0.0.0:${PORT}/api/auth/google`);
  
  // Start Apollo in the background (non-blocking)
  startApollo().catch((error) => {
    console.error('Failed to initialize Apollo Server:', error);
  });
});
