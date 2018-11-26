const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const Animal = require('../models/AnimalModel');
const requestParser = require('../transport/requestParser');

module.exports = {

    getAllAnimals: (res) => {
        Animal.find((err, animals) => {
            if (err) {
                res.send(err);
                logger.error(err);
                return;
            }
            res.json(animals);
            logger.debug('animals: ' + animals);
        });
    },

    getAnimalById: (req, res) => {
        const query = {'_id': req.params.animalId};

        Animal.findOne(query).exec((err, animal) => {
            if (err) {
                res.send({error: err.message});
                logger.error(err);
                return;
            }

            res.json(animal);
            logger.debug('an animal by id: ' + JSON.stringify(animal));
        });
    },

    getAnimalWithPopulatedFeaturesById: (req, res) => {
        const query = {'_id': req.params.animalId};

        Animal.findOne(query).populate('features').exec((err, animal) => {
            if (err) {
                res.send({error: err.message});
                logger.error(err);
                return;
            }

            res.json(animal);
            logger.debug('an animal by id: ' + JSON.stringify(animal));
        });
    },

    getAnimalsByFeatures: (req, res) => {
        let includeFeatureIdObjects = [];
        let excludeFeatureIdObjects = [];

        try {
            includeFeatureIdObjects = requestParser.getData(req, 'includeFeatures');
            excludeFeatureIdObjects = requestParser.getData(req, 'excludeFeatures');
        } catch (err) {
            res.json([err]);
            return;
        }

        if ((includeFeatureIdObjects.length === 0) && (excludeFeatureIdObjects.length === 0)) {
            const errMsg = 'getAnimalsByFeatures() has been called w/o parameters';
            logger.error(errMsg);
            res.json([{error: errMsg}]);
            return;
        }

        let query = Animal
            .find()
            .select('name');

        let andOperator = [];

        if (includeFeatureIdObjects.length > 0) {
            andOperator.push({
                'features': {
                    $all: includeFeatureIdObjects
                }
            });
        }

        andOperator.push({
            'features': {
                $nin: excludeFeatureIdObjects
            }
        });

        query.and(andOperator);

        Animal.find(query).exec((err, animals) => {
            if (err) {
                res.send(err);
                logger.error(err);
                return;
            }
            res.json(animals);
            logger.debug('animals by feature: ' + JSON.stringify(animals));
        });
    },

    createAnimal: (req, res) => {
        Animal.create(req.body, (err, animal) => {
            if (err) {
                res.send(err);
                logger.error(err);
                return;
            }
            res.json(animal);
            logger.debug('a new animal has been created: ' + JSON.stringify(animal));
        });
    },

    editAnimal: (req, res) => {
        const query = {
            '_id': req.body.id
        };

        Animal.findOneAndUpdate(
            query,
            {$set: req.body},
            {new: true},
            (err, animal) => {
                if (err) {
                    res.send(err);
                    logger.error(err);
                    return;
                }
                res.json(animal);
                logger.debug('the animal has been updated: ' + JSON.stringify(animal));
            });
    },

    deleteAnimal: (req, res) => {
        const query = {'_id': req.params.animalId};

        Animal.remove(query, (err) => {
            if (err) {
                res.send(err);
                logger.error(err);
                return;
            }
            res.json({
                message: 'Success',
                id: req.params.animalId
            });
            logger.debug('the animal has been deleted: ' + req.params.animalId);
        });
    }
};
