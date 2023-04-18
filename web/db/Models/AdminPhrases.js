import mongoose from 'mongoose';

const phraseSchema = new mongoose.Schema(
    {
        collections: {
            type: Array,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum:["cosmetic-condition","functionality"]
        },
    
        text: {
            type: String,
        },
    },
    { timestamps: { currentTime: () => new Date().getTime() } }
);

const Phrase = mongoose.model('adminPhrase', phraseSchema);

export default Phrase;
