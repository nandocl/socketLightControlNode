import { Schema, model } from 'mongoose';

let userSchema = new Schema({
    name: String,
    user: String,
    password: String,
    email: String,
    phone: String
});

export default model('User', userSchema);