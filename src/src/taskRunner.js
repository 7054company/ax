const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { setCache, getCache } = require('./cache');
const repoxConfig = require('../repox.json');
const { logPerformanceMetrics } = require('./analytics'); // Import analytics functions

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

function getAllPackages() {
    return fs.readdirSync(path.join(__dirname, '../packages')).filter(pkg => fs.statSync(path.join(__dirname, '../packages', pkg)).isDirectory());
}

function runCommand(command, dir) {
    return new Promise((resolve, reject) => {
        const fullCommand = `npm run ${command}`;
        const startTime = Date.now(); // Start time for performance tracking
        exec(fullCommand, { cwd: dir }, (error, stdout, stderr) => {
            const duration = Date.now() - startTime; // Duration of the command
            logPerformanceMetrics(command, dir, duration); // Log performance metrics
            if (error) {
                console.error(`Error executing command in ${dir}: ${error.message}`);
                return reject(error);
            }
            console.log(stdout);
            resolve(stdout);


            if (error) {
                console.error(`Error executing command in ${dir}: ${error.message}`);
                return reject(error);
            }
            console.log(`[${dir}] Command '${command}' completed in ${duration}ms`);
            resolve(stdout);



        });
    });
}






async function runMultipleCommands(commands, filters) {
    const packages = getAllPackages();

    // Check if each command exists in repox.json
    for (const command of commands) {
        if (!repoxConfig.pipeline[command]) {
            console.log(`Command '${command}' not found in repox.json.`);
            return; // Exit if any command is not found in repox.json
        }
    }

    // If filters are provided, filter the packages
    let filteredPackages = packages;
    if (filters && filters.length > 0) {
        filteredPackages = packages.filter(pkg => 
            filters.some(filter => pkg.includes(filter))
        );
    }

    // If no packages match the filters, notify the user
    if (filteredPackages.length === 0) {
        console.log(`No packages found for filters: ${filters.join(', ')}`);
        return;
    }

    console.log(`Running commands '${commands.join(' ')}' for packages: ${filteredPackages.join(', ')}`);

    // Collect tasks to run commands in parallel
    const tasks = [];

    // For each command, create tasks for each package
    for (const command of commands) {
        const shouldparallel = repoxConfig.pipeline[command] && repoxConfig.pipeline[command].parallel !== false;
        
        if (shouldparallel) {
            // Run in parallel
            filteredPackages.forEach(pkg => {
                const packageDir = path.join(__dirname, '../packages', pkg);
                tasks.push(runCommand(command, packageDir));
            });
        } else {
            // Run sequentially
            for (const pkg of filteredPackages) {
                const packageDir = path.join(__dirname, '../packages', pkg);
                tasks.push(runCommand(command, packageDir));
            }
        }
    }

    // Wait for all the tasks to complete (either parallel or sequential)
    await Promise.all(tasks);
}


async function build() {
    console.log('Building all packages...');
    const packages = getAllPackages();
    console.log(`Found packages: ${packages.join(', ')}`);

    await Promise.all(packages.map(pkg => {
        const packageDir = path.join(__dirname, '../packages', pkg);
        console.log(`Running build in ${packageDir}`);

        // Check if there's a cached result
        const cacheKey = `${pkg}-build-output`;
        const cachedResult = getCache(cacheKey);
        if (cachedResult) {
            console.log(`Using cached result for ${pkg}:`, cachedResult);
            return Promise.resolve(); // Skip building if cached
        }

        return runCommand('build', packageDir).then(stdout => {
            // Cache the output after a successful build
            setCache(cacheKey, { output: stdout }); // Save the actual output
            console.log(`Cached build output for ${pkg}:`, stdout); // Log cached output
        });
    }));
}

async function test() {
    console.log('Running tests...');
    const packages = getAllPackages();

    const tasks = packages.map(pkg => {
        const packageJson = require(path.join(__dirname, '../packages', pkg, 'package.json'));
        const dependencies = getDependencies(packageJson);

        return runCommand('test', path.join(__dirname, '../packages', pkg)).catch(err => {
            console.error(`Tests failed for ${pkg}: ${err.message}`);
        });
    });

    await Promise.all(tasks);
}

async function integrate(existingPath) {
    console.log(`Integrating project from: ${existingPath}`);
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

//module.exports = { init, create, integrate, build, test, help, runCommandWithFilter, runMultipleCommands };

module.exports = { init, create, integrate, build, test, help,  runMultipleCommands };
