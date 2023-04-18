const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (req,res) => {
    const {email, password} = req.body;

    User.findOne({ email: email}).then((user) => {
        if(user) {
            const cmp = bcrypt.compare(password,user.password).then((match) => {
                if(match) {
                    req.session.userId = user._id;
                    res.redirect('/home');
                } else {
                    req.flash('PasswordError',"Password Incorrect!");
                    res.redirect('/login');
                }
            });
        } else {
            req.flash('PasswordError',"EMAIL NOT FOUND");
            res.redirect('/login');
        }
    })
}