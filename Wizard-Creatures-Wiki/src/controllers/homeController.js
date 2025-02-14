import { Router } from 'express';
import { User } from '../models/User.js';
import wizardService from '../services/wizardService.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';
import { isAuth } from '../middlewares/authMiddleware.js';

let router = Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/catalog', async (req, res) => {
    try {
        let wizard = await wizardService.getLatestVolcano();
        console.log(wizard);

        res.render('all-posts', { wizard });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('all-posts', { wizard, error });
    }
});

router.get('/profile', isAuth, async (req, res) => {
    let userId = req.user?.id;
    let createdWizard = await wizardService.getProfile({ owner: userId });
    let userData = await User.findById(userId);
console.log(createdWizard);

    createdWizard = createdWizard.map(wizard => ({
       ...wizard.toObject(),
       userData
    }));
console.log(createdWizard);

    res.render('my-posts', { wizard: createdWizard });
});

export default router;