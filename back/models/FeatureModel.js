let mongoose = require('mongoose');

const featureSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        animals: [{ type : mongoose.Schema.Types.ObjectId, ref: 'AnimalModel' }]
    },
    {collection: 'feature'});

featureSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});

module.exports = mongoose.model('FeatureModel', featureSchema);
