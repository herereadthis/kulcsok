const core = require('@actions/core');
const shell = require('shelljs');
const simpleGit = require('simple-git');
const semver = require('semver');

const package = require('./package.json');

const git = simpleGit();

// Action inputs

const {version: VERSION} = package;
const RELEASE_BRANCH = core.getInput('release_branch');
const CREATE_PROD_BUILD = core.getInput('create_prod_build') === 'true';

core.setOutput("version", VERSION);