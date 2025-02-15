import { Router } from 'express';
import homeController from './controllers/homeController.js';
import authController from './controllers/authController.js';
import wizardController from './controllers/wizardController.js';


let router = Router();

router.use(homeController);
router.use(authController);
router.use(wizardController);

router.get('*', (req, res) => {
    res.render('404');
});

export default router;