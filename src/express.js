"use strict";

const express = require(`express`);
const commonRoutes = require(`../express/routes/common`);
const articlesRoutes = require(`../express/routes/articles`);
const myRoutes = require(`../express/routes/my`);
const DEFAULT_PORT = 8080;

const app = express();

app.use(`/`, commonRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);

app.listen(DEFAULT_PORT, () =>
  console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`)
);
