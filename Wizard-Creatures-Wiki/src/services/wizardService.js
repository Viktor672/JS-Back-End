import { Wizard } from '../models/Wizard.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';

let getOne = (wizardId) => {
    let wizardData = Wizard.findById(wizardId);

    if (Object.values(wizardData).length <= 0) {
        throw new Error('This wizard does not have details!');
    }

    return wizardData;
}


let getLatestVolcano = () => {
    return Wizard.find({}).sort({ _id: 'desc' }).limit(3);
}

let create = async (wizardData, ownerId) => {
    return await Wizard.create({
        ...wizardData,
        owner: ownerId
    });
}

let vote = async (wizardId, userId) => {
    let wizard = await Wizard.findById(wizardId);

    if (wizard.owner.equals(userId)) {
        throw new Error('You cannot vote for your own wizard!');
    }

    if (wizard.votes.includes(userId)) {
        throw new Error('You have already voted for this wizard!');
    }

    await Wizard.findByIdAndUpdate(wizardId, { $push: { votes: userId } });
}

let getProfile = (query) => {
    let wizard = Wizard.find({});

    if (query.owner) {
        wizard = wizard.find({ owner: query.owner });
    }

    return wizard;
}

let deleteData = (wizardId) => {
    return Wizard.findByIdAndDelete(wizardId);
}

let updateData = (wizardId, wizardData) => {
    return Wizard.findByIdAndUpdate(wizardId, wizardData, { runValidators: true });
}

export default {
    getOne,
    getLatestVolcano,
    create,
    vote,
    getProfile,
    deleteData,
    updateData
}