const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

const defaultBlogPostIncludes = [
    {
        model: User,
        attributes: ["username"],
    },
    {
        model: Comment,
        include: [User],
    },
];

const renderWithSession = (res, view, additionalData = {}) => {
    res.render(view, {
        logged_in: res.req.session.logged_in,
        userId: res.req.session.user_id,
        ...additionalData
    });
}

router.get("/", async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll({
            include: defaultBlogPostIncludes,
        });
        const blogPosts = blogPostData.map((post) => post.get({ plain: true }));
        renderWithSession(res, "homepage", { blogPosts });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get("/blogPost/:id", withAuth, async (req, res) => {
    try {
        const blogPostData = await BlogPost.findByPk(req.params.id, { include: defaultBlogPostIncludes });
        renderWithSession(res, "blogPost", blogPostData.get({ plain: true }));
    } catch (err) {
        console.log(err);
        res.status(500).json(err).redirect("/login");
    }
});

router.get("/dashboard", withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ["password"] },
            include: [{
                model: BlogPost,
                include: [User],
            }, {
                model: Comment,
            }],
        });
        renderWithSession(res, "dashboard", userData.get({ plain: true }));
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get("/create", (req, res) => {
    req.session.logged_in ? renderWithSession(res, "create") : res.redirect("/login");
});

router.get("/create/:id", async (req, res) => {
    try {
        const blogPostData = await BlogPost.findByPk(req.params.id, { include: defaultBlogPostIncludes });
        req.session.logged_in ? renderWithSession(res, "edit", blogPostData.get({ plain: true })) : res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get("/signup", (req, res) => {
    if (req.session.logged_in) {
        res.redirect("/dashboard");
    } else {
        res.render("signup");
    }
});

router.all("/login", (req, res) => {
    req.session.logged_in ? res.redirect("/dashboard") : res.render("login");
});

module.exports = router;
