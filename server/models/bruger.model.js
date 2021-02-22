const mongoose = require('mongoose');

let bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 5;

const brugerSchema = new mongoose.Schema({
    brugernavn: {
        type: String,
        required: [true, 'Brugernavn er påkrævet'],
        index: { unique: true }
    },
    fornavn: {
        type: String,
        required: [true, 'Fornavn er påkrævet']
    },
    efternavn: {
        type: String,
        required: [true, 'Efternavn er påkrævet!']

    },
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
    },
    rolle: {
        type: String, enum: ['Medlem', 'ADMIN'],
        default: "Medlem" // vælg mellem ADMIN eller Medlem 
    },
    // kommentarer: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Kommentar' // fordi vi refererer til en anden model/schema - value SKAL matche navnet på navnet i export i modellen der referes til
    // }]
})


// Krypter password inden save
brugerSchema.pre('save', function (next) {

    var bruger = this;

    if (!bruger.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {

        if (err) return next(err);

        bcrypt.hash(bruger.password, salt, function (err, hash) {

            if (err) return next(err);

            bruger.password = hash;
            next();
        });
    });
});



// Sammenlign indtastet password med models password (når model instantieres ud fra brugers email)
brugerSchema.methods.comparePassword = function (indtastetPassword, cb) {

    console.log("model", indtastetPassword, " ")

    bcrypt.compare(indtastetPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('Bruger', brugerSchema, 'brugere');