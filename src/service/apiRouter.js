'use strict';

const {Router} = require(`express`);
const apiRouter = new Router();
const fs = require(`fs`).promises;

apiRouter.get(`/`, (req, res) => res.json(`API`));
apiRouter.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(`mock.json`);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.json([]);
  }
});
module.exports = apiRouter;
