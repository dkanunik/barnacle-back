const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = {
    getData: (req, parameterName) => {
        let objectIds = [];
        let parameterValues = [];

        if (typeof req.query[parameterName] !== 'undefined') {
            try {
                parameterValues = JSON.parse(req.query[parameterName]);
            } catch (syntaxErr) {
                logger.error(syntaxErr);
                throw {error: 'Invalid value for \'' + parameterName + '\' parameter: \'' + syntaxErr.message + '\''};
            }
        }

        for (let objectId of parameterValues) {
            try {
                objectIds.push(mongoose.Types.ObjectId(objectId));
            } catch (err) {
                const errMsg = 'Invalid value for \''+parameterName+'\' parameter: \'' + objectId + '\'';
                logger.error(errMsg);
                throw {error: errMsg};
            }
        }

        return objectIds;
    }
};
