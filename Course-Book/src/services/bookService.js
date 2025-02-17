import { Book } from '../models/Book.js';

let getOne = (bookId) => {
    let bookData = Book.findById(bookId);

    if (Object.values(bookData).length <= 0) {
        throw new Error('This book does not have details!');
    }

    return bookData;
}


let getLatestBook = () => {
    return Book.find({}).sort({ _id: 'desc' }).limit(3);
}

let create = async (bookData, ownerId) => {
    return await Book.create({
        ...bookData,
        price: Number(bookData.price),
        owner: ownerId
    });
}

let signUp = async (bookId, userId) => {
    let book = await Book.findById(bookId);

    if (book.owner.equals(userId)) {
        throw new Error('You cannot sign up for your own book!');
    }

    if (book.signUpList.includes(userId)) {
        throw new Error('You have already signed up for this book!');
    }

    await Book.findByIdAndUpdate(bookId, { $push: { signUpList: userId } });
}

let getProfile = (query) => {
    let book = Book.find({});

    if (query.owner) {
        book = book.find({ owner: query.owner });
    }

    if(query.signUp){
        book = book.in('signUpList', query.signUp);
    }

    return book;
}

let deleteData = (bookId) => {
    return Book.findByIdAndDelete(bookId);
}

let updateData = (bookId, bookData) => {
    return Book.findByIdAndUpdate(bookId, bookData, { runValidators: true });
}

export default {
    getOne,
    getLatestBook,
    create,
    signUp,
    getProfile,
    deleteData,
    updateData
}