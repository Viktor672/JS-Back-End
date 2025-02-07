import Cast from '../models/Cast.js';

export default {
    getAll(filter) {
        if(filter.exclude){
        return Cast.find({ _id: { $nin: filter.exclude } });
        }
    },
    create(castData){
        return Cast.create(castData);
    }
}