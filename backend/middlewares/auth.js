
const jwt = require('jsonwebtoken');

// Création à l'aide de jsonwebtoken d'un token d'authentification qui sera nécessaire pour chaque requête

module.exports = (req, res, next) => {

    try{
        ///////// Test via Postman
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token,"(534y(5ç_èçuç_(uhghè$ù*^m^p^çà_i('-iàç21" )
        const userId = decodedToken.userId
        const frontId = JSON.parse(req.body.userId)

        /// Test via le Front
        // const token = JSON.parse(req.headers.authorization)
        // const decodedToken = jwt.verify(token.token, "(534y(5ç_èçuç_(uhghè$ù*^m^p^çà_i('-iàç21")
        // const userId = decodedToken.userId
        // const frontId = token.userId


        if(frontId && frontId !== userId  ){
            throw 'Requête non authentifiée'
        }else{
            next()
        }
    }catch{
        res.status(401).json({message: "Un problème est survenu, merci de vous reconnectez pour continuer sur notre site"})
    }

};