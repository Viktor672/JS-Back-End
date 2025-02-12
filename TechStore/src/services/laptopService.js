import Laptop from '../models/Laptop.js';

export default {
    getOne(laptopId) {
        let laptopQuery = Laptop.findById(laptopId);

        if (Object.keys(laptopQuery).length <= 0) {
            throw new Error('This laptop does not have details!');
        }

        return laptopQuery;
    },
    getProfile(query) {
        let laptop = Laptop.find({});

        if (query.creator) {
            laptop = laptop.find({ creator: query.creator });
        }

        if (query.prefer) {
            laptop = laptop.in('preferredList', query.prefer);
        }

        return laptop;
    },
    async create(laptopData, creatorId) {
        return await Laptop.create({
            ...laptopData,
            // price: Number(laptopData.price),
            creator: creatorId,
        });

    },
    getLatestLaptop() {
        return Laptop.find({}).sort({ _id: 'desc' }).limit(3);
    },
    async prefer(laptopId, userId) {
        let laptop = await Laptop.findById(laptopId);

        if (laptop.creator?.equals(userId)) {
            throw new Error('You cannot prefer your own laptop!');
        }

        if (laptop.preferredList.includes(userId)) {
            throw new Error('You already preffered this laptop');
        }

        await Laptop.findByIdAndUpdate(laptopId, { $push: { preferredList: userId } });
    },
    delete(laptopId) {
        return Laptop.findByIdAndDelete(laptopId);
    },
    update(laptopId, laptopData) {
        return Laptop.findByIdAndUpdate(laptopId, laptopData, { runValidators: true, });
    }
}