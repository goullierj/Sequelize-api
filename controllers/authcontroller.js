const { User } = require('../models');
const bcrypt = require('bcrypt')

module.exports = {
     signup(req, res) {
        const {body: {username, password, email}} = req
        const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/

        if (username === "") {
            return res.status(400).json({
                success: 'false',
                msg: `Le pseudo est obligatoire`
            })
        }

        if (!passwordRegex.test(password)){
            return res.status(400).json({
                success: 'false',
                msg: ` le mot de passe doit comporté entre 4 et 8 caractères`
            })
        }

        if (!emailRegex.test(email) ){
            return res.status(400).json({
                success:'false',
                msg: `Email incorrect`
            })
        }

        User.findOne({ where: {email: email} })
            .then(function(userExist) {

                if (userExist) {
                    return res.status(422).json({
                        msg: 'Le nom est déja utilisé',
                        userExist,
                        success: 'false'

                    })
                } else {
                    User.create({
                        username: username,
                        email: email,
                        password: bcrypt.hashSync(password, 10),
                        isAdmin: false
                    }).then(response => {
                        return res.status(201).json({
                            msg: "L'utilsateur est bien enregistré",
                            username,
                            success: true

                        });
                    });
                }
            })
    },

    signin(req, res) {
        const {body: {username}} = req
        return res.status(200).json({
            msg: `Bienvenue ${username} !`
        })
    }
};
