import { Router } from 'express';
import homeController from './controllers/homeController.js';
import laptopController from './controllers/laptopController.js';
import authController from './controllers/authController.js';

let router = Router();

router.use(homeController);
router.use(laptopController);
router.use(authController);


router.get('*', (req, res) => {
    res.render('404');
});

export default router;  
