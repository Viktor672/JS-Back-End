import Movie from '../models/Movie.js';

export default {
    create(movieData, creatorId) {
        let movieQuery = Movie.create({
            ...movieData,
            rating: Number(movieData.rating),
            year: Number(movieData.year),
            creator: creatorId
        });

        return movieQuery;
    },
    getOne(movieId) {
        let movieQuery = Movie.findById(movieId).populate('casts');

        if (Object.keys(movieQuery).length === 0) {
            throw new Error('This movie does not have details');   //possible error
        }

        return movieQuery;
    },
    getAll(filter) {
        let query = Movie.find({});

        if (filter.search) {
            query = query.find({ title: filter.search });
        }

        if (filter.genre) {
            query = query.find({ genre: filter.genre });
        }

        if (filter.year) {
            query = query.find({ year: Number(filter.year) });
        }

        return query;
    },
    async attachCast(movieId, castId) {
        let movie = await Movie.findById(movieId);

        if (movie.casts.includes(castId)) {
            console.log('The movie has already this actor');
        }

        movie.casts.push(castId);
        await movie.save();

        return movie;

        // return Movie.findByIdAndUpdate(movieId, { $push: { casts: castId } }); 
    },
    delete(movieId) {
        return Movie.findByIdAndDelete(movieId);
    },
    update(movieId, movieData) {
        return Movie.findByIdAndUpdate(movieId, movieData, { runValidators: true });
    }
}