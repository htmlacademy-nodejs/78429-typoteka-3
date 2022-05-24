-- Получить список всех категорий (id, наименование категории);
SELECT
    *
FROM
    categories;

-- Получить список категорий для которых создана минимум 1 публикация (id, наименование категории);
SELECT
    id,
    name
FROM
    categories
    JOIN articles_categories ON id = category_id
GROUP BY
    id;

-- Получить список категорий с количеством публикаций (id, наименование категории, количество публикаций в категории);
SELECT
    id,
    name,
    count(article_id) AS article_count
FROM
    categories
    JOIN articles_categories ON id = category_id
GROUP BY
    id
ORDER BY
    article_count DESC;

-- Получить список публикаций 
--(id публикации, заголовок публикации, анонс публикации, дата публикации, 
-- имя и фамилия автора, контактный email, количество комментариев, наименование категорий). 
-- Сначала свежие публикации;
SELECT
    articles.id,
    articles.title,
    EXTRACT(
        YEAR
        FROM
            articles.created_at
    ),
    users.first_name,
    users.last_name,
    users.email,
    cardinality(array_agg(DISTINCT comments.id)) AS comments_count,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM
    articles
    JOIN articles_categories ON articles.id = articles_categories.article_id
    JOIN categories ON articles_categories.category_id = categories.id
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
GROUP BY
    articles.id,
    users.id
ORDER BY
    articles.created_at DESC;

-- Получить полную информацию определённой публикации (id публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT
    articles.id,
    articles.title,
    articles.announce,
    articles.fullText,
    articles.picture,
    articles.created_at,
    users.first_name,
    users.last_name,
    users.email,
    cardinality(array_agg(DISTINCT comments.id)) AS comments_count,
    string_agg(DISTINCT categories.name, ', ') AS category_list
FROM
    articles
    JOIN articles_categories ON articles.id = articles_categories.article_id
    JOIN categories ON articles_categories.category_id = categories.id
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
WHERE
    articles.id = 2
GROUP BY
    articles.id,
    users.id;

-- Получить список из 5 свежих комментариев (id комментария, id публикации, имя и фамилия автора, текст комментария);
SELECT
    comments.id,
    comments.article_id,
    users.first_name,
    users.last_name,
    comments.text
FROM
    comments
    JOIN users ON users.id = comments.user_id
ORDER BY
    comments.created_at DESC
LIMIT
    5;

-- Получить список комментариев для определённой публикации (id комментария, id публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
    comments.id,
    comments.article_id,
    users.first_name,
    users.last_name,
    comments.text
FROM
    comments
    JOIN users ON users.id = comments.user_id
WHERE
    comments.article_id = 2
ORDER BY
    comments.created_at DESC;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE
    articles
SET
    title = 'Как я встретил Новый год'
WHERE
    id = 1;