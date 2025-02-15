import { Animal } from '../models/Animal.js';

let getOne = (animalId) => {
    let animalData = Animal.findById(animalId);

    if (Object.values(animalData).length <= 0) {
        throw new Error('This animal does not have details!');
    }

    return animalData;
}

let getAll = (query) => {
    let animal = Animal.find({});
console.log(query.location);

    if (query.location) {
        animal = animal.find({ location:{ $regex:query.location,$options:'i' }});
    }

    return animal;
    
}

let getLatestAnimal = () => {
    return Animal.find({}).sort({ _id: 'desc' }).limit(3);
}

let create = async (animalData, ownerId) => {
    return await Animal.create({
        ...animalData,
        years: Number(animalData.years),
        owner: ownerId
    });
}

let donate = async (animalId, userId) => {
    let animal = await Animal.findById(animalId);

    if (animal.owner.equals(userId)) {
        throw new Error('You cannot donate to your own animal!');
    }

    if (animal.donations.includes(userId)) {
        throw new Error('You have already donated for this animal!');
    }
console.log(animalId);
console.log(userId);


    await Animal.findByIdAndUpdate(animalId, { $push: { donations: userId } });
}

let deleteData = (animalId) => {
    return Animal.findByIdAndDelete(animalId);
}

let updateData = (animalId, animalData) => {
    return Animal.findByIdAndUpdate(animalId, animalData, { runValidators: true });
}

export default {
    getOne,
    getAll,
    getLatestAnimal,
    create,
    donate,
    deleteData,
    updateData
}