const { exec } = require('child_process');
const root = require('app-root-path');
const database = require(root + '/back/config/database');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';


const dataLoader = {

    restoreDB: () => {
        dataLoader.dropDB();
        dataLoader._execShellCommand(`mongorestore --nsInclude \'${database.dbName}\.*' --gzip --archive=db/${database.dumpFileName}`);
    },

    dropDB: () => {
        dataLoader._execShellCommand(`mongo ${database.dbName} --eval "db.dropDatabase()"`);
    },

    _execShellCommand: (command) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                logger.error(`err: ${err}`);
                return;
            }

            if (stderr) {
                logger.debug(`stderr: ${stderr}`);
                return;
            }

            if (stdout) {
                logger.debug(`info: ${stdout}`);
            }
        });
    }
};

module.exports = dataLoader;
