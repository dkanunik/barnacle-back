/*eslint-disable */
let fs = require('fs');
let path = require('path');

module.exports = {
	getTestData: testId => {
		if (testId === undefined) {
			throw new Error('You have to define [testId] parameter');
		}
		let jsonPath = path.join(__apiTestsDir, 'testdata', testId);
		let jsonString = fs.readFileSync(jsonPath, UTF8);
		return JSON.parse(jsonString);
	}
};
