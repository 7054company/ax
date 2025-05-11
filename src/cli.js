const { init, create, integrate, build, test, help, runCommandWithFilter, runMultipleCommands } = require('./taskRunner');

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
        case 'run':
            const filter = args.find(arg => arg.startsWith('--filter='));
            const filterValue = filter ? filter.split('=')[1] : null;
            const commands = args.filter(arg => !arg.startsWith('--')); // Filter out options
            runMultipleCommands(commands, filterValue);
            break;
        case 'help':
        default:
            help();
            break;
    }
}

module.exports = { run };
