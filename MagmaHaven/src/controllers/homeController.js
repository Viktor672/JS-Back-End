import { Router } from 'express';
import volcanoService from '../services/volcanoService.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';

let router = Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/catalog', async (req, res) => {
    try {
        let volcano = await volcanoService.getLatestVolcano();

        res.render('catalog', { volcano });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('catalog', { volcano, error });
    }
});

export default router;