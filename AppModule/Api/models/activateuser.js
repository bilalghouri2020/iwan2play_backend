const mongoose = require('mongoose')

const GeoSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
})
const activatedUser = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    isActive: {
        type: Boolean,
        required: true
    },
    location: {
        type: GeoSchema,
        required: true,
    }
    // lat: {
    //     type: String,
    //     required: true
    // },
    // lng: {
    //     type: String,
    //     required: true
    // },
}, { timestamps: true })

const ActivatedUser = mongoose.model('activateduser', activatedUser)
exports.ActivatedUser = ActivatedUser