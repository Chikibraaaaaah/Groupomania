const jwt = require('jsonwebtoken')

const models = require('../models');

exports.createAComment = (req, res, next) => {

    // Via PostMan
    // const userId = req.body.userId

    // Via Front
    const token = req.headers.authorization
    const userId = JSON.parse(token).userId

    models.Publication.findOne({
        where: {
            id: req.body.publicationId
        },
        include: {
            model: models.User,
            attributes: ['userName']
        },
        attributes: ['publiContent', 'imageUrl', 'rate', 'id', 'createdAt']
    })
    .then( publi => {
        if(publi == null){
            return res.status(404).json({message: "Cette publication n'existe plus"})
        }
        models.Comment.findOne({
            where: {
                publicationId: publi.id,
                userId
            }
        })
        .then( comment => {
            if(comment == null){
                if(req.body.commentContent == undefined || req.body.commentContent.length < 1){
                    return res.status(400).json({message: "Vous n'avez rien renseigner"})
                }
                const comment = new models.Comment({
                    userId,
                    publicationId: publi.id,
                    commentContent: req.body.commentContent
                })
                comment.save()
                .then( () => {
                    const notification = new models.Notification({
                        userId,
                        publicationId: req.body.publicationId,
                        type: "commenté"
                    })
                    notification.save()
                    .then( () => res.status(201).json({message: "Commentaire ajouté à la publication de " + publi.User.userName}))
                    .catch( error => res.status(500).json( error ))
                })
                .catch( error => res.status(500).json( error ))
            }else{
                const comment = new models.Comment({
                    userId,
                    publicationId: publi.id,
                    commentContent: req.body.commentContent
                })
                comment.save()
                .then( () => {
                    const notification = new models.Notification({
                        userId,
                        publicationId: req.body.publicationId,
                        type: "répondu"
                    })
                    notification.save()
                    .then( () => res.status(201).json({message: "Commentaire ajouté à la publication de " + publi.User.userName}))
                    .catch( error => res.status(500).json( error ))
                })
                .catch( error => res.status(500).json( error ))
            } 
        })
        .catch( error => res.status(500).json( error))   
    })
    .catch( error => res.status(404).json( error ))
};

exports.updateAComment = (req, res, next) => {

    // Via PostMan
    // const userId = req.body.userId

    // Via Front
    const token = req.headers.authorization
    const userId = JSON.parse(token).userId

    if(req.body.commentContent == undefined || req.body.commentContent.length < 1){
        return res.status(400).json({message: "Votre nouveau commentaire est vide"})
    }
    
    models.User.findOne({
        where: {
            id: userId
        },
        attributes: ['isModerator', 'id']
    })
        .then( user => {
            // On commence par recherché le commentaire en question
        models.Comment.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['commentContent', 'userId'],
            include: {
                model: models.User,
                attributes: ['userName', 'isModerator']
            }
        })
        .then( comment => {
            // S'il n'y en a pas, on sort
            if(comment == null){
                return res.status(404).json({message: "Nous ne trouvons pas le commentaire à modifier" })
            };
            if(comment.userId !== JSON.parse(userId) && user.isModerator !== true){
                return res.status(401).json({message: "Vous n'avez pas le droit de modifier le commentaire d'autres utilisateurs"})
            }
            // Il y'en a un, on le met à jour
            models.Comment.update({
                commentContent: req.body.commentContent
            }, {
                where: {
                    id: req.params.id,
                }
            })
            .then( () => res.status(200).json({message: "Commentaire modifié avec succès" }))
            .catch( error => res.status(503).json({ error }))
        })
        .catch( error => res.status(500).json({ error }))    
    })
    .catch( error => res.status(500).json( error ))
};

exports.deleteYourComment = (req, res, next) => {

   // Via PostMan
    // const userId = req.body.userId

    // Via Front
    const token = req.headers.authorization
    const userId = JSON.parse(token).userId

    models.User.findOne({
        where: {
            id: userId
        },
        attributes: ['id']
    })
    .then( user => {
        models.Comment.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['userId']
        })
        .then( comment => {
            if(comment == null) {
                return res.status(404).json({message: "Aucun commentaire ne correspond à votre demande"})
            }
            if(comment.userId !== JSON.parse(userId) && user.isModerator !== true){
                return res.status(401).json({message: "Vous ne pouvez pas supprimer le commentaire d'autres utilisateurs"})
            }
            models.Comment.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then( () => res.status(200).json({message: "Commentaire supprimé avec succès "}))
            .catch( error => res.status(500).json( error ))
        })
        .catch( error => res.status(500).json( error ))
    })
    .catch( error => res.status(500).json( error ))

};

exports.getAComment = (req, res, next) => {
    models.Comment.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['commentContent', 'createdAt'],
        include:[ {
            model: models.User,
            attributes: ['userName']
        }, {
            model: models.Publication,
            attributes: ['publiContent', 'createdAt'],
            include: {
                model: models.User,
                attributes: ['userName']
            }
        }]
    })
    .then( comment => {
        if(comment == null){
            return res.status(404).json({message: "Le commentaire n'éxiste plus"})
        }
        res.status(200).json( comment )
    })
    .catch( error => res.status(404).json(error ))
}

exports.getAllComments = (req, res, next) => {
    models.Comment.findAll({
        attributes: ['commentContent', 'createdAt', 'id'],
        order: [['createdAt','DESC']],
        include:[ {
            model: models.User,
            attributes: ['userName']
        }, {
            model: models.Publication,
            attributes: ['publiContent', 'createdAt'],
            include: {
                model: models.User,
                attributes: ['userName']
            }
        }]
    })
    .then( comments => {
        if(comments.length < 1) {
            return res.status(404).json({message: "Il n'y a pour le moment aucun commentaire"})
        }
        res.status(200).json( comments )
    })
    .catch( error => res.status(404).json(error ))
}



