"use strict";
const {getRandomInt} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const dotenv = require(`dotenv`);
const path = require(`path`);
const {program} = require(`commander`);
const dayjs = require(`dayjs`);
const dayjsRandom = require(`dayjs-random`);
const plural = require(`plural-ru`);
const log = console.log;
dayjs.extend(dayjsRandom);

dotenv.config({path: path.join(__dirname, `../..`, process.env.NODE_ENV === `prod` ? `.env.prod` : `.env`)});

const getMockData = async (fileName) => {
  const filePath = path.join(`./data/`, fileName);
  try {
    const data = await fs.readFile(filePath, {encoding: `utf-8`});
    return data.split(`\r\n`);
  } catch (err) {
    return log(chalk.red(err));
  }
};

const checkCount = (count) => {
  if (count > 1000) {
    program.error(chalk.red(`Не больше 1000 публикаций`));
  }
};


module.exports = {
  name: `--generate`,
  async run(count) {
    const titles = await getMockData(`titles.txt`);
    const sentences = await getMockData(`sentences.txt`);
    const сategories = await getMockData(`categories.txt`);
    const sentencesForComments = await getMockData(`comments.txt`);

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
      const id = nanoid(count);
      const title = titles[getRandomInt(0, titles.length - 1)];
      const announce = sentences[getRandomInt(0, sentences.length)];
      const fullText = Array.from(Array(5).keys()).reduce(((text) => {
        text += sentences[getRandomInt(0, sentences.length - 1)] + ` `;
        return text;
      }), ``);

      const createdDate = dayjs.between(dayjs().subtract(3, `month`), dayjs()).format(`YYYY-MM-DD hh:mm:ss`);
      const сategory = сategories[getRandomInt(0, сategories.length - 1)];
      const maxComments = 10;
      const comments = Array.from(Array(getRandomInt(1, maxComments)).keys()).map((() => {
        return {
          id: nanoid(count),
          text: sentencesForComments[getRandomInt(0, sentencesForComments.length - 1)]
        };
      }), ``);

      publications.push({
        id,
        title,
        announce,
        fullText,
        createdDate,
        сategory,
        comments
      });
    }

    try {
      await fs.writeFile(`mocks.json`, JSON.stringify(publications));
      log(chalk.green(`Успешно сгенерировано ${count} ${plural(count, `публикация`, `публикации`, `публикаций`)}`));
    } catch (err) {
      program.error(chalk.red(err));
    }
  },
};
