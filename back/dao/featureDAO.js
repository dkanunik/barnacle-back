const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const Feature = require('../models/FeatureModel');
const Animal = require('../models/AnimalModel');
const requestParser = require('../transport/requestParser');

module.exports = {

    getAllFeatures: (res) => {
        Feature.find((err, features) => {
            if (err)
                res.send(err);
            res.json(features);
            logger.debug('features : ' + features);
        });
    },

    getFeatureById: (req, res) => {
        let featureId;

        try {
            featureId = mongoose.Types.ObjectId(req.params.featureId);
        } catch (err) {
            res.json([]);
            logger.error('feature by id : ' + req.params.featureId);
            return;
        }

        const query = {'_id': featureId};

        Feature.findOne(query).populate('animals').exec((err, feature) => {
            if (err) {
                res.send({error: err.message});
                logger.error(err);
                return;
            }

            res.json(feature);
            logger.debug('feature by id : ' + feature);
        });
    },

    getFeaturesByIdArr: (req, res) => {
        let featureIdArr = [];

        const featureIdArrReq = requestParser.getData(req, 'ids');

        featureIdArrReq.forEach((featureId) => {
            try {
                featureId = mongoose.Types.ObjectId(featureId);
                featureIdArr.push(featureId);
            } catch (err) {
                res.json([]);
                logger.error('feature by id : ' + featureId);
            }
        });

        const query = {'_id': {'$in': featureIdArr}};

        Feature.find(query).exec((err, feature) => {
            if (err) {
                res.send({error: err.message});
                logger.error(err);
                return;
            }

            res.json(feature);
            logger.debug('feature by id : ' + feature);
        });
    },

    getFeatureByName: (req, res) => {
        const query = {'name': {'$regex': req.params.featureName}};
        Feature.find(query).exec((err, features) => {
            if (err) {
                res.send({error: err.message});
                logger.error(err);
                return;
            }
            res.json(features);
            logger.debug('features by name : ' + features);
        });
    },

    createFeature: (req, res) => {
        Feature.create({name: req.body.name}, (err, feature) => {
            if (err) {
                res.send({error: err.message});
                logger.error(err);
                return;
            }
            res.json(feature);
            logger.debug('new feature has been created: ' + feature);
        });
    },

    getFeatureThatMostPrevalent: (req, res) => {
        const excludeFeaturesId = requestParser.getData(req, 'excludeFeatures');
        const includeFeaturesId = requestParser.getData(req, 'includeFeatures');

        let andOperator = [];
        let hiddenFeatures = {
            $match: {
                '_id': {
                    $nin: includeFeaturesId
                }
            }
        };

        if (includeFeaturesId.length > 0) {
            andOperator.push({
                'features': {
                    $in: includeFeaturesId
                }
            });
        }

        andOperator.push({
            'features': {
                $nin: excludeFeaturesId
            }
        });

        Animal.aggregate(
            [
                {
                    $match: {
                        $and: andOperator
                    }
                },
                {
                    $unwind: {
                        path: '$features'
                    }
                },
                {
                    $group: {
                        _id: '$features',
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'feature',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'feature',
                    }
                },
                {
                    $unwind: {
                        path: '$feature'
                    }
                },
                {
                    $project: {
                        name: '$feature.name',
                        count: '$count'
                    }
                },
                hiddenFeatures,
                {
                    $sort: {
                        count: -1
                    }
                },
                {
                    $limit: 100
                }
            ],
            (err, features) => {
                if (err) {
                    logger.error(err);
                    res.json({error: err.message});
                } else {
                    for (let f of features) {
                        f.id = f._id;
                        delete f._id;
                    }
                    logger.debug('prevalent feature : ' + JSON.stringify(features));
                    res.json(features);
                }
            }
        );
    }
};
