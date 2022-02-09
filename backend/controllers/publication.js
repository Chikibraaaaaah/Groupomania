const models = require('../models')
const fs = require('fs')


exports.createOnePublication = (req, res, next) => {

    //////// Pour Test Front //
    // const token = req.headers.authorization
    // const userId = JSON.parse(token).userId

    ///// Pour test Postman
    const userId = req.body.userId

    // On s'assure qu'il y a bien un contenu à envoyer
    if(req.body.publiContent == undefined  && req.body.imageUrl == undefined){
        return res.status(400).json({message: "Vous n'avez rien renseigné" })
    }

    if(req.body.publiContent.length < 1){
        return res.status(400).json({message: "Votre publication est vide"})
    }

    const publication = new models.Publication({
        userId,
        publiContent: req.body.publiContent,
        rate: 0
    });

    if(req.file){
        publication.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }else{
        publication.imageUrl = null
    }
    publication.save()
    .then( () => {
        res.status(201).json({message: "Publication créée avec succès"})
    })
    .catch( error => res.status(500).json({ error }))

};

exports.updateYourPublication = (req, res, next) => {

    if(req.body.rate){
        return res.status(401).json({message: "Bien essayé petit malin"})
    }

    // Via PostMan
    const userId = req.body.userId

    // Via Front
    // const token = req.headers.authorization
    // const userId = JSON.parse(token).userId

    const newpubliContent = req.body.publiContent;
    const newImageUrl = req.file;

    models.User.findOne({
        where: {
            id: userId
        },
        attributes: ['id', 'isModerator']
    })
    .then( user => {
        // On vérifie que la publication que l'on souhaite modifier existe bien
    models.Publication.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id','publiContent', 'imageUrl', 'userId'],
        include: {
            model: models.User,
            attributes: ['userName']
        }
    })
    .then( publication => {
        // On ne trouve pas la publication, donc pas de mise à jour. On sort
        if(publication == null){
            return res.status(404).json({message: "Nous ne trouvons pas la publication que vous souhaitez modifier" })
        }
        if( user.isModerator !== true && publication.userId !== user.id){
            return res.status(401).json({message: "Vous ne pouvez pas modifier la publication des autres"})
        }
        // On vérifie qu'il y a un nouveau contenu
        if(newpubliContent == null && newImageUrl == null){
            return res.status(400).json({message: "Vous n'avez pas touché votre publication" })
        }
       if(req.file){
           if(publication.imageUrl == null){
                 models.Publication.update({
                    publiContent: newpubliContent, 
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }, {
                    where: {
                        id: publication.id
                    }
                })
                .then( () => res.status(200).json({message: "Vous venez de mettre à jour votre publication "}))
                .catch( error => res.status(500).json({ error }))
           }else{
               const imagePubli = publication.imageUrl.split('images/')[1]
          
               fs.unlink(`images/${imagePubli}`, () => {
                   models.Publication.update({
                        publiContent: newpubliContent, 
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }, {
                        where: {
                            id: publication.id
                        }
                    })
                    .then( () => res.status(200).json({message: "Vous venez de mettre à jour votre publication "}))
                    .catch( error => res.status(500).json({ error }))
               })
           }
       }else{
           if(req.body.publiContent.length < 1 ){
               return res.status(400).json({message: "Votre message est vide" })
           }
                // On met donc tout ça à jour
                models.Publication.update({
                    publiContent: newpubliContent
                }, {
                    where: {
                        id: publication.id
                    }
                })
                .then( () => res.status(200).json({message: "Vous venez de mettre à jour votre publication "}))
                .catch( error => res.status(500).json({ error }))
       }
    })
    .catch( error => res.status(500).json({ error }))
    })
    .catch( error => res.status(404).json( error ))
};

exports.deleteYourPublication = (req, res, next) => {

    // Via PostMan
    const userId = req.body.userId

    // Via Front
    // const token = req.headers.authorization
    // const userId = JSON.parse(token).userId

    models.User.findOne({
        where: {
            id: userId
        },
        attributes: ['userName','id','isModerator']
    })
    .then( user => {
        models.Publication.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['userId','id']
        })
        .then( publi => {
            if(user.isModerator !== true && publi.userId !== user.id){
                return res.status(401).json({message: "Vos droits ne vous le permettent pas"})
            }
            if(publi.imageUrl == null){
                        models.Publication.destroy({
                            where: {
                                id: publi.id
                            }
                        })
                        .then( () => res.status(200).json({message: "Publication supprimée avec succès " + user.userName }))
                        .catch( error => res.status(502).json( error ))
                    }else{
                        const imagePubli = publi.imageUrl.split('images/')[1]
                        fs.unlink(`images/${imagePubli}`, () => {
                            models.Publication.destroy({
                                where: {
                                    id: publi.id
                                }
                            })
                            .then( () => res.status(200).json({message: "Publication supprimée avec succès " + user.userName }))
                            .catch( error => res.status(501).json( error ))
                        })
                    }
        })
        .catch( error => res.status(404).json( error ))
    })
    .catch( error => res.status(404).json( error ))    
};

exports.getOnePublication = (req, res, next) => {
    models.Publication.findOne({
        where: {
            id :req.params.id
        }, 
        attributes: ['userId','publiContent', 'imageUrl','rate','createdAt', 'id'],
        include: [{
            model: models.User,
            attributes: ['userName', 'id', 'imageUrl']
        }, {
            model: models.Comment,
            attributes: ['id','publicationId', 'commentContent', 'userId'],
            include: {
                model: models.User,
                attributes: ['userName']
            }
        }, {
            model: models.Like,
            attributes: ['id','userId', 'rate', 'publicationId']
        }], 
    })
    .then( publication => {
        if( publication == null){
            return res.status(404).json({message: "Il n'y a pas ou plus de publication à cette adresse" })
        }
        res.status(200).json( publication )
    })
    .catch( error => res.status(500).json({ error }))
};

exports.getAllPublications = (req, res, next) => {
    models.Publication.findAndCountAll({
        attributes: ['publiContent', 'imageUrl','rate','createdAt', 'id'],
        order: [['createdAt','DESC']],
        include: [{
            model: models.User,
            attributes: ['userName', 'id', 'imageUrl'],
        }, {
            model: models.Comment,
            attributes: ['id','userId', 'publicationId', 'commentContent'],
            include: {
                model: models.User,
                attributes: ['id','userName']
            }
        }, {
            model: models.Like,
            attributes: ['id','userId', 'rate', 'publicationId']
        }], 
    })
    .then( publications => {
        if(!publications){
            return res.status(400).json({message: "Il n'y a pour l'heure aucune publications.... "})
        }
        res.status(200).json( publications )
    })
    .catch( error => res.status(500).json({ error }))
};

