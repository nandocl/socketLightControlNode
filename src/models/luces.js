import { Schema, model } from 'mongoose';

let luzSchema = new Schema({
    name: String,
    chipId: String,
    state: {type: Boolean, default: false},
});

export default model('Ligth', luzSchema);