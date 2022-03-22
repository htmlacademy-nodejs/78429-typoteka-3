'use strict';

const fs = require(`fs`).promises;
const rootPath = process.cwd();
const {program} = require(`commander`);
const packageData = require(`${rootPath}/package.json`);
const dayjs = require(`dayjs`);
const dayjsRandom = require(`dayjs-random`);
const chalk = require(`chalk`);
const log = console.log;
const plural = require(`plural-ru`);

dayjs.extend(dayjsRandom);

const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const titles = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const announces = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const сategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const helpText = `
Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл mocks.json
`;


const generateMock = async (count) => {
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
    const title = titles[randomInteger(0, titles.length)];
    const announce = announces[randomInteger(0, announces.length)];
    const fullText = Array.from(Array(5).keys()).reduce(((text) => {
      text += announces[randomInteger(0, announces.length)] + ` `;
      return text;
    }), ``);

    const createdDate = dayjs.between(dayjs().subtract(3, `month`), dayjs()).format(`YYYY-MM-DD hh:mm:ss`);
    const сategory = сategories[randomInteger(0, сategories.length)];

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
  .option(`--version`)
  .option(`--help`)
  .option(`--generate [count]`);

program.parse(process.argv);

const options = program.opts();

if (options.version) {
  log(chalk.blue(packageData.version));
}

if (options.help) {
  log(chalk.gray(helpText));
}

const checkCount = (count) => {
  if (count > 1000) {
    program.error(chalk.red(`Не больше 1000 публикаций`));
  }
};

if (options.generate) {
  generateMock(options.generate);
}
