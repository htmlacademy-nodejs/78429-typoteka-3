"use strict";

const express = require(`express`);
const proxy = require(`express-http-proxy`);
const dotenv = require(`dotenv`);
const url = require(`url`);
const path = require(`path`);
const PUBLIC_DIR = `/public`;
const TEMPLATES_DIR = `/templates`;
const commonRoutes = require(`./routes/common`);
const articlesRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);
let bodyParser = require(`body-parser`);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
dotenv.config({path: path.join(__dirname, `../..`, process.env.NODE_ENV === `prod` ? `.env.prod` : `.env`)});


const apiProxy = proxy(`localhost:${process.env.API_PORT}/`, {
  proxyReqPathResolver: (req) => url.parse(req.baseUrl).path
});

if (process.env.NODE_ENV === `dev`) {
  app.use(`/api/*`, apiProxy);
}

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, commonRoutes);

app.use(express.static(__dirname + PUBLIC_DIR));
app.set(`views`, (__dirname + TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use((req, res) => res.status(404).render(`404`));

console.info(process.env.CLIENT_PORT);

app.listen(process.env.CLIENT_PORT, () =>
  console.log(`Сервер запущен на порту: ${process.env.CLIENT_PORT}`)
);
