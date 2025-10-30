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
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
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
  `https://rent1t.vercel.app/login-success?token=...`
- The frontend should read the token and store it in localStorage for API authentication.
- Only `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, and `JWT_SECRET` env vars needed.
