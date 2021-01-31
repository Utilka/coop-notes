const lodash = require('lodash');
var fs = require("fs");

function read_config() {
    const config = require('./config.json');
    // module variables
    const environment = process.env.NODE_ENV || 'development'; //Sets environment from NODE_ENV environment variable, if NODE_ENV is null (unset) defaults to development
    console.log(`NODE_ENV: ${process.env.NODE_ENV} => environment: ${environment}`);

    const defaultConfig = config.development;
    const environmentConfig = config[environment];
    const finalConfig = lodash.merge(defaultConfig, environmentConfig);

    global.gConfig = finalConfig
}


function checkFileExistsSync(filepath) {
    let flag = true;
    try {
        fs.accessSync(filepath, fs.constants.F_OK);
    } catch (e) {
        flag = false;
    }
    return flag;
}

if (!checkFileExistsSync('./config/config.json')) {
    console.log("re")
    console.log('config.json does not exist, creating');
    fs.writeFileSync('./config/config.json',
        `{
"development": {
    "config_id": "development",
    "app_name": "Coop Notes",
    "app_desc": "Local service that provides cooperative canvas for notes",
    "node_port": 5000,
    "json_indentation": 4,
    "database_file_path": "./db_data/main.sqlite3",
    "create_sample_data": true
},
"testing": {
    "config_id": "testing",
    "database_file_path": "./db_data/test.sqlite3"
},
"staging": {
    "config_id": "staging",
    "node_port": 8080,
    "database": "my-app-db-stag"
},
"production": {
    "config_id": "production",
    "node_port": 8080,
    "database": "my-app-db-prod"
}
}`)

    console.log('created config.json');
    read_config()
} else {
    read_config()
}


// log global.gConfig
// console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);
