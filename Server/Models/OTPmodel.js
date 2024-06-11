const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' koleksiyonuna referans verir
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120
    }
});

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;
