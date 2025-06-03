This project is in early development, and will likely change a lot

# Podcomb

A tool for combining multiple podcast feeds into one!

To run:

- Clone this repository

- Install node modules:
```
pnpm i
```

- Run migrations to create database and tables:
```
pnpm sequelize-cli db:migrate
```

- Start the server:
```
node server.js
```

Note: at this time, users can only be created using the API, and a valid API is required. API keys can be added in the `.env` file -- see `.env.example` for formatting.