import { Router } from 'express';
import homeController from './controllers/homeController.js';
import authController from './controllers/authController.js';
import recipeController from './controllers/recipeController.js';

let router = Router();

router.use(homeController);
router.use(authController);
router.use(recipeController);

router.get('*', (req, res) => {
    res.render('404');
});

export default router;