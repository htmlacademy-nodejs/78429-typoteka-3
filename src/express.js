"use strict";

const express = require(`express`);
const proxy = require(`express-http-proxy`);
const dotenv = require(`dotenv`);
const url = require(`url`);
const path = require(`path`);
const commonRoutes = require(`./express/routes/common`);
const articlesRoutes = require(`./express/routes/articles`);
const myRoutes = require(`./express/routes/my`);
dotenv.config({path: path.join(__dirname, `..`, process.env.NODE_ENV === `prod` ? `.env.prod` : `.env`)});

const app = express();

app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);

const apiProxy = proxy(`localhost:${process.env.API_PORT}/`, {
  proxyReqPathResolver: (req) => url.parse(req.baseUrl).path
});

if (process.env.NODE_ENV === `dev`) {
  app.use(`/api/*`, apiProxy);
}

app.use(`/`, commonRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use((req, res) => res.status(404).render(`404`));


app.listen(process.env.CLIENT_PORT, () =>
  console.log(`Сервер запущен на порту: ${process.env.CLIENT_PORT}`)
);
