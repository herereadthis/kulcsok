/*
 * Found here: https://robots.thoughtbot.com/testing-your-style-with-eslint-and-mocha
 * Throw unit test failures when eslint fails.
 */

const glob = require('glob');
const CLIEngine = require('eslint').CLIEngine;
const assert = require('chai').assert;
// const _ = require('lodash');

/**
 * This uses the eslint cache just like we do on the command line version of
 * eslint, but for some reason, if they use the same default cache file location
 * as one another, they don't use the cache created by the other and will run
 * on all files instead. To avoid this conflict, we use a different cache file
 * when running the tests.
 */
const engine = new CLIEngine({
    cache: true,
    cacheLocation: '.eslintcache-tests',
    envs: ['node', 'mocha'],
    useEslintrc: true
});

// get paths to run eslint on (exclusions will be applied by .eslintignore)
const paths = glob.sync('{./test/**/*.js,./src/**/*.js}');
const results = engine.executeOnFiles(paths).results;
const MESSAGE_FILE_IGNORED = 'File ignored because of a matching ignore pattern. Use "--no-ignore" to override.';

// utility for formatting eslint output
// fixme: it seems to drop the last letter in some messages
function formatMessages(messages) {
    const errors = messages.map((message) => {
        return `${message.line}:${message.column} ${message.message.slice(0, -1)} - ${message.ruleId}\n`;
    });

    return `\n${errors.join('')}`;
}

// utility for generating a test for each file
function generateTest(result) {
    const { filePath, messages } = result;

    if (!(messages.length === 1 && messages[0].message === MESSAGE_FILE_IGNORED)) {
        it(`validates ${filePath}`, function() {
            if (messages.length > 0) {
                console.log(messages);
                assert.fail(false, true, formatMessages(messages));
            }
        });
    }
}

describe('ESLint', function() {
    results.forEach((result) => generateTest(result));
});
