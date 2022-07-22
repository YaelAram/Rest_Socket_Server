const { model, Schema } = require( 'mongoose' );

const sectionSchema = Schema( {
    name: {
        type: String,
        required: [ true, 'Name field is required' ]
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
} );

sectionSchema.methods.toJSON = function(){
    const { __v, _id, state, ...section } = this.toObject();
    section.uid = _id;
    return section;
};

module.exports = model( 'Section', sectionSchema );
