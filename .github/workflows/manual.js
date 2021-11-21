const chalk = require('chalk');
const shell = require('shelljs');


shell.config.verbose = true;
const versionNumber = process.argv[2];
// const childPackages = ['./meteor-db', './meteor-scripts', './meteor-server', './meteor-ui', './scripts'];

console.log(`Version number is: ${versionNumber}`);
console.log('hello can you read this line?');