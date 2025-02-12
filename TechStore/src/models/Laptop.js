import { Schema, model, Types } from 'mongoose';

let laptopSchema = new Schema({
    brand: {
        type: String,
        minLength: [2, 'Brand should be at least 2 characters long']
    },
    model: {
        type: String,
        minLength: [5, 'Model should be at least 2 characters long']
    },
    hardDisk: {
        type: String,
        minLength: [5, 'Hard-Disk should be at least 2 characters long']
    },
    screenSize: {
        type: String,
        minLength: [1, 'Screen-Size should be at least 1 character long']
    },
    ram: {
        type: String,
        minLength: [2, 'Ram should be at least 2 characters long']
    },
    operatingSystem: {
        type: String,
        minLength: [5, 'Operating-System should be at least 5 characters long'],
        maxLength: [20, 'The max of length of Operating-System is 20 characters']
    },
    cpu: {
        type: String,
        minLength: [5, 'CPU should be at least 5 characters long'],
        maxLength: [50, 'The max of length of CPU is 20 characters']
    },
    gpu: {
        type: String,
        minLength: [5, 'GPU should be at least 5 characters long'],
        maxLength: [50, 'The max of length of GPU is 20 characters']
    },
    price: {
        type: Number,
        min: [0, 'Price should be a positive number']
    },
    color: {
        type: String,
        minLength: [2, 'Color should be at least 2 characters long'],
        maxLength: [10, 'The max of length of Color is 10 characters']
    },
    weight: {
        type: String,
        minLength: [2, 'Weight should be at least 2 characters long'],
        maxLength: [10, 'The max of length of Weight is 10 characters']
    },
    imageUrl: {
        type: String,
        match: /^https?:\/\//
    },
    preferredList: [{
        type: String,
        type: Types.ObjectId,
        ref: 'User'
    }],
    creator: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

let Laptop = model('Laptop', laptopSchema);

export default Laptop;