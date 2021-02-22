const mongoose = require('mongoose');
let bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 5;

const adminbrugerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email er påkrævet!'],
        trim: true,
        lowercase: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: [true, 'Password er påkrævet'],
        minlength: [6, 'Password skal være minimum 6 tegn!']
    }
})


adminbrugerSchema.pre('save', function (next) {

    var adminbruger = this;

    if (!adminbruger.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {

        if (err) return next(err);

        bcrypt.hash(adminbruger.password, salt, function (err, hash) {

            if (err) return next(err);

            adminbruger.password = hash;
            next();
        });
    });
});


adminbrugerSchema.methods.comparePassword = function (indtastetPassword, cb) {

    console.log("model", indtastetPassword, " ")

    bcrypt.compare(indtastetPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Adminbruger', adminbrugerSchema, 'adminbrugere');