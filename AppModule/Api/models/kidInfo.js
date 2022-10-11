const mongoose = require('mongoose')
const kidInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    childName: {
        type: String,
        required: true,
    },
    childDOB: {
        type: String,
        required: true,
    },
    childGender: {
        type: String,
        required: true,
        enum: ['female', 'male']
    },
    childImage: {
        type: String,
        required: true,
    },
    selectedLanguage: [{
        type: String,
    }],
    aboutMeAndMyChildText: {
        type: String,
        minlength: 20,
        maxlength: 200,
    },
    iLikeToPlay: {
        type: String,
        required: true,
        enum: ['Indoor', 'Outdoor', 'Everywhere']
    },
    iCanMeet: {
        type: String,
        required: true,
        enum: ['Morning', 'After noor', 'Anytime']
    },
    myFavoriteActivities: [{
        type: String,
    }]
    
}, { timestamps: true })

function arrayLimit(val) {
    return val.length <= 10;
}

const KidInfoModel = mongoose.model('kidsinfo', kidInfoSchema)
exports.KidInfoModel = KidInfoModel