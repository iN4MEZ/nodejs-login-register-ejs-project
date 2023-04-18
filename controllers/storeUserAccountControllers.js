const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req,res) => {

    const userUpdate = req.body;
    await User.findById(req.session.userId).then((user) => {

        const dataValidation = Object.keys(user).map((key) => {
            user[key] = {
                username: userUpdate.username ? userUpdate.username : user[key].username,
                email: userUpdate.email ? userUpdate.email : user[key].email,
                password: user[key].password
            }
            return user;
        });

        if(typeof user.password && userUpdate.oldpassword != 'undefined' ) {
            const cmp = bcrypt.compare(userUpdate.oldpassword,user.password).then((match) => {
                if(match) {
                    bcrypt.hash(userUpdate.newpassword,10,).then((hash) => {
                        User.findOneAndUpdate(
                            { _id: req.session.userId },
                            { $set: { password: hash} },
                            { new: true}
                            ).then((userUpdated) => {
                                console.log("password Has Update!");
                            }).catch((err) => 
                            {
                                throw new Error(err);
                            });
                    })
                } else {
                    req.flash('validationErrors',"Password Incorrect!")
                }
                
            });
        }

        User.findOneAndUpdate(
            { _id: req.session.userId },
            { $set: { username: user.username, email: user.email } },
            { new: true,upsert: true, runValidators: true}
            ).then((userUpdated) => {
                res.redirect('/accounts');
                console.log(req.session.userId + " Has Been update!");
        }).catch((err) => {
            console.log(err);
            var validationError = Object.keys(err.errors).map(key => err.errors[key].message);
            req.flash('validationErrors',validationError);
            res.redirect('/accounts');
        })

    });
}