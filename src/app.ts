import bodyParser = require("body-parser")
import cookieParser = require("cookie-parser")
import cors = require("cors");

// import * as express from "express";
const express = require('express');
import  'dotenv/config' 
import { myDataSource } from "./configs/data-source"
//import { articlesRoutes } from "./modules/gestiondesarticles/route/article.route";

import { authentication } from "./modules/gestiondesutilisateurs/route/auth.route"
import { rolesRoutes } from "./modules/gestiondesutilisateurs/route/role.route";
import { userRoutes } from "./modules/gestiondesutilisateurs/route/user.route";
import { permissionsRoutes } from "./modules/gestiondesutilisateurs/route/permission.route";
import { affectationsRoutes } from "./modules/gestiondesutilisateurs/route/affectation.route";
import { journalRoutes } from "./modules/gestiondesutilisateurs/route/journal.route";


require("dotenv").config();

if(process.env.NODE_ENV !== "prod") {
    //console.log(process.env.NODE_ENV)
}

//Initialisation et connection de la base de donnée
myDataSource.initialize().then(() => {
  //  console.log("Data Source has been initialized!")
})
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    }
)

// create and setup express app
const app = express()
app.use(express.json())

//gestion des cookie
app.use(cookieParser());

//gestion des fichier static
app.use('/uploads', express.static('uploads'));

//Autoriser les entrés json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Gestion des cors
app.use(cors(
    {origin:  ['http://localhost:3000','http://localhost:8080','http://localhost:8081','http://192.168.8.59:3003' ],
    credentials: true
}));

authentication(app);
//Articles
//articlesRoutes(app);

rolesRoutes(app);

userRoutes(app);

permissionsRoutes(app);

affectationsRoutes(app);

journalRoutes(app);


//Autorisation des entêtes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

/*
app.use('/api/generationdata', generedatas);
//auth
authentication(app);
//app.use(isAuthenticatedOne); 
//gestion des roles
rolesRoutes(app);
// journal connexion et operation
journalRoutes(app);
permissionsRoutes(app);
//gestions des utilisateurs
userRoutes(app);*/
// On gère les routes 404.
app.use(({res}) => {
    const message = 'Le projet a bien démarré mais impossible de trouver la ressource demandée! Vous pouvez essayer une autre URL.'
    res.status(404).json({message});
});

// start express server
app.listen(process.env.PORT_SERVER)