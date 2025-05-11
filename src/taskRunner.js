const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { setCache, getCache } = require('./cache');
const repoxConfig = require('../repox.json'); // Import the configuration file

function init() {
    console.log('Initializing the project...');
}

function create(packageName) {
    if (!packageName) {
        console.log('Please provide a package name.');
        return;
    }
    console.log(`Creating package: ${packageName}`);
    const packageDir = path.join(__dirname, '../packages', packageName);
    if (!fs.existsSync(packageDir)) {
        fs.mkdirSync(packageDir);
        fs.writeFileSync(path.join(packageDir, 'index.js'), `// Entry file for ${packageName}\nconsole.log('Hello from ${packageName}!');`);
        fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify({ name: packageName, version: '1.0.0', main: 'index.js', scripts: { test: 'echo "Running tests for ${packageName}" && exit 0' } }, null, 2));
        fs.writeFileSync(path.join(packageDir, 'README.md'), `# ${packageName}\n\nThis package is part of the RepoX monorepo.`);
        console.log(`Package ${packageName} created successfully.`);
    } else {
        console.log(`Package ${packageName} already exists.`);
    }
}

function getDependencies(packageJson) {
    return packageJson.dependencies || {};
}

function getAllPackages() {
    return fs.readdirSync(path.join(__dirname, '../packages')).filter(pkg => fs.statSync(path.join(__dirname, '../packages', pkg)).isDirectory());
}

function runCommand(command, dir) {
    return new Promise((resolve, reject) => {
        const fullCommand = `npm run ${command}`;
        exec(fullCommand, { cwd: dir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command in ${dir}: ${error.message}`);
                return reject(error);
            }
            console.log(stdout);
            resolve();
        });
    });
}

async function runMultipleCommands(commands, filter) {
    const packages = getAllPackages();

    const tasks = commands.map(command => {
        return runCommandWithFilter(command, filter);
    });

    // Run the commands in parallel
    await Promise.all(tasks);
}

async function runCommandWithFilter(command, filter) {
    const packages = getAllPackages();
    
    // Validate the command exists in the configuration
    if (!repoxConfig.pipeline[command]) {
        console.log(`Command '${command}' not found in repox.json.`);
        return;
    }

    // Parse filter criteria
    const filteredPackages = filter ? packages.filter(pkg => pkg.includes(filter)) : packages;

    if (filteredPackages.length === 0) {
        console.log(`No packages found for filter: ${filter}`);
        return;
    }

    console.log(`Running command '${command}' for packages: ${filteredPackages.join(', ')}`);

    // Run the command for each filtered package
    await Promise.all(filteredPackages.map(pkg => {
        const packageDir = path.join(__dirname, '../packages', pkg);
        
        // Read the package.json to get dependencies if needed
        const packageJsonPath = path.join(packageDir, 'package.json');
        const packageJson = fs.existsSync(packageJsonPath) ? require(packageJsonPath) : {};
        
        // Execute the command
        return runCommand(command, packageDir);
    }));
}

async function build() {
    console.log('Building all packages...');
    const packages = getAllPackages();

    await Promise.all(packages.map(pkg => {
        return runCommand('npm run build', path.join(__dirname, '../packages', pkg));
    }));
}

async function test() {
    console.log('Running tests...');
    const packages = getAllPackages();

    const tasks = packages.map(pkg => {
        const packageJson = require(path.join(__dirname, '../packages', pkg, 'package.json'));
        const dependencies = getDependencies(packageJson);

        return runCommand('npm test', path.join(__dirname, '../packages', pkg)).catch(err => {
            console.error(`Tests failed for ${pkg}: ${err.message}`);
        });
    });

    await Promise.all(tasks);
}

async function integrate(existingPath) {
    console.log(`Integrating project from: ${existingPath}`);
    // Logic to integrate an existing project
}

function help() {
    console.log(`
RepoX - Monorepo Management Tool

Usage: repox [command]

Commands:
  init                          Initialize a new RepoX project.
  create <package-name>        Create a new package within the monorepo.
  integrate <path>             Integrate an existing project into the monorepo.
  build                         Build all packages in the monorepo.
  test                          Run tests across all packages.
  run <command> [--filter=<filter>]   Run a command for specific packages.
  help                          Display this help message.

Filtering:
  Use the --filter option to run commands for packages that match the filter.
  Example:
    npx repox run build --filter=utils

Configuration:
  The commands can be defined in a repox.json file at the root of your project.
  
Examples:
  Initialize a new project:
    npx repox init

  Create a new package called "utils":
    npx repox create utils

  Integrate an existing project:
    npx repox integrate path/to/existing-project

  Build all packages:
    npx repox build

  Run tests across all packages:
    npx repox test

  Run a command for packages that match a filter:
    npx repox run build --filter=utils

  For more information on a specific command, run:
    npx repox <command> --help
    `);
}

module.exports = { init, create, integrate, build, test, help, runCommandWithFilter, runMultipleCommands };
