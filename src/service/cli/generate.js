"use strict";
const {getRandomInt, pickItem} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const dotenv = require(`dotenv`);
const path = require(`path`);
const plural = require(`plural-ru`);
const log = console.log;
const {MockConf} = require(`../../constants`);
const dayjs = require(`dayjs`);
require(`dayjs/locale/ru`);
const dayjsRandom = require(`dayjs-random`);
dayjs.locale(`ru`);
dayjs.extend(dayjsRandom);

dotenv.config({path: path.join(__dirname, `../..`, process.env.NODE_ENV === `prod` ? `.env.prod` : `.env`)});


const getTextData = async (fileName) => {
  const filePath = path.join(`./data/`, fileName);
  try {
    const data = await fs.readFile(filePath, {encoding: `utf-8`});
    return data.split(`\n`);
  } catch (err) {
    return log(chalk.red(err));
  }
};

const checkMockCount = (count) => {
  const {MAX_COUNT} = MockConf;
  return count && Number.isInteger(parseInt(count, 10)) && count <= MAX_COUNT;
};

module.exports = {
  name: `--generate`,
  async run(count) {
    const publications = [];
    const {DEFAULT_COUNT} = MockConf;
    const titles = await getTextData(`titles.txt`);
    const sentences = await getTextData(`sentences.txt`);
    const categories = await getTextData(`categories.txt`);
    const sentencesForComments = await getTextData(`comments.txt`);

    const generatePublication = () => {
      const {MAX_MONTH_DIFF, MAX_SENTENCES, MAX_COMMENTS, DATE_FORMAT, FORMATTED_DATE_FORMAT} = MockConf;
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

      const createdDate = dayjs.between(dayjs().subtract(MAX_MONTH_DIFF, `month`), dayjs()).format(DATE_FORMAT);
      const fotmattedDate = dayjs(createdDate).format(FORMATTED_DATE_FORMAT);
      const category = pickItem(categories);
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
        fotmattedDate,
        category,
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
