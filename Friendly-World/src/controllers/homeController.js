import { Router } from 'express';
import animalService from '../services/animalService.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';

let router = Router();

router.get('/', async (req, res) => {
    try {
        let animal = await animalService.getLatestAnimal();
        res.render('home', { animal });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('home', { error });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        let animal = await animalService.getLatestAnimal();

        res.render('dashboard', { animal });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('catalog', { animal, error });
    }
});

export default router;