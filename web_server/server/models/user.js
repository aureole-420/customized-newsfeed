const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        index: {unique: true}
    }, 
    password: String,
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

UserSchema.pre('save', function saveHook(next) {
    const user = this;

    if (!this.isModified('password'))
        return next();

    return bcrypt.genSalt((saltError, salt) =>{
        if (saltError) {
            return next(saltError);
        }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) {
                return next(hashError);
            }
            // hash 没有问题的话 replace the password string with hashed value.
            user.password = hash;

            return next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);