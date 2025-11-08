# Rent1T Backend

## Features
- Express.js API (TypeScript)
- REST Auth endpoints: register, login, get users
- GraphQL API (Apollo Server): user CRUD & auth
- MySQL DB with pooling
- JWT Auth (bcrypt passwords)

## Folder Structure
```
backend/
  src/
    config/db.ts         # DB pooling config
    controllers/         # Express controllers
    models/              # TypeScript types/models
    routes/              # REST routers
    graphql/             # Apollo schema/resolvers
    server.ts            # App entrypoint
```

## Setup (Railway/Local)
1. **Clone repo**
2. `cd backend`
3. Install deps: `npm install`
4. Create a `.env`:
```
PORT=5000
MYSQL_URL=your_mysql_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```
5. Run dev: `npm run dev` (uses nodemon+ts-node)

## Deploy to Railway
- Connect to Railway project
- Set env vars: `PORT`, `MYSQL_URL`, `JWT_SECRET`
- Railway Private Network recommended for secure DB

## API Endpoints
### REST
- POST `/api/auth/register` `{ user_name, email, password }`
- POST `/api/auth/login` `{ user_name, password }`
- GET `/api/auth/users`
### GraphQL
- POST `/graphql` (GraphQL Playground enabled)

## MySQL Schema Example
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NULL,
  email VARCHAR(255) UNIQUE,
  google_id VARCHAR(255) UNIQUE,
  role ENUM('tenant','owner','admin') DEFAULT 'tenant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Scripts
- `npm run dev`  # start locally (nodemon)
- `npm start`    # build (tsc) then run dist/

## Google Sign-In (Stateless, JWT)
- Logging in with Google now issues a JWT directly (no cookies or express-session)
- On successful login, Google OAuth callback will redirect to:
  `<FRONTEND_URL>/login-success?token=...` (defaults to `http://localhost:3000` for local dev)
- The frontend `login-success` page reads the token, stores it in localStorage, and redirects to `/` (homepage)
- Required env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `JWT_SECRET`, `FRONTEND_URL` (optional, defaults to localhost:3000)
