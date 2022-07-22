const { model, Schema } = require( 'mongoose' );

const productSchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        required: true,
        default: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    description: {
        type: String
    },
    img: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    }
} );

productSchema.methods.toJSON = function(){
    const { __v, _id, state, ...product } = this.toObject();
    product.uid = _id;
    return product;
};

module.exports = model( 'Product', productSchema );
