const router = require('express').Router();
const { BlogPost } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await BlogPost.findAll();
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const postData = await BlogPost.findByPk(req.params.id);

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await BlogPost.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedPost = await BlogPost.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id, 
            },
        });

        if (!updatedPost) {
            res.status(404).json({ message: 'No post found with this id or you do not have access to make changes.' });
            return;
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedPost = await BlogPost.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!deletedPost) {
            res.status(404).json({ message: 'No post found with this id or you do not have access to make changes.' });
            return;
        }

        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
