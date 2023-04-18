import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
    {
        name:{

            type: String,
        },
        collectionList: {
          
                type: Array,
                required: true,
            
        },
        attributeList: {
          
                type: Array,
                required: true,
            

        },
        included: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: { currentTime: () => new Date().getTime() } }
);

const Template = mongoose.model('adminTemplate', templateSchema);

export default Template;