const router = require('express').Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth');

// Route to render the edit page for an existing post
router.get("/edit/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        const post = postData.get({ plain: true });
        res.render("edit", { post });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to render the create page for a new post
router.get("/create", withAuth, (req, res) => {
    res.render("edit", { post: {} }); // Pass an empty post object for the create view
});

// Route to handle the submission of an edited post
router.put("/api/posts/:id", withAuth, async (req, res) => {  // Changed to PUT for updating
    try {
        const { title, description } = req.body;
        await Post.update({ title, description }, { where: { id: req.params.id } });
        res.redirect("/dashboard");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to handle the submission of a new post
router.post("/api/posts", withAuth, async (req, res) => {  // Made the route more RESTful
    try {
        const { title, description } = req.body;
        await Post.create({ title, description, user_id: req.session.user_id });
        res.redirect("/dashboard");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;

