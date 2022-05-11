'use strict';

const {Cli} = require(`./cli`);
const dotenv = require(`dotenv`);
const path = require(`path`);
const {program} = require(`commander`);
const dayjs = require(`dayjs`);
const dayjsRandom = require(`dayjs-random`);

dayjs.extend(dayjsRandom);

dotenv.config({path: path.join(__dirname, `../..`, process.env.NODE_ENV === `prod` ? `.env.prod` : `.env`)});

program
  .option(`-s, --server [port]`)
  .option(`--version`)
  .option(`--help`)
  .option(`--generate [count]`);
program.parse(process.argv);

const options = program.opts();

if (options.server) {
  Cli[`--server`].run(process.env.API_PORT);
}

if (options.version) {
  Cli[`--version`].run();
}

if (options.help) {
  Cli[`--help`].run();
}

if (options.generate) {
  Cli[`--generate`].run(options.generate);
}
