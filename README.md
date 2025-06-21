This project is in early development, and will likely change a lot

# Podcomb

A tool for combining multiple podcast feeds into one!

To run:

- Clone this repository

- Install node modules:
```
yarn
```

- Configure database (see below)

- Start the back end server:
```
node server.js
```

- Start the front end server:
```
cd client
yarn run dev
```

Note: at this time, users can only be created using the API, and a valid API is required. API keys can be added in the `.env` file -- see `.env.example` for formatting.

## Database configuration

### Select database technology

Podcomb can run with a SQLite database or a PostgreSQL database.  To use SQLite:

- In `.env`, set `NODE_ENV` to "sqlite" or "development," or leave it blank (default is "development")
- Sequelize can create a SQLite database for you, so you can skip straight to migrations

To use PostgreSQL:

- First, make sure an available Postgres database is running -- Sequelize will not create a Postgres database for you.

- Note that if you want to use a Postgres database running in Docker, there is an example `docker-compose` config file at `./data/psql.docker-compose.yml`. To start this, run the following:
```
docker volume create podcomb_db
docker compose -f ./data/psql.docker-compose.yml up -d
```
This will start a Postgres database on port 5434 (the port number can be changed by editing the config file).

- In `.env`, set `NODE_ENV` to "postgres" or "production"

- Supply the other necessary Postgres variables in `.env` (see `.env.example` for complete list)

### Create tables with migrations

Once your database is configured, run migrations to create the tables:

```
yarn sequelize-cli db:migrate
```

## API Documentation

### User management

- POST to `/api/auth/register` -- Create user
    - Must include API Key in request headers, as `"api-key"`

- POST to `/api/auth/login` -- Log in (from browser)

- GET to `/api/auth/logout` -- Log out (from browser)

### Comb management

- Note: all comb management routes require a JWT authentication token as a cookie

- POST to `/api/combs/` -- Create comb

- GET to `/api/combs/:combId` -- Get comb data

- PUT to `/api/combs/:combId` -- Update comb

- DELETE to `/api/combs/:combId` -- Delete comb

- GET to `/api/combs/users` -- Get all of logged-in user's combs

- POST to `/api/combs/:combIid/sourcefeeds` -- Add a source feed to comb

- DELETE to `/api/combs/:combId/sourcefeeds/:sourceFeedId` -- Delete a source feed

- GET to `/feeds/:combId` -- Get combined podcast feed as XML (use this address for podcast players)