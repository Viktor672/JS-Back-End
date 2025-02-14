import { Volcano } from '../models/Volcano.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';

let getOne = (volcanoId) => {
    let volcanoData = Volcano.findById(volcanoId);

    if (Object.values(volcanoData).length <= 0) {
        throw new Error('This volcano does not have details!');
    }

    return volcanoData;
}

let getAll = async (query) => {
    let volcano = Volcano.find({});

    if (query.search) {
        volcano = volcano.find({ name: { $regex: query.search, $options: 'i' } });
    }

    if (query.typeVolcano) {
        volcano = volcano.find({ typeVolcano: query.typeVolcano });
    }

    return volcano;
}

let getLatestVolcano = () => {
    return Volcano.find({}).sort({ _id: 'desc' }).limit(3);
}

let create = async (volcanoData, ownerId) => {
    return await Volcano.create({
        ...volcanoData,
        elevation: Number(volcanoData.elevation),
        lastEruption: Number(volcanoData.lastEruption),
        owner: ownerId
    });
}

let vote = async (volcanoId, userId) => {
    let volcano = await Volcano.findById(volcanoId);

    if (volcano.owner.equals(userId)) {
        throw new Error('You cannot vote for your own volcano!');
    }

    if (volcano.voteList.includes(userId)) {
        throw new Error('You have already voted for this volcano!');
    }

    await Volcano.findByIdAndUpdate(volcanoId, { $push: { voteList: userId } });
}

let deleteData = (volcanoId) => {
    return Volcano.findByIdAndDelete(volcanoId);
}

let updateData = (volcanoId, volcanoData) => {
    return Volcano.findByIdAndUpdate(volcanoId, volcanoData, { runValidators: true });
}

export default {
    getOne,
    getAll,
    getLatestVolcano,
    create,
    vote,
    deleteData,
    updateData
}