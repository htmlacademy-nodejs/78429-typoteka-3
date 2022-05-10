"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./articles`);
const {ArticleService, CommentService} = require(`../data-service`);

const mockData = [
  {
    id: `ioOg3T`,
    title: `Как достигнуть успеха не вставая с кресла`,
    createdDate: `2022-2-12 22:17:15`,
    announce:
      `Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    fullText:
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    categories: [`Деревья`],
    comments: [
      {
        id: `fFCdcV`,
        text: `Совсем немного..., Мне кажется или я уже читал это где-то?,`,
      },
      {id: `59scN1`, text: `Согласен с автором!,`},
      {
        id: `iYJ-7C`,
        text: `Совсем немного..., Мне кажется или я уже читал это где-то?,`,
      },
    ],
    photo: `forest@1x.jpg`,
  },
  {
    id: `tE7T0S`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2022-3-5 20:47:41`,
    announce:
      `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    fullText:
      `Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов.`,
    categories: [`IT`, `Разное`, `Без рамки`],
    comments: [
      {
        id: `fZ1O1n`,
        text: `Мне кажется или я уже читал это где-то?, Планируете записать видосик на эту тему? Хочу такую же футболку :-),`,
      },
      {
        id: `6-hE3_`,
        text: `Хочу такую же футболку :-), Мне кажется или я уже читал это где-то?,`,
      },
    ],
    photo: `sea@1x.jpg`,
  },
  {
    id: `ecKDZO`,
    title: `Как собрать камни бесконечности`,
    createdDate: `2022-2-11 11:46:07`,
    announce:
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText:
      `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов.`,
    categories: [`Кино`],
    comments: [
      {
        id: `SaCP-1`,
        text: `Это где ж такие красоты?, Плюсую, но слишком много буквы!,`,
      },
      {
        id: `dE1TxV`,
        text: `Мне кажется или я уже читал это где-то?, Согласен с автором!,`,
      },
    ],
    photo: `forest@1x.jpg`,
  },
  {
    id: `4vRBhT`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2022-2-17 3:23:03`,
    announce:
      `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText:
      `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    categories: [`Кино`, `Программирование`, `Железо`, `Деревья`],
    comments: [
      {
        id: `7ILJsU`,
        text: `Плюсую, но слишком много буквы!, Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
      },
    ],
    photo: `forest@1x.jpg`,
  },
  {
    id: `Pq6x8e`,
    title: `Что такое золотое сечение`,
    createdDate: `2022-1-10 11:21:58`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText:
      `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    categories: [`Разное`, `За жизнь`, `Железо`, `Кино`],
    comments: [
      {id: `Etekd5`, text: `Мне кажется или я уже читал это где-то?,`},
      {
        id: `Y1vpl4`,
        text: `Совсем немного..., Мне не нравится ваш стиль. Ощущение, что вы меня поучаете., Это где ж такие красоты?,`,
      },
      {
        id: `HOGrz-`,
        text: `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!, Хочу такую же футболку :-),`,
      },
      {id: `bNbOht`, text: `Согласен с автором!,`},
    ],
    photo: `sea@1x.jpg`,
  },
  {
    id: `1ETquD`,
    title: `Борьба с прокрастинацией`,
    createdDate: `2022-3-2 0:54:19`,
    announce: ``,
    fullText:
      `Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    categories: [`За жизнь`, `Кино`],
    comments: [
      {
        id: `kjqP9w`,
        text: `Плюсую, но слишком много буквы!, Совсем немного..., Планируете записать видосик на эту тему?`,
      },
      {
        id: `sMGL-C`,
        text: `Планируете записать видосик на эту тему? Хочу такую же футболку :-),`,
      },
      {
        id: `aHHoUM`,
        text: `Мне кажется или я уже читал это где-то?, Совсем немного..., Согласен с автором!,`,
      },
    ],
    photo: `forest@1x.jpg`,
  },
];

const createAPI = () => {
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const app = express();
  app.use(express.json());
  article(app, new ArticleService(cloneData), new CommentService(cloneData));
  return app;
};

const {HttpCode} = require(`../../constants`);

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 6 articles`, () =>
    expect(response.body.length).toBe(6));

  test(`First article's id equals "ioOg3T"`, () =>
    expect(response.body[0].id).toBe(`ioOg3T`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/ioOg3T`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Как достигнуть успеха не вставая с кресла"`, () =>
    expect(response.body.title).toBe(`Как достигнуть успеха не вставая с кресла`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    categories: [`Разное`],
    photo: `forest@1x.jpg`,
    createdDate: `27.01.2022, 10:11:47`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(7)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    categories: [`Разное`],
    photo: `forest@1x.jpg`
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `История страны`,
    announce: `Тот кто не знает истории, обречен ее повторять.`,
    fullText: `В истории страны может быть всякое, и часто она зависит от презедента страны.`,
    categories: [`Разное`],
    photo: `forest@1x.jpg`,
    createdDate: `27.01.2022, 10:11:47`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/tE7T0S`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/tE7T0S`)
      .expect((res) => expect(res.body.title).toBe(`История страны`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `Это"`,
    announce: `Валидный`,
    fullText: `объект`,
    categories: [`объявления`],
    photo: `forest@1x.jpg`,
    createdDate: `27.01.2022, 10:11:47`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    title: `Это"`,
    fullText: `текущего`,
    categories: [`объявления`],
    photo: `forest@1x.jpg,`
  };

  return request(app)
    .put(`/articles/W6m3vr`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/tE7T0S`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () =>
    expect(response.body.id).toBe(`tE7T0S`));

  test(`Articles count is 5 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(5)));
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});


test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/W6m3vr/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
