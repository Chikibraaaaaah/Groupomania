const models = require('../models');

exports.likeCtrl = (req, res, next) => {

    /// Pour Postman

    if(!req.body.userId || !req.body.publicationId || !req.body.rate){
        return res.status(401).json({message: "Tous les critères ne semblent pas remplis"})
    }

    if(JSON.parse(req.body.rate) !== 1 & JSON.parse(req.body.rate) !== -1){
        return res.status(401).json({message: "Bien essayé petit maliiiiiiiiiiiiiiin"})
     }


     ////////

    // Seules les publications peuvent être likées, donc recherche la publi en question
    models.Publication.findOne({
        where: {
            id: req.body.publicationId
        },
        attributes: ['id', 'publiContent', 'imageUrl', 'rate', 'userId'],
        include: {        
                model: models.User,
                attributes: ['userName']
        }
    })
    .then( publi => {

        if(!publi){
            return res.status(404).json({message: "Nous ne trouvons pas la publication souhaitée" })
        }
   
        models.Like.findOne({
            where: {
                userId: req.body.userId,
                publicationId: publi.id
            },
            attributes: ['rate', 'id']
        })
        .then( alreadyLike => {

           if(alreadyLike == null){
               
               const like = new models.Like({
                   userId: req.body.userId,
                   publicationId: req.body.publicationId,
                   rate: req.body.rate
               })
               like.save()
               .then( () => {
                   if(like.rate == 1){
                    models.Publication.update({
                        rate: publi.rate + 1 
                    }, {
                     where: {
                         id: publi.id
                     }
                    })
                    .then( () => {
                        const notification = new models.Notification({
                             userId: req.body.userId,
                             publicationId: req.body.publicationId,
                             type: "liké"
                        })
                        notification.save()
                        .then( () => res.status(201).json({message: "Like ajouté à la publication de " + publi.User.userName}) )
                        .catch( error => res.status(500).json( error ))
                    } )
                    .catch( error => res.status(500).json( error ))
                   }else if(req.body.rate == -1){
                    models.Publication.update({
                        rate: publi.rate -1
                    }, {
                     where: {
                         id: publi.id
                     }
                    })
                    .then( () => {
                        const notification = new models.Notification({
                            userId: req.body.userId,
                            publicationId: req.body.publicationId,
                            type: "disliké"
                        })
                        notification.save()
                        .then( () => res.status(201).json({message: "Dislike ajouté à la publication de " + publi.User.userName}))
                        .catch( error => res.status(500).json( error ))
                    } )
                    .catch( error => res.status(500).json( error ))
                   }
               })
               .catch( error => console.log( error ))
           }else{
               if(alreadyLike.rate == 1){
                   if(req.body.rate == 1){
                      return  res.status(200).json({message: "Vous aimez déjà cette publication de " + publi.User.userName})
                   }else{
                       models.Like.update({
                           rate: 0
                       },{
                           where: {
                               id: alreadyLike.id
                           }
                       })
                       .then( () => {
                           models.Publication.update({
                               rate: publi.rate -1
                           }, {
                               where: {
                                   id: publi.id
                               }
                           })
                           .then( () => res.status(200).json({message: "Like retiré de la publication de " + publi.User.userName}))
                           .catch( error => res.status(500).json( error ))
                       }
                       )
                       .catch( error => res.status(500).json( error ))
                   }
               }else if( alreadyLike.rate == 0){
                if(req.body.rate == -1){
                    models.Like.update({
                        rate: -1
                    }, {
                        where: {
                            id: alreadyLike.id
                        }
                    })
                    .then( () => {
                        models.Publication.update({
                            rate: publi.rate -1
                        }, {
                            where: {
                                id: publi.id
                            }
                        })
                        .then( () => res.status(200).json({message: "Dislike ajouté à la publication de " + publi.User.userName}))
                        .catch( error => res.status(500).json( error ))
                    })
                    .catch( error => res.status(500).json( error ))
                }else{
                    models.Like.update({
                        rate: 1
                    }, {
                        where: {
                            id: alreadyLike.id
                        }
                    })
                    .then( () => {
                        models.Publication.update({
                            rate: publi.rate + 1
                        }, {
                            where: {
                                id: publi.id
                            }
                        })
                        .then( () => res.status(200).json({message: "Like ajouté à la publication de " + publi.User.userName}) )
                        .catch( error => res.status(500).json( error ))
                    })
                    .catch( error => res.status(500).json( error ))
                }
               }else{
                   if(req.body.rate == -1){
                        return  res.status(200).json({message: "Vous avez déjà disliké cette publication de " + publi.User.userName})
                   }else{
                       models.Like.update({
                           rate: 0
                       }, {
                           where: {
                               id: alreadyLike.id
                           }
                       })
                       .then( () => {
                           models.Publication.update({
                               rate: publi.rate +1
                           }, {
                               where: {
                                   id: publi.id
                               }
                           })
                           .then( () => res.status(200).json({message: "Dislike retiré cette publication de " + publi.User.userName}))
                           .catch( error => res.status(500).json( error ))
                       })
                       .catch( error => res.status(500).json( error ))
                   }
               }
           }
        })
        .catch( error => res.status(502).json( error ))
    })
};
