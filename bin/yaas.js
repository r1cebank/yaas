#!/usr/bin/env node
const program = require('commander');

const pkg = require('../package.json');

program
    .description(pkg.description)
    .version(pkg.version, '-v, --version')
    .arguments('<cmd> [env]')
    .parse(process.argv);
