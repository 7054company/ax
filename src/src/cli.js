#!/usr/bin/env node

const { init, create, integrate, build, test, help, runMultipleCommands } = require('./taskRunner');

function parseArgs() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    // Collect filters from args
    const filters = [];
    const remainingArgs = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--filter' && args[i + 1]) {
            filters.push(args[i + 1]);
            i++; // Skip the next argument as it's part of --filter
        } else {
            remainingArgs.push(args[i]);
        }
    }

    return { command, args: remainingArgs, filters };
}

function run() {
    const { command, args, filters } = parseArgs();


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
          runMultipleCommands(args, filters); // Pass filter
          
            break;
        case 'help':
        default:
            help();
            break;
    }
}

module.exports = { run };
