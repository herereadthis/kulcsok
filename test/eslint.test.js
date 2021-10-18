/*
 * inspired by: 
* https://robots.thoughtbot.com/testing-your-style-with-eslint-and-mocha
 * Throw unit test failures when eslint fails.
 */
const {ESLint} = require('eslint');
const {assert} = require('chai');

const MESSAGE_FILE_IGNORED = 'File ignored because of a matching ignore pattern. Use "--no-ignore" to override.';

/**
 * utility for formatting eslint output
 * 
 * @todo it seems to drop the last letter in some messages
 * @param {string} messages - the stuff to format
 * @returns {string} errors - what went wrong
 */
function formatMessages(messages) {
    const errors = messages.map((message) => {
        return `${message.line}:${message.column} ${message.message.slice(0, -1)} - ${message.ruleId}\n`;
    });

    return `\n${errors.join('')}`;
}

/**
 * utility for generating a test for each file
 * 
 * @param {object} result - what
 */
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

(async function main() {
    const eslint = new ESLint();

    const results = await eslint.lintFiles(['./test/**/*.js', './src/**/*.js']);

    describe('ESLint', function() {
        results.forEach((result) => generateTest(result));
    });
})().catch((error) => {
    process.exitCode = 1;
    console.error(error);
});