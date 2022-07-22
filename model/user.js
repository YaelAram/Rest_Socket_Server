const { Schema, model } = require( 'mongoose' );

const userSchema = Schema( {
    name: {
        type: String,
        required: [ true, 'Name field required' ]
    },
    email: {
        type: String,
        required: [ true, 'Email field required' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'Password field requires' ]
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE'
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
} );

userSchema.methods.toJSON = function(){
    const { __v, password, state, google, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

module.exports = model( 'User', userSchema );
