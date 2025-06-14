This project is in early development, and will likely change a lot

# Podcomb

A tool for combining multiple podcast feeds into one!

To run:

- Clone this repository

- Install node modules:
```
pnpm i
```

- Configure database (see below)

- Start the back end server:
```
node server.js
```

- Start the front end server:
```
cd client
pnpm run dev
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
pnpm sequelize-cli db:migrate
```