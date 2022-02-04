const models = require('../models');

exports.getNotifications = (req, res, next) => {
    models.Notification.findAndCountAll({
        attributes: ['id','publicationId','type', 'createdAt'],
        order:[['createdAt', 'DESC']],
        include: [
            {
                model: models.Publication,
                attributes: ['id'],
                include: {
                    model: models.User,
                    attributes: ['userName']
                }
            }, {
                model: models.User,
                attributes: ['userName', 'id']
            }        
        ],
    })
    .then( notifications => {
        if(!notifications){
            return res.status(404).json({message: "Il n'y a aucune notifications pour le moment"})
        }
        res.status(200).json( notifications )
    })
    .catch( error => res.status(501).json( error ))

}


