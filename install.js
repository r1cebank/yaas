/**
 * install.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

var fs          = require('fs.extra');
var inquirer    = require("inquirer");
var shell       = require('shelljs');
var crypto      = require('crypto');
var jsonfile    = require('jsonfile');

function moveFile() {
    // Move final folder to root
}

var question = [
    {
        type: 'confirm',
        name: 'startnow',
        default: false,
        message: 'do you want to start server with default settings?'
    }
];

var configurations = [
    {
        type: 'confirm',
        message: 'do you want us to generate HMAC key for you?',
        default: true,
        name: 'generateHMAC'
    },
    {
        type: 'input',
        message: 'please input your HMAC key:',
        name: 'HMAC',
        when: function (answers) {
            return answers.generateHMAC == false;
        }
    },
    {
        type: 'list',
        name: 'auth',
        message: 'which auth method do you want to use?',
        default: 'local',
        choices: ['local', 'none']
    },
    {
        type: 'confirm',
        message: 'do you want us to generate a apikey for you?',
        name: 'generateAPIKey',
        default: true,
        when: function (answers) {
            return answers.auth == 'local';
        }
    },
    {
        type: 'input',
        message: 'please input your default apikey:',
        name: 'apikey',
        when: function (answers) {
            return answers.generateAPIKey == false;
        }
    },
    {
        type: 'checkbox',
        message: 'please select the roles for default apikey:',
        name: 'roles',
        choices: [
            {
                name: 'bucket:list'
            },
            {
                name: 'bucket:upload'
            },
            {
                name: 'file:list'
            },
            {
                name: 'file:get'
            },
            {
                name: 'version:list'
            },
            {
                name: 'generator:lorem'
            },
            {
                name: 'generator:json'
            },
            {
                name: 'generator:xml'
            }
        ],
        when: function (answers) {
            return answers.auth == 'local';
        }

    },
    {
        type: 'checkbox',
        message: 'select any roles you want to skip authentication',
        name: 'overwrites',
        choices: [
            {
                name: 'bucket:list'
            },
            {
                name: 'bucket:upload'
            },
            {
                name: 'file:list'
            },
            {
                name: 'file:get'
            },
            {
                name: 'version:list'
            },
            {
                name: 'generator:lorem'
            },
            {
                name: 'generator:json'
            },
            {
                name: 'generator:xml'
            }
        ],
        when: function (answers) {
            return answers.auth == 'local';
        }

    },
    {
        type: 'input',
        name: 'concurrency',
        message: 'please choose # of concurrent task can run in background:',
        validate: function (value) {
            if(value.match(/[0-9]+/)) {
                return true;
            } else {return 'please input number only';}
        }
    },
    {
        type: 'list',
        name: 'loglevel',
        message: 'what log level you want to use (verbose = everything)?',
        default: 'error',
        choices: ['error', 'debug', 'info', 'verbose']
    },
    {
        type: 'input',
        name: 'database',
        default: 'db/',
        message: 'where do you want to store file database?'
    },
    {
        type: 'input',
        name: 'dest',
        default: 'dest/',
        message: 'where do you want to store upload files?'
    },
    {
        type: 'input',
        name: 'processed',
        default: 'processed/',
        message: 'where do you want to store processed files?'
    },
    {
        type: 'confirm',
        name: 'relative',
        default: true,
        message: 'is the file path relative to server root?'
    },
    {
        type: 'input',
        name: 'max',
        message: 'please choose max # of objects user can generate at a time:',
        validate: function (value) {
            if(value.match(/[0-9]+/)) {
                return true;
            } else {return 'please input number only';}
        }
    },
    {
        type: 'input',
        name: 'redis_host',
        default: '127.0.0.1',
        message: 'where is your redis server:'
    },
    {
        type: 'input',
        name: 'redis_port',
        default: 6379,
        message: 'what is the port for your redis server:',
    },
    {
        type: 'confirm',
        name: 'autoclean',
        default: false,
        message: 'do you want to delete completed tasks after they are completed?'
    },
    {
        type: 'input',
        name: 'port',
        message: 'which port do you want yaas to run on?',
        validate: function (value) {
            if(value.match(/[0-9]+/)) {
                return true;
            } else {return 'please input number only';}
        }
    }

];

inquirer.prompt(question, function(answer) {
    if(answer.startnow) {
        console.log("WARNING: running yaas in default settings.");
        shell.exec('npm run afterinstall');
    } else {
        inquirer.prompt(configurations, function(answers) {
            if(answers.generateHMAC) {
                answers.HMAC = crypto.randomBytes(20).toString('hex');
            }
            if(answers.generateAPIKey) {
                answers.apikey = crypto.randomBytes(20).toString('hex');
            }
            var config = {
                HMACSecret: answers.HMAC,
                concurrency: answers.concurrency,
                generator: {
                    max: answers.max
                },
                loglevel: answers.loglevel,
                redis: {
                    host: answers.redis_host,
                    port: answer.redis_port
                },
                server: {
                    autoclean: false,
                    port: 3939,
                    port_ssl: 33939,
                    storage: {
                        database: answers.database,
                        dest: answers.dest,
                        processed: answers.processed,
                        relative: answers.relative
                    },
                    ui: {
                        apiURL: "/api",
                        baseURL: "/kue",
                        updateInterval: 2000
                    }
                }
            };
            config.auth = {
                type: answers.auth
            };
            if(config.auth.type == 'local') {
                config.auth.keys = { };
                config.auth.keys[answers.apikey] = { };
                config.auth.keys[answers.apikey].roles = [ ];
                for (var role of answers.roles) {
                    config.auth.keys[answers.apikey].roles.push(role);
                }
                var overwrites = { };
                for(var role of answers.overwrites) {
                    overwrites[role] = 'none';
                }
            }
            config.auth.overwrites = overwrites;
            jsonfile.writeFileSync('./lib/config/config.json', config, {spaces: 4});
            console.log("Configuration Complete");
            console.log("your apikey is:", answers.apikey);
            inquirer.prompt([{type: 'confirm', name:'run', default: true,
                message: 'ready to launch yaas?'}], function(answer) {
                if(answer.run) {
                    console.log('starting yaas....');
                    shell.exec('npm run afterinstall');
                } else {
                    console.log("you can re-configure by reinstalling [npm i yaas]");
                }
            });
        });
        //  Ask more questions
    }
});