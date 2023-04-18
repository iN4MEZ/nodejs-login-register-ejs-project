const User = require('../models/User');

module.exports = (req,res) => {
    User.create(req.body).then((userdb) => {

        req.session.userId = userdb._id;

        console.log('user has register successfuly! XD');
        res.redirect('/home');
    }).catch((err) => {
        //throw new Error(err);
        if(err) {
            var validationError = Object.keys(err.errors).map(key => err.errors[key].message);
            req.flash('validationErrors',validationError);
            req.flash('data',req.body)
            return res.redirect('/register');
        }
    });
}