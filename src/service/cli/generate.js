"use strict";
const {getRandomInt, pickItem} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const dotenv = require(`dotenv`);
const path = require(`path`);
const dayjs = require(`dayjs`);
const dayjsRandom = require(`dayjs-random`);
const plural = require(`plural-ru`);
const log = console.log;
const {MockConf} = require(`../../constants`);
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

const checkMockCount = (count) => {
  const {MOCK_MAX_COUNT} = MockConf;
  return count && Number.isInteger(count) && count <= MOCK_MAX_COUNT;
};

module.exports = {
  name: `--generate`,
  async run(count) {
    const publications = [];
    const {DEFAULT_COUNT} = MockConf;
    const titles = await getMockData(`titles.txt`);
    const sentences = await getMockData(`sentences.txt`);
    const сategories = await getMockData(`categories.txt`);
    const sentencesForComments = await getMockData(`comments.txt`);

    const generatePublication = () => {
      const {MAX_MOUNTH_DIFF, MAX_SENTENCES, MAX_COMMENTS, DATE_FORMAT} = MockConf;
      const id = nanoid(count);
      const title = pickItem(titles);
      const announce = pickItem(sentences);
      const fullText = Array.from({length: getRandomInt(1, MAX_SENTENCES)})
        .fill(``)
        .map(((text) => {
          text += pickItem(sentences);
          return text;
        }))
        .join(` `);

      const createdDate = dayjs.between(dayjs().subtract(MAX_MOUNTH_DIFF, `month`), dayjs()).format(DATE_FORMAT);
      const сategory = pickItem(сategories);
      const comments = Array.from({length: getRandomInt(1, MAX_COMMENTS)})
        .map((() => {
          return {
            id: nanoid(count),
            text: pickItem(sentencesForComments)
          };
        }));

      publications.push({
        id,
        title,
        announce,
        fullText,
        createdDate,
        сategory,
        comments
      });
    };

    if (checkMockCount(count)) {
      if (count <= 0) {
        count = DEFAULT_COUNT;
      }
      Array.from({length: count}, () => generatePublication());
      try {
        await fs.writeFile(`mocks.json`, JSON.stringify(publications));
        log(chalk.green(`Успешно сгенерировано ${count} ${plural(count, `публикация`, `публикации`, `публикаций`)}`));
      } catch (err) {
        log(chalk.red(err));
      }
    } else {
      log(chalk.red(`Ошибка валидации count`));
    }
  },
};
