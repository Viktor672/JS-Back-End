import { Router } from 'express';
import wizardService from '../services/wizardService.js';
import { User } from '../models/User.js';
import { getErrorMessage } from '../utilities/errorUtilities.js';
import { isAuth } from '../middlewares/authMiddleware.js';

let router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('create');
});

router.post('/create', isAuth, async (req, res) => {
    let wizardData = req.body;
    let userId = req.user?.id;

    try {
        await wizardService.create(wizardData, userId);
        res.redirect('/catalog');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('create', { wizardData, error });
    }
});

router.get('/:id/details', async (req, res) => {
    let id = req.params.id;

    try {
        let wizardData = await wizardService.getOne(id);
        let userData = await User.findById(wizardData.owner);
        let isOwner = wizardData.owner?.equals(req.user?.id);
        let userId = req.user?.id;
        let hasVoted = Array.isArray(wizardData.votes) && wizardData.votes.includes(userId);
        let voteCount = wizardData.votes.length;
        let hasVotes = voteCount > 0;
        let userEmails = [];

        if (hasVotes) {
            let users = await User.find({ _id: { $in: wizardData.votes } });
            userEmails = users.map(user => user.email).join(', ');
        }

        res.render('details', { wizardData, userData, isOwner, hasVoted, voteCount, userEmails, hasVotes });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }
});

router.get('/:id/delete', isAuth, async (req, res) => {
    let id = req.params.id;
    try {
        await wizardService.deleteData(id);

        res.redirect('/catalog');
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }
});

router.get('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;

    try {
        let wizardData = await wizardService.getOne(id);

        res.render('edit', { wizardData });
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { wizardData, error });
    }
});

router.post('/:id/edit', isAuth, async (req, res) => {
    let id = req.params.id;

    try {
        let wizardData = await req.body;
        let wizard = await wizardService.getOne(id);

        if (!wizard.owner?.equals(req.user?.id)) {
            let userError = 'You should be the creator in order to do that!';

            res.render('edit', { wizardData, userError });
        }

        await wizardService.updateData(id, wizardData);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('edit', { wizardData, error });
    }
    res.redirect(`/${id}/details`);
});

router.get('/:id/vote', isAuth, async (req, res) => {
    let wizardId = req.params.id;
    let userId = req.user?.id;

    try {
        await wizardService.vote(wizardId, userId);
    }
    catch (err) {
        let error = getErrorMessage(err);

        res.render('details', { error });
    }

    res.redirect(`/${wizardId}/details`);
});


export default router;