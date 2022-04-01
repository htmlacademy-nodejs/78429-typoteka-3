"use strict";

const express = require(`express`);
const commonRoutes = require(`./express/routes/common`);
const articlesRoutes = require(`./express/routes/articles`);
const myRoutes = require(`./express/routes/my`);
const DEFAULT_PORT = 8080;

const app = express();

app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);

app.use(`/`, commonRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use((req, res) => res.status(404).render(`404`));


app.listen(DEFAULT_PORT, () =>
  console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`)
);
