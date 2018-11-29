const root = require('app-root-path');
const config = require(root + '/back/config/local');
const request = require('request');

const chai = require('chai');
const expect = chai.expect;

const chaiMatchPattern = require('chai-match-pattern');
chai.use(chaiMatchPattern);

describe('feature api tests', () => {
    it('should return an feature by id', (done) => {
        request.get(config.URL_HOST + 'api/features/search/id/5abd060bdfbd3a094d68d57d', (err, res, body) => {
            const expectedFeature = {
                animals: [ ],
                name: "paw",
                id: "5abd060bdfbd3a094d68d57d"
            };
            const actualFeature = JSON.parse(body);

            expect(actualFeature).to.matchPattern(expectedFeature);
            done();
        });
    });


    it('should return an features list', (done) => {
        request.get(config.URL_HOST + 'api/features/search/all', (err, res, body) => {
            const expectedFeatureCount = 12;
            const actualFeatures = JSON.parse(body);

            expect(actualFeatures).to.be.an('array').that.have.lengthOf(expectedFeatureCount);
            done();
        });
    });
});
