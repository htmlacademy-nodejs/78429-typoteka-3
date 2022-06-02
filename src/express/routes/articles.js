'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {ensureArray, prepareErrors} = require(`../../utils`);
const uploadMiddleware = require(`../middlewares/upload`);
const {View} = require(`../../constants`);
const articlesRouter = new Router();


const {ARTICLES_PER_PAGE} = View;

const getViewArticleData = async (id) => {
  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true),
  ]);
  const presentCategories = article.categories.map((category) => category.id);
  const categoriesWithCount = categories.filter((category) =>
    presentCategories.includes(category.id)
  );
  return {
    article,
    categories: categoriesWithCount,
  };
};

articlesRouter.get(
    `/category/:id`,
    async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;
      let {page = 1} = req.query;
      page = +page;

      const limit = ARTICLES_PER_PAGE;

      const offset = (page - 1) * ARTICLES_PER_PAGE;

      const [categories, {articles, count}] = await Promise.all([
        api.getCategories(true),
        api.getArticlesByCategoryId({
          offset,
          limit,
          comments: true,
          id
        }),
      ]);

      const categoryExists = categories.filter(
          (category) => category.id === Number(id)
      )[0];

      if (!categoryExists) {
        return res.render(`errors/404`);
      }

      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

      return res.render(`articles-by-category`, {
        user,
        articles,
        page,
        totalPages,
        categories,
        currentCategory: categoryExists,
      });
    }
);
articlesRouter.get(`/add`, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`new-post-empty`, {
    categories,
    user,
    csrfToken: req.csrfToken(),
  });
});
articlesRouter.post(
    `/add`,
    uploadMiddleware.single(`upload`),
    async (req, res) => {
      const {user} = req.session;
      const {body, file} = req;

      const articleData = {
        userId: user.id,
        photo: file ? file.filename : ``,
        title: body.title,
        announce: body.announce,
        fullText: body[`full-text`],
        categories: ensureArray(body.categories),
      };
      try {
        await api.createArticle(articleData);
        res.redirect(302, `/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();
        res.render(`edit-post`, {
          user,
          categories,
          article: articleData,
          validationMessages,
          csrfToken: req.csrfToken(),
        });
      }
    }
);
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]);

  res.render(`edit-post`, {
    article,
    categories,
    id,
    user,
    csrfToken: req.csrfToken(),
  });
});
articlesRouter.post(
    `/edit/:id`,
    uploadMiddleware.single(`upload`),
    async (req, res) => {
      const {user} = req.session;
      const {body, file} = req;
      const {id} = req.params;
      const articleData = {
        userId: user.id,
        photo: file ? file.filename : ``,
        title: body.title,
        announce: body.announce,
        fullText: body[`full-text`],
        categories: ensureArray(body.categories),
      };

      try {
        await api.editArticle(id, articleData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();
        res.render(`edit-post`, {
          user,
          id,
          categories,
          article: articleData,
          validationMessages,
        });
      }
    }
);
articlesRouter.get(`/:id`, async (req, res) => {
  try {
    const {user} = req.session;
    const {id} = req.params;
    const {article, categories} = await getViewArticleData(id);

    res.render(`post-detail`, {
      article,
      categories,
      id,
      user,
      csrfToken: req.csrfToken(),
      previousPage: req.get(`referer`),
    });
  } catch (_err) {
    res.render(`errors/404`);
  }
});

articlesRouter.post(
    `/:id`,
    async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;
      const {comment = ``} = req.body;
      try {
        await api.createComment(id, {userId: user.id, text: comment});
        res.redirect(302, `/articles/${id}`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const {article, categories} = await getViewArticleData(id);
        res.render(`post-detail`, {
          user,
          article,
          categories,
          id,
          validationMessages,
          csrfToken: req.csrfToken(),
        });
      }
    }
);

module.exports = articlesRouter;
