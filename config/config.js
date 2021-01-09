
const lodash = require('lodash');

// module variables
const config = require('./config.json');
const environment = process.env.NODE_ENV || 'development'; //Sets environment from NODE_ENV environment variable, if NODE_ENV is null (unset) defaults to development
console.log(`NODE_ENV: ${process.env.NODE_ENV} => environment: ${environment}`);

const defaultConfig = config.development;
const environmentConfig = config[environment];
const finalConfig = lodash.merge(defaultConfig, environmentConfig);

global.gConfig = finalConfig;

// log global.gConfig
// console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);
