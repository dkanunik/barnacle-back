const root = require('app-root-path');
const config = require(root + '/back/config/local');
const dataLoader = require(root + '/back/tests/api/lib/dataLoader');
const request = require('request');

const chai = require('chai');
const expect = chai.expect;

const chaiMatchPattern = require('chai-match-pattern');
chai.use(chaiMatchPattern);
const _ = chaiMatchPattern.getLodashModule();

describe('animal api tests', () => {

    beforeEach((done) => {
        dataLoader.restoreDB();
        setTimeout(done, 1000);
    });

    it('should return an animal by id', (done) => {
        request.get(config.URL_HOST + 'api/animals/search/id/5ae2f89adb2a9d175298a501', (err, res, body) => {
            const expectedAnimal = {
                id: '5ae2f89adb2a9d175298a501',
                name: 'Cat',
                features: [
                    '5abd060bdfbd3a094d68d57d',
                    '5abd0628dfbd3a094d68d57e',
                    '5abd063fdfbd3a094d68d57f',
                    '5abd0676dfbd3a094d68d581',
                    '5abd0689dfbd3a094d68d582'
                ],
                images: [_.isUrl]
            };
            const actualAnimal = JSON.parse(body);

            expect(actualAnimal).to.matchPattern(expectedAnimal);
            done();
        });
    });

    it('should return an animal list', (done) => {
            request.get(config.URL_HOST + 'api/animals/search/all', (err, res, body) => {
            const expectedAnimalCount = 3;
            const actualAnimals = JSON.parse(body);

            expect(actualAnimals).to.be.an('array').that.have.lengthOf(expectedAnimalCount);
            done();
        });
    });

    it('should return a new animal', (done) => {
        const inputData = {
            features: [
                '5abd060bdfbd3a094d68d57d',
                '5abd0697dfbd3a094d68d583'
            ],
            images: [
                'https://en.wikipedia.org/wiki/testImg.gif'
            ],
            name: 'testAnimal'
        };

        const expectedData = {
            features: [
                '5abd060bdfbd3a094d68d57d',
                '5abd0697dfbd3a094d68d583'
            ],
            images: [
                'https://en.wikipedia.org/wiki/testImg.gif'
            ],
            name: 'testAnimal',
            id: /^(\d|\w){24}/
        };

        request.put({url: config.URL_HOST + 'api/animals/create', form: inputData}, (err, res, body) => {
            const actualAnimal = JSON.parse(body);

            expect(actualAnimal).to.matchPattern(expectedData);
            done();
        });
    });

    it('should return an updated animal', (done) => {
        const inputData = {
            features: [
                '5abd0697dfbd3a094d68d583'
            ],
            images: [
                'https://en.wikipedia.org/wiki/testImg.gif'
            ],
            name: 'updatedAnimal',
            id: '5ae2f89adb2a9d175298a501'
        };

        request.post({url: config.URL_HOST + 'api/animals/edit', form: inputData}, (err, res, body) => {
            const actualAnimal = JSON.parse(body);
            expect(actualAnimal).to.matchPattern(inputData);
            done();
        });
    });

    it.only('should delete an animal and return a relevant message', (done) => {
        request.delete(config.URL_HOST + 'api/animals/delete/5ae2f89adb2a9d175298a501', (err, res, body) => {
            const responce = JSON.parse(body);
            expect(responce).to.matchPattern({ message: 'Success', id: '5ae2f89adb2a9d175298a501' });
            done();
        });
    });
});
