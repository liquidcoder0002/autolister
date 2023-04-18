import mongoose from 'mongoose';

const attributeSchema = new mongoose.Schema(
    {
        attr_name: {
            type: String,
            required: true,
        },
        attr_type: {
            type: String,
            required: true,
        },
        attr_value: {
            type: Array,
            required: true,
        },
        attr_required_value: {
            type: Boolean,
            required: true,
        },
        message: {
            type: String,
        },
    },
    { timestamps: { currentTime: () => new Date().getTime() } }
);

const Attribute = mongoose.model('adminAttribute', attributeSchema);

export default Attribute;
