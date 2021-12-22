const core = require('@actions/core');
const shell = require('shelljs');
const simpleGit = require('simple-git');

const package = require('./package.json');

const git = simpleGit();

// Action inputs
const PULL_REQUESTS = JSON.parse(core.getInput('pull_requests'));

core.warning(typeof PULL_REQUESTS);
core.warning(PULL_REQUESTS);
