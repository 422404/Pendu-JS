/*
 * Jeu du pendu en JavaScript
 * Pierre Romestant, Elyan Poujol, Morgane Tuffery, Aleksandr Vassilyev
 */

"use strict";

class Inscription {
    constructor(pseudo, motDePasse) {
        this.pseudo = pseudo;
        this.motDePasse = motDePasse;
        this.fichierUtilisateurs = "donnees/utilisateurs.json";
    }
    
    /*
     * Inscrit l'utilisateur si le format de son pseudo et son mot de passe
     * est correct
     * callback:
     *    fonction de callback ayant pour parametre:
     *        err: 0 si aucune erreur n'est survenue
     *             1 si le pseudo ou le mot de passe ne respectent pas le format
     *             2 si erreur de lecture/ecriture du fichier des comptes
     *             3 si le pseudo est deja utilise
     */
    inscrire(callback) {
        var _this = this;
        
        // on verifie la validite du pseudo et du mot de passe
        // pseudo: >= 3 caracteres
        // mot de passe: >= 7 carateres
        if (this.pseudo.length < 3 || this.motDePasse.length < 7) {
            // on met le parametre err a true
            callback(1);
        } else {
            jsonfile.readFile(this.fichierUtilisateurs, function(err, obj) {
                if (err) {
                    // on met le parametre err a true
                    callback(2);
                } else {
                    var dejaExistant = false;
                    
                    // on verifie que le pseudo ne soit pas deja utilise
                    for (var i = 0; i < obj.utilisateurs.length; i++) {
                        if (obj.utilisateurs[i].pseudo == _this.pseudo) {
                            dejaExistant = true;
                        }
                    }
                    
                    if (dejaExistant) {
                        // on met le parametre err a true
                        callback(3);
                    } else {
                        // si le pseudo n'est pas utilise
                        obj.utilisateurs.push({"pseudo": _this.pseudo,
                                               "pass": _this.motDePasse,
                                               "idjoueur": ++obj.dernierId,
                                               "score": 0,
                                               "niveau": 0});
                        jsonfile.writeFile(_this.fichierUtilisateurs, obj, function(err) {
                            if (err) {
                                // on met le parametre err a true
                                callback(2);
                            } else {
                                // on a un nouvel inscrit !
                                callback(0);
                            }
                        });
                    }
                }
            });
        }
    }
}


var jsonfile = require("jsonfile");
jsonfile.spaces = 4;
module.exports = Inscription;