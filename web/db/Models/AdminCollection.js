import mongoose from 'mongoose';

//Define schema for Collection feature
const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['Active', 'Inactive'],
        },
        
    },
    { timestamps: { currentTime: () => new Date().getTime() } }
);


const Collection = mongoose.model("adminCollection", collectionSchema);

export default Collection;
