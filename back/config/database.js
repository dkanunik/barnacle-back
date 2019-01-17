const mongoHost = process.env.MONGO_HOST;

module.exports = {
    dbName: 'barnacle',
    dumpFileName: 'barnacle.test.gz',
    url: `mongodb://barnacle:barnacle@${mongoHost}/barnacle`
};
