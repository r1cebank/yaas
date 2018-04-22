#!/usr/bin/env node
const express = require('express');
const program = require('commander');

const {
    createLogger,
    format,
    transports
} = require('winston');

const pkg = require('../package.json');
const yaas = require('../src');

/**
 * Logging frameworks
 */

const { combine, timestamp, label, printf } = format;
const logFormatting = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});
const logger = createLogger({
    format: combine(
        label({ label: 'yaas' }),
        timestamp(),
        logFormatting
    ),
    transports: [
        // Additional transports
        // new transports.File({ filename: 'app.log' })
        new transports.Console()
    ]
});

program
    .description(pkg.description)
    .version(pkg.version, '-v, --version')
    .option('-p, --port <port>', 'Port number yaas will run on', parseInt)
    .parse(process.argv);

const app = express();
const yaasServer = new yaas();

// Hookup yaas server middleware
logger.info('Registered the following routes:');
yaasServer.bindDefault(app, express.Router());

app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        logger.info(`${Object.keys(r.route.methods).join(', ').toUpperCase()}\t${r.route.path}`);
    }
});

app.listen(program.port || 3939, () => logger.info(`Yaas is listening on port ${program.port || 3939}!`));
