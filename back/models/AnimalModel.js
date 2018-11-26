const mongoose = require('mongoose');

const animalSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        features: [{ type : mongoose.Schema.Types.ObjectId, ref: 'FeatureModel' }],
        images: [{type: String}]
    },
    {collection: 'animal'});

animalSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('AnimalModel', animalSchema);
