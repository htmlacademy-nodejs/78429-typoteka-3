"use strict";

const express = require(`express`);
const proxy = require(`express-http-proxy`);
const dotenv = require(`dotenv`);
const url = require(`url`);
const path = require(`path`);
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const TEMPLATES_DIR = `/templates`;
const commonRoutes = require(`./routes/common`);
const articlesRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);
const sequelize = require(`../service/lib/sequelize`);
const session = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const {HttpCode} = require(`./../constants.js`);

const app = express();

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 1800000,
  checkExpirationInterval: 60000,
});

app.use(express.urlencoded({extended: false}));
app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false,
    })
);
sequelize.sync({force: false});
dotenv.config({
  path: path.join(
      __dirname,
      `../..`,
      process.env.NODE_ENV === `prod` ? `.env.prod` : `.env`
  ),
});

const apiProxy = proxy(`localhost:${process.env.API_PORT}/`, {
  proxyReqPathResolver: (req) => url.parse(req.baseUrl).path,
});

if (process.env.NODE_ENV === `dev`) {
  app.use(`/api/*`, apiProxy);
}

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, commonRoutes);

app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.set(`views${__dirname}${TEMPLATES_DIR}`);
app.set(`view engine`, `pug`);

app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));

app.use((err, _req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(process.env.CLIENT_PORT, () =>
  console.log(`Сервер запущен на порту: ${process.env.CLIENT_PORT}`)
);
