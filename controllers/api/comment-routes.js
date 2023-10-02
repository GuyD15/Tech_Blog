const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// POST route to create a new comment
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT route to update a comment by its `id` value
router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedComment = await Comment.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id, // Ensure only the owner of the comment can update it
            },
        });

        if (!updatedComment) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE route to delete a comment by its `id` value
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id, // Ensure only the owner of the comment can delete it
            },
        });

        if (!deletedComment) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        res.status(200).json(deletedComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;

