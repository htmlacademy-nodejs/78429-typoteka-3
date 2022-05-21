DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles_categories;
CREATE TABLE roles(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(10) NOT NULL
);
ALTER TABLE roles OWNER TO academy;
CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar(250) UNIQUE NOT NULL,
    password_hash varchar(250) NOT NULL,
    first_name varchar(250) NOT NULL,
    last_name varchar(250) NOT NULL,
    avatar varchar(50) NOT NULL,
    role_id integer NOT NULL DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE
    SET DEFAULT ON UPDATE
    SET DEFAULT
);
ALTER TABLE users OWNER TO academy;
CREATE TABLE categories(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(30) NOT NULL
);
ALTER TABLE categories OWNER TO academy;
CREATE TABLE articles(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer NOT NULL,
    title varchar(250) NOT NULL,
    announce varchar(250) NOT NULL,
    fulltext varchar(1000) NOT NULL,
    picture varchar(50) NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE articles OWNER TO academy;
CREATE TABLE comments(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer NOT NULL,
    article_id integer NOT NULL,
    text text NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE comments OWNER TO academy;
CREATE TABLE articles_categories(
    article_id integer NOT NULL,
    category_id integer NOT NULL,
    PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE articles_categories OWNER TO academy;
CREATE INDEX ON articles(title);