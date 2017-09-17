/*
 * Jeu du pendu en JavaScript
 * Pierre Romestant, Elyan Poujol, Morgane Tuffery, Aleksandr Vassilyev
 */

"use strict";


// 47x erreurs de sauvegarde des scores
// 48x erreurs d'inscription

/*
 * execute les differentes commandes possibles suivant l'action demandee grâce a
 * la variable "type" inscrite dans le corps de la requete POST
 */
function connexionHandler(req, res) {
    // si une requete de type POST est recue...
    if (req.method == "POST") {
                var tmp = '';
                
                // ...et que les donnees sont disponibles...
                req.on('data', function (data) {
                tmp += data;
                });

                // ...on affiche la valeur du parametre difficulte
                req.on('end', function () {
                    var param = queryString.parse(tmp);
                
                    console.log("\n\ntype requete : " + param["type"]);
                
                    switch (param["type"]) {
                        case "mot":
                            dico.motAleatoire(param["difficulte"], function(err, mot) {
                                if (err) {
                                    res.writeHead(400, HEADER_TEXT_PLAIN);
                                    res.end();
                                } else {
                                    res.writeHead(200, HEADER_TEXT_PLAIN);
                                    res.end(mot);
                                }
                            });
                            break;
                    
                        case "compte": // on veut manipuler les infos du compte
                            var connexion = new Connexion(param["id"], param["pass"]);
                            connexion.authentifier(function(err, compte) {
                                if (err) {
                                    console.log("[!] utilisateur inexistant");
                                    res.writeHead(400, HEADER_TEXT_PLAIN);
                                    res.end();
                                } else {
                                    console.log("type action : " + param["action"]);
                                    
                                    switch (param["action"]) {
                                        case "connect": // on veut se connecter et obtenir le 
                                                        // niveau ainsi que le score global
                                            res.writeHead(200, HEADER_TEXT_PLAIN);
                                            res.end(JSON.stringify({"score" : compte.score,
                                                                    "niveau" : compte.niveau}));
                                            break;
                                        
                                        case "get-scores":
                                            scores.getScoresParties(compte.idjoueur,
                                            function(err, scores) {
                                                switch (err) {
                                                    case 2: // le fichier contenant les scores ne peut être lu
                                                        console.log("[!] erreur lecture json");
                                                        res.writeHead(500, HEADER_TEXT_PLAIN);
                                                        res.end();
                                                        break;
                                                    
                                                    case 1: // le joueur n'a effectue aucunes parties
                                                        console.log("[+] pas de scores enregistres");
                                                        res.writeHead(400, HEADER_TEXT_PLAIN);
                                                        res.end();
                                                        break;
                                                
                                                    case 0:
                                                        res.writeHead(200, HEADER_TEXT_PLAIN);
                                                        res.end(JSON.stringify(scores));
                                                }
                                            });
                                            break;
                                        
                                        case "add-score":
                                            scores.addScore(compte, param.mot, 
                                                            parseInt(param.difficulte),
                                                            parseInt(param.score),
                                            function(err) {
                                                switch (err) {
                                                    case 2: // Probleme lecture/ecriture
                                                        console.log("Probleme lecture/ecriture");
                                                        res.writeHead(500, HEADER_TEXT_PLAIN);
                                                        res.end();
                                                        break;
                                                    
                                                    case 1: // Probleme parametres (erreur perso 470)
                                                        console.log("Probleme parametres");
                                                        res.writeHead(470, HEADER_TEXT_PLAIN);
                                                        res.end();
                                                        break;
                                                    
                                                    case 0:
                                                        // on confirme que tout s'est bien passe
                                                        res.writeHead(200, HEADER_TEXT_PLAIN);
                                                        res.end();
                                                }
                                            });
                                            break;
                                    
                                        default:
                                            console.log("[!] action sur le compte inconnue");
                                            res.writeHead(400, HEADER_TEXT_PLAIN);
                                            res.end();
                                    }
                                }
                            });
                            break;
                            
                        case "inscription":
                            var nouvelUtilisateur = new Inscription(param["id"], param["pass"]);
                            nouvelUtilisateur.inscrire(function(err) {
                                switch (err) {
                                    case 3: // pseudo deja utilise (erreur perso 480)
                                        console.log("[!] pseudo deja utilise");
                                        res.writeHead(480, HEADER_TEXT_PLAIN);
                                        break;
                                
                                    case 2: // erreur lecture/ecriture
                                        console.log("[!] erreur lecture/ecriture");
                                        res.writeHead(500, HEADER_TEXT_PLAIN);
                                        break;
                                    
                                    case 1: // pseudo ou mot de passe ne respectent pas
                                            //le format (erreur perso 481)
                                        console.log("[!] pseudo ou mot de passe ne respectent pas le format");
                                        res.writeHead(481, HEADER_TEXT_PLAIN);
                                        break;
                            
                                    
                                    case 0: // tout va bien
                                        res.writeHead(200, HEADER_TEXT_PLAIN);
                                }
                                res.end();
                            });
                            break;
                                
                        case "highscores":
                            scores.getHighscoresGlobaux(NB_HIGHSCORES, function(err, highscores) {
                                if (err) {
                                    console.log("[!] erreur de lecture highscores");
                                    res.writeHead(400, HEADER_TEXT_PLAIN);
                                    res.end();
                                } else {
                                    res.writeHead(200, HEADER_TEXT_PLAIN);
                                    res.end(JSON.stringify(highscores));
                                }
                            });
                            break;
                            
                        default:
                            console.log("[!] type requete inconnu");
                    }
                });
    } else {
        res.writeHead(400, HEADER_TEXT_PLAIN);
        res.end();
        console.log("[!] Pas de methode POST\n\n");
    }
}


var http = require("http");
var queryString = require("querystring");
var fs = require("fs");

var Dictionnaire = require("./scripts/dictionnaire.js");
var Connexion = require("./scripts/connexion.js");
var Scores = require("./scripts/scores.js");
var Inscription = require("./scripts/inscription.js");

var HEADER_TEXT_PLAIN = {"Access-Control-Allow-Origin" : "*", 
                         "Content-Type": "text/plain"};
var port = 8080;
var NB_HIGHSCORES = 10;

var dico = new Dictionnaire();
var scores = new Scores();

// on demarre l'ecoute
var server = http.createServer(connexionHandler);
server.listen(port);

console.log("ecoute port : " + port);