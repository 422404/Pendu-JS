"use strict";

class Scores {
    constructor() {
        this.fichierScores = "donnees/parties.json";
        this.fichierUtilisateurs = "donnees/utilisateurs.json";
    }
    
    /*
     * TODO doc
     */
    getHighscoresGlobaux(nombre, callback) {
        var highscores = [];
        var maxIndex = 0;
        
        jsonfile.readFile(this.fichierUtilisateurs, function(err, obj) {
            if (err) {
                callback(true, null);
            } else {
                var repetitions = obj.utilisateurs.length < nombre
                                  ? obj.utilisateurs.length : nombre;
                
                for (var i = 0; i < repetitions; i++) {
                    // on determine l'index du plus grand score global
                    for (var j = 1; j < obj.utilisateurs.length; j++) {
                        if (obj.utilisateurs[j].score > obj.utilisateurs[maxIndex].score) {
                            maxIndex = j;
                        }
                    }
                    // on met le meilleur score global dans les highscores
                    highscores.push({"pseudo" : obj.utilisateurs[maxIndex].pseudo,
                                     "score" : obj.utilisateurs[maxIndex].score});
                    // on enleve le highscore de la liste
                    obj.utilisateurs.splice(maxIndex, 1);
                    maxIndex = 0;
                }
                callback(false, highscores);
            }
        });
    }
    
    /*
     * TODO doc
     */
    getScoresParties(idjoueur, callback) {
        jsonfile.readFile(this.fichierScores, function(err, obj) {
            // si le fichier ne peut etre lu on positionne le parametre
            // err de la fonction callback à 2
            if (err) {
                callback(2, null);
            } else {
                var listeScores = [];
                
                for (var i = 0; i < obj.parties.length; i++) {
                    if (obj.parties[i].idjoueur == idjoueur) {
                        listeScores.push({"mot" : obj.parties[i].mot,
                                          "difficulte" : obj.parties[i].difficulte,
                                          "score" : obj.parties[i].score});
                    }
                }
                
                // si on n'a aucunes parties enregistrees pour l'utilisateur
                // on positionne le parametre err de la fonction callback à 1
                if (listeScores.length == 0) {
                    callback(1, null);
                } else {
                    callback(0, listeScores);
                }
            }
        });
    }
    
    /*
     * TODO doc
     */
    addScore(compte, mot, difficulte, score, callback) {
        if (mot == "" || difficulte < 0 || difficulte > 2 || score < 0) {
            console.log("[!] erreur parametres");
            callback(true);
        } else {
            var _this = this;
            
            jsonfile.readFile(this.fichierScores, function(err, obj) {
                if (err) {
                    // si une erreur a lieu on met le parametre err de la fonction
                    // de callback a true
                    callback(true);
                } else {
                    obj.parties.push({"idjoueur" : compte.idjoueur, 
                                      "mot" : mot, 
                                      "difficulte" : difficulte,
                                      "score" : score});
                    
                    jsonfile.writeFile(_this.fichierScores, obj, function(err) {
                        if (err) {
                            console.log("[!] erreur ecriture json (partie)");
                            callback(true);
                        } else {
                            jsonfile.readFile(_this.fichierUtilisateurs, function(err, obj) {
                                // attention obj est une nouvelle variable, la precedente est occultee
                                if (err) {
                                    console.log("[!] erreur lecture json (comptes)");
                                    callback(true);
                                } else {
                                    // chercher la ligne concernant l'utilisateur
                                    for (var i = 0; i < obj.utilisateurs.length; i++) {
                                        if (obj.utilisateurs[i].idjoueur == compte.idjoueur) {
                                            obj.utilisateurs[i].score += score;
                                            obj.utilisateurs[i].niveau = Math.floor(obj.utilisateurs[i].score / 10000);
                                        }
                                    }
                                    
                                    jsonfile.writeFile(_this.fichierUtilisateurs, obj, function(err) {
                                        if (err) {
                                            console.log("[!] erreur ecriture json (comptes)");
                                            callback(true);
                                        } else {
                                            // tout c'est bien deroule
                                            callback(false);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}


var jsonfile = require("jsonfile");
// un peu de mise en forme
jsonfile.spaces = 4;
module.exports = Scores;