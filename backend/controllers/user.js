const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');


exports.signup = (req, res, next) => {

    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    // On vériifie que tous les champs requis soient remplis
    if(userName == null ||email == null || password == null){
        return res.status(400).json({message: "Tous les champs sont requis" })
    }
    if(userName.length < 4){
        return res.status(400).json({message: "Votre nom d'utilisateur doit comporter au moins 5 caractères"})
    }
    // Vérifie également que l'adresse mail n'est pas déjà utlisée
    models.User.findOne({where: {email}, attributes: ['email']})
    .then( 
        userFound => {
        // Mail déjà utilisée
        if(userFound){
            return res.status(402).json({message: "Cette adresse mail est déjà utilisée" })
        }

        models.User.findOne({
            where: {
                userName: req.body.userName
            }
        })
        .then( userNameUsed => {
            if(userNameUsed){
                return res.status(400).json({message: "Ce nom d'utilisateur est déjà pris"})
            }
                  // Pas de soucis, donc on crypte le password
            bcrypt.hash(password, 10)
            .then( hash => {
                const user = new models.User({
                    userName,
                    email,
                    imageUrl: null,
                    password: hash,
                    isModerator: false
                });
                user.save()
                .then( () => res.status(201).json({message: "Utilisateur créé avec succès"}))
                .catch( error => res.status(500).json({message: error.message}))
        })
        .catch( error => res.status(501).json({ error }))
    
        })
        .catch( error => res.status(404).json( error ))
    })
    .catch( error => res.status(502).json({ error }))
};

exports.login = (req, res, next) => {

    const user = {
        email : req.body.email,
        password : req.body.password
    }
    // Besoin que les 2 champs soient requis pour se econnecter
    if(user.email == null || user.password == null){
        return res.status(402).json({message: "Tous les champs sont requis" })
    }
    // Un utilisateur existe-t-il avec cette adresse mail ?
    models.User.findOne({
        where: {
            email: user.email
        }, 
        attributes: ['email', 'password', 'id']
    })
    .then( userFound => {
        // Non, alors aucun mot de passe ne sera rattaché. On sort
        if(!userFound){
            return res.status(401).json({message: "Adresse mail inconnue de nos services" })
        }
        // oui, compraison du mp et du hash
        bcrypt.compare(user.password, userFound.password)
        .then(valid => {
            // Le mp saisi est inccorect
            if(!valid){
                return res.status(403).json({message: "Mot de passe incorrect" })
            }
            // tout s'est bien passé. On ajoute un userId afin d'authentifier les requêtes de CRUD 
            res.status(200).json({
                userId: userFound.id,
                token: jwt.sign(
                    {userId: userFound.id},
                    "(534y(5ç_èçuç_(uhghè$ù*^m^p^çà_i('-iàç21",
                    {expiresIn: '1h'}
                )
            })
        })
        .catch( error => res.status(501).json({ error }))
    } )
    .catch( error => res.status(406).json({ error }))
};

exports.getUserProfile = (req, res, next) => {
    models.User.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['userName','email', 'description', 'imageUrl', 'id', 'isModerator', 'createdAt']
    })
    .then( profile => {
        if(!profile){
            return res.status(401).json({message: "Aucun compte n'existe à cette adresse" })
        }
        res.status(200).json( profile )
    })
    .catch( error => res.status(500).json({ error }))
};

exports.getAllProfiles = (req, res, next) => {
    models.User.findAndCountAll({
        attributes: ['userName', 'email', 'description', 'imageUrl','id'],
        order: [['userName', 'ASC']]
    })
    .then( users => {
        res.status(200).json( users )
    })
    .catch( error => res.status(500).json({ error }))
};

exports.updateYourAccount = (req, res, next) => {
    const userName = req.body.userName;

    /// Test via le Front
    const userId = JSON.parse(req.headers.authorization).userId;
    console.log(userId)

    //// Test via Postman
    // const userId = JSON.parse(req.body.userId)

    if(!userName & !req.body.email & !req.body.password & !req.body.description & !req.file){
        return res.status(400).json({message: "Vous n'avez séléctionnez aucun champs à modifier" })
    }else if(req.body.isModerator){
        return res.status(401).json({message: "Ce n'est pas à vous de définir cela"})
    }

    models.User.findOne({
        where: {
            id: userId
        }, 
        attributes: ['id','userName', 'email','description','imageUrl']
    })
    .then( user => {

        if(!user){
            return res.status(404).json({message: "Ce id n'est associé à aucun compte" })
        }else{
            if(req.body.password){
                bcrypt.hash(req.body.password, 10)
                .then( hash => {
                    models.User.update({
                        password: hash
                    }, {
                        where: {
                            id: userId
                        }
                    })
                    .then( () => res.status(200).json({message: "Mot de passe mis à jour"}))
                    .catch( error => res.status(500).json({ error }))
                })
                .catch( error => res.status(500).json({ error }))
            }else if(req.file) {
                if( user.imageUrl !== null){
                    const imageProfile = user.imageUrl.split('images/')[1]
                    fs.unlink(`images/${imageProfile}`, () => {
                        models.User.update({
                            imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        }, {
                            where: {
                                id: userId
                            }
                        })
                        .then( () => res.status(200).json({message: "Photo de profile mise à jour "}))
                        .catch( error => res.status(500).json({ error }))
                    })
                }else{
                    models.User.update({
                        imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }, {
                        where: {
                            id: userId
                        }
                    })
                    .then( () => res.status(200).json({message: "Photo de profile mise à jour "}))
                    .catch( error => res.status(500).json({ error }))
                }
            }else if(req.body.email){
                models.User.findOne({
                    where: {
                        email: req.body.email
                    },
                    attributes: ['email']
                })
                .then( user => {
                    if(user){
                        return res.status(501).json({message: "Cette adresse mail est déjà utilisée" })
                    }else{
                        models.User.update({
                            email: req.body.email
                        }, {
                            where: {
                                id: userId
                            }
                        })
                        .then( () => res.status(200).json({message: "Adresse mail modifiée avec succès" }))
                        .catch( error => res.status(500).json( error ))
                    }
                })
                .catch( error => res.status(500).json( error ))
            }else if(req.body.userName) {
                if(req.body.userName.length < 4){
                    return res.status(400).json({message: "Votre nom d'utilisateur doit contenir au moins 5 caractères"})
                }
                models.User.findOne({
                    where: {
                        userName: req.body.userName
                    },
                    attributes: ['userName', 'id']
                })
                .then( user => {
                   if(user){
                       return res.status(504).json({message: "Ce nom d'utilisateur est déjà utilisé" })
                   }else{
                        models.User.update({
                            userName: userName
                        }, {
                            where: {
                                id: userId
                            }
                        })
                        .then( () => res.status(200).json({message: "Nom d'utilisateur mis à jour avec succès" })) 
                        .catch( error => res.status(500).json( error ))
                   } 
                })
                .catch( error => res.status(500).json( error ))
            }
        }
    })
    .catch( error => res.status(500).json({ error }))
};

exports.deleteAcccount = (req, res, next) => {

    //// Test via le Front
    const userId = JSON.parse(req.headers.authorization).userId

    /// Test via Postman
    // const userId = req.body.userId

    models.User.findOne({
        where: {
            id: userId
        },
        attributes: ['id', 'imageUrl', 'userName']
    })
    .then( user => {
        if(user.imageUrl == null){
            models.User.destroy({
                where: {
                    id: userId
                }
               
            })
            .then( () => res.status(200).json({message: "Compte supprmé avec succès, à bientôt " + user.userName}))
            .catch( error => res.status(501).json( error ))
        }else{
            const imageProfile = user.imageUrl.split('images/')[1]
            fs.unlink(`images/${imageProfile}`, () => {
                models.User.destroy({
                    where: {
                        id: userId
                    }
                   
                })
                .then( () => res.status(200).json({message: "Compte supprmé avec succès, à bientôt " + user.userName}))
                .catch( error => res.status(501).json( error ))
            })
        }
    })
    .catch( error => res.status(500).json( error ))
}

