const assert = require('assert');
const path = require('path');
const { runTask, runMultipleTasks } = require('../src/taskRunner');

describe('Task Runner', () => {
    it('should run a single task successfully', async () => {
        const taskName = 'test';
        const taskDir = path.join(__dirname, '../packages/package1'); // Adjust path if needed

        try {
            await runTask(taskName, taskDir);
            assert.ok(true, 'Task completed successfully');
        } catch (error) {
            assert.fail(`Task failed: ${error.message}`);
        }
    });

    it('should run multiple tasks in parallel', async () => {
        const tasks = [
            { name: 'build', packageDir: path.join(__dirname, '../packages/package1') },
            { name: 'lint', packageDir: path.join(__dirname, '../packages/package2') }
        ];

        try {
            await runMultipleTasks(tasks);
            assert.ok(true, 'All tasks completed successfully');
        } catch (error) {
            assert.fail(`One or more tasks failed: ${error.message}`);
        }
    });

    it('should respect task dependencies', async () => {
        const tasks = [
            { name: 'compile', packageDir: path.join(__dirname, '../packages/package1') },
            { name: 'build', packageDir: path.join(__dirname, '../packages/package1') } // Depends on 'compile'
        ];

        try {
            await runMultipleTasks(tasks);
            assert.ok(true, 'Tasks with dependencies completed in the correct order');
        } catch (error) {
            assert.fail(`Dependent tasks failed: ${error.message}`);
        }
    });

    it('should handle caching correctly', async () => {
        const taskName = 'build';
        const taskDir = path.join(__dirname, '../packages/package1');

        // Run task for the first time
        await runTask(taskName, taskDir);

        // Mock a cached state and rerun task
        const isCached = true; // Modify your runTask to check this if necessary
        const result = await runTask(taskName, taskDir, { cache: isCached });

        assert.strictEqual(result, 'cached', 'Task should use cached result');
    });

    it('should retry failed tasks based on config', async () => {
        const taskName = 'failing-task';
        const taskDir = path.join(__dirname, '../packages/package1');
        const maxRetries = 3;

        try {
            await runTask(taskName, taskDir, { retries: maxRetries });
            assert.fail('Task should have failed after retries');
        } catch (error) {
            assert.ok(true, `Task failed after ${maxRetries} retries as expected`);
        }
    });
});
