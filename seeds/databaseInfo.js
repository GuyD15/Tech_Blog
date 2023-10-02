const sequelize = require('../config/connection');
const { User, BlogPost, Comment } = require('../models');

const userData = [
    {
        username: 'YoFavHomie',
        password: 'password123'
    },
    {
        username: 'GoBucks',
        password: 'passwordIsTaco'
    },
];

const postSeedData = [
    {
        title: 'Why Pierre Gasly is underated',
        description: 'Gasly is proving Alpine mad the right decision to bring on the French driver...',
        user_id: 1 
    },
    {
        title: 'Norris to Redbull?',
        description: 'Amid the resurgence of Mclaren, rumors of Lando Norris moving to Redbull with Max Verstappen...',
        user_id: 2 
    },
];

const commentSeedData = [
    {
        comment_text: 'Great post!',
        user_id: 2,
        post_id: 1
    },
    {
        comment_text: 'That is crazy!',
        user_id: 1,
        post_id: 2
    },
];

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true, 
        returning: true,
    });

    await BlogPost.bulkCreate(postSeedData);

    await Comment.bulkCreate(commentSeedData);

    process.exit(0);
};

seedDatabase();
