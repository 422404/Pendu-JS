"use strict";

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
                                  case "connect": // on veut se connecter et obtenir le niveau ainsi que le score global
                                      res.writeHead(200, HEADER_TEXT_PLAIN);
                                      res.end(JSON.stringify({"score" : compte.score,
                                                              "niveau" : compte.niveau}));
                                      break;
                                  
                                  case "get-scores":
                                      scores.getScoresParties(compte.idjoueur,
                                      function(err, scores) {
                                          if (err != 0) {
                                              console.log(err == 1 ? "[+] pas de scores enregistres"
                                                                   : "[!] erreur json");
                                              res.writeHead(400, HEADER_TEXT_PLAIN);
                                              res.end();
                                          } else {
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
                                          if (err) {
                                              res.writeHead(400, HEADER_TEXT_PLAIN);
                                              res.end();
                                          } else {
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
                          if (err) {
                              // TODO error codes
                              console.log("[!] impossible d'inscrire l'utilisateur");
                              res.writeHead(400, HEADER_TEXT_PLAIN);
                              res.end();
                          } else {
                              res.writeHead(200, HEADER_TEXT_PLAIN);
                              res.end();
                          }
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
                         "Content-Type": "text/plain"}
var port = 8080;
var NB_HIGHSCORES = 10;

var dico = new Dictionnaire();
var scores = new Scores();

// on demarre l'ecoute
var server = http.createServer(connexionHandler);
server.listen(port);

console.log("ecoute port : " + port);