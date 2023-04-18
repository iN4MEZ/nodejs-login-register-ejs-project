const User = require('../models/User');

module.exports = async (req,res) => {

    const UserData = await User.findById(req.session.userId);

    res.render('home',{
        UserData
    });
}