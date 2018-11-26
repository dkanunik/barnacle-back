const root = require('app-root-path');
const config = require(root + '/back/config/local');
const request = require('request');

const chai = require('chai');
const expect = chai.expect;

const chaiMatchPattern = require('chai-match-pattern');
chai.use(chaiMatchPattern);

describe('feature api tests', () => {
    xit('should return an feature object by id', (done) => {
        request.get(config.URL_HOST + 'api/features/5abd060bdfbd3a094d68d57d', (err, res, body) => {
            expect(res.statusCode).to.equal(200);
            chai.expect(JSON.parse(body)[0]).to.matchPattern({'_id':'5abd060bdfbd3a094d68d57d','name':'paw'});
            done();
        });
    });
});
