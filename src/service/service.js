'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const path = require(`path`);
const rootPath = process.cwd();
const {program} = require(`commander`);
const packageData = require(`${rootPath}/package.json`);
const dayjs = require(`dayjs`);
const dayjsRandom = require(`dayjs-random`);
const chalk = require(`chalk`);
const plural = require(`plural-ru`);
const log = console.log;
dayjs.extend(dayjsRandom);

const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

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

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};


const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(`mock.json`);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
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
  if (typeof options.server === `boolean` && options.server) {
    options.server = 3000;
  }
  const port = options.server;
  http.createServer(onClientConnect)
    .listen(port)
    .on(`listening`, () => {
      console.info(chalk.green(`Ожидаю соединений на ${port}`));
    })
    .on(`error`, (err) => {
      console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
    });
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
