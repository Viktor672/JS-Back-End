import { Schema, model } from 'mongoose';

let castSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [5, 'Name should be at least 5 characters long!'],
        match: [/^[ a-zA-Z0-9]+$/, 'Name should be only English letters, digits, and whitespaces']
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    born: {
        type: String,
        minLength: 10,
        match: /^[ a-zA-Z0-9]+$/
    },
    imageUrl: {
        type: String,
        validate: {
            validator: function (value) {
                return /^https?:\/\/$/.test(value);
            },
            message: (props) => `${props.value} is invalid image url!`
        }
    }
});

let Cast = model('Cast', castSchema);

export default Cast;