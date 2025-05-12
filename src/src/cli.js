#!/usr/bin/env node

const { init, create, integrate, build, test, help, runMultipleCommands } = require('./taskRunner');

function parseArgs() {
    const command = process.argv[2];
    const args = process.argv.slice(3);
    return { command, args };
}

function run() {
    const { command, args } = parseArgs();

    switch (command) {
        case 'init':
            init();
            break;
        case 'create':
            create(args[0]);
            break;
        case 'integrate':
            integrate(args[0]);
            break;
        case 'build':
            build();
            break;
        case 'test':
            test();
            break;
        case 'run':
            const filter = args.includes('--filter') ? args[args.indexOf('--filter') + 1] : null;
            runMultipleCommands(args.filter(arg => arg !== '--filter' && arg !== filter), filter);
            break;
        case 'help':
        default:
            help();
            break;
    }
}

module.exports = { run };
