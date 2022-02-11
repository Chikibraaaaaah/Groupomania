# Groupomania
Open ClassRooms P_7

Télécharger le fichier, puis, via l'invite des commande, l'ouvrir et aller au dossier groupomania  (cd Groupomania)

# Backend

1) Rendez-vous dans le dossier backend, "$ cd backend"
2) Une fois dans le dossier backend, installation des dépendances avec npm install
3) En cas de vulnerabilités détéctées, exectuer "$ npm audit fix" sinon passer à l'étape suivante
4) Lancez le server avec la commande nodemon server 
5) La configuration actuelle est faite pour tester l'API via Postman. Pour tester l'API, jumellée avec le front, aller dans le dossier controller. Dans User, aller à la fonction updateAccount, mettre en commentaire la variable userId pour Postman, enlever les commentaires autour de la variable userId pour front.
6) Répéter l'opération dans les fichiers Controllers Publication et Comment pour les fonction Create / Update / Delete. Pour le controller Like, mettre en commentaire la partie dédiée à Postman
7) Se rendre dans le middleware Auth, et mettre en commentaire la partie dédiée à Postman, et enlever les commentaires autour de la partie dédiée au Front

#Front depuis un autre terminal

1) Rendez-vous dans le dossier front avec "$ cd front"
2) Installation des dépendances avec la commande npm install
3) Idem, en cas de vulnérabilités, "$ npm audit fix" sinon, passer à l'étape suivante
4) executer npm run serve et se rendre sur le port proposé
