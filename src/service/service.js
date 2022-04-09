'use strict';

const express = require(`express`);
const apiRouter = require(`./api-router`);
const bodyParser = require(`body-parser`);
const fs = require(`fs`).promises;
const dotenv = require(`dotenv`);
const path = require(`path`);
const {program} = require(`commander`);
const rootPath = process.cwd();
const packageData = require(`${rootPath}/package.json`);
const dayjs = require(`dayjs`);
const dayjsRandom = require(`dayjs-random`);
const chalk = require(`chalk`);
const plural = require(`plural-ru`);
const {randomInteger} = require(`../helpers/common`);
const log = console.log;
dayjs.extend(dayjsRandom);

dotenv.config({path: path.join(__dirname, `../..`, process.env.NODE_ENV === `prod` ? `.env.prod` : `.env`)});

const app = express();

const getMockData = async (fileName) => {
  const filePath = path.join(`./data/`, fileName);
  try {
    const data = await fs.readFile(filePath, {encoding: `utf-8`});
    return data.split(`\r\n`);
  } catch (err) {
    return program.error(chalk.red(err));
  }
};

const helpText = `
Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл mocks.json
`;

const checkCount = (count) => {
  if (count > 1000) {
    program.error(chalk.red(`Не больше 1000 публикаций`));
  }
};

const generateMock = async (count) => {
  const titles = await getMockData(`titles.txt`);
  const sentences = await getMockData(`sentences.txt`);
  const сategories = await getMockData(`categories.txt`);

  if (/^[0-9]+$/.test(count)) {
    if (count < 1) {
      count = 1;
    } else {
      checkCount(count);
    }
  } else {
    count = 1;
  }

  let publications = [];
  for (let x = 0; x < count; x++) {
    const title = titles[randomInteger(0, titles.length - 1)];
    const announce = sentences[randomInteger(0, sentences.length)];
    const fullText = Array.from(Array(5).keys()).reduce(((text) => {
      text += sentences[randomInteger(0, sentences.length - 1)] + ` `;
      return text;
    }), ``);

    const createdDate = dayjs.between(dayjs().subtract(3, `month`), dayjs()).format(`YYYY-MM-DD hh:mm:ss`);
    const сategory = сategories[randomInteger(0, сategories.length - 1)];

    publications.push({
      title,
      announce,
      fullText,
      createdDate,
      сategory
    });
  }

  try {
    await fs.writeFile(`mock.json`, JSON.stringify(publications));
    log(chalk.green(`Успешно сгенерировано ${count} ${plural(count, `публикация`, `публикации`, `публикаций`)}`));
  } catch (err) {
    program.error(chalk.red(err));
  }
};

program
  .option(`-s, --server [port]`)
  .option(`--version`)
  .option(`--help`)
  .option(`--generate [count]`);


program.parse(process.argv);

const options = program.opts();

if (options.server) {
  const port = process.env.API_PORT;
  app.use(bodyParser.json());
  app.use(`/api`, apiRouter);
  app.listen(port, () =>
    log(chalk.blue(`API сервер запущен на порту: ${port}`))
  );
}


if (options.version) {
  log(chalk.blue(packageData.version));
}

if (options.help) {
  log(chalk.gray(helpText));
}

if (options.generate) {
  generateMock(options.generate);
}
