"use strict";

class Inscription {
    constructor(pseudo, motDePasse) {
        this.pseudo = pseudo;
        this.motDePasse = motDePasse;
        this.fichierUtilisateurs = "donnees/utilisateurs.json";
    }
    
    /*
     * TODO doc
     */
    inscrire(callback) {
        var _this = this;
        
        // on verifie la validite du pseudo et du mot de passe
        // pseudo: >= 3 caracteres
        // mot de passe: >= 7 carateres
        if (this.pseudo.length < 3 || this.motDePasse.length < 7) {
            console.log("[!] erreur format pseudo ou pass");
            // on met le parametre err a true
            callback(true);
        } else {
            jsonfile.readFile(this.fichierUtilisateurs, function(err, obj) {
                if (err) {
                    console.log("[!] erreur lecture comptes");
                    // on met le parametre err a true
                    callback(true);
                } else {
                    var dejaExistant = false;
                    
                    // on verifie que le pseudo ne soit pas deja utilise
                    for (var i = 0; i < obj.utilisateurs.length; i++) {
                        if (obj.utilisateurs[i].pseudo == _this.pseudo) {
                            dejaExistant = true;
                        }
                    }
                    
                    if (dejaExistant) {
                        console.log("[!] pseudo deja utilise");
                        // on met le parametre err a true
                        callback(true);
                    } else {
                        // si le pseudo n'est pas utilise
                        obj.utilisateurs.push({"pseudo": _this.pseudo,
                                               "pass": _this.motDePasse,
                                               "idjoueur": ++obj.dernierId,
                                               "score": 0,
                                               "niveau": 0});
                        jsonfile.writeFile(_this.fichierUtilisateurs, obj, function(err) {
                            if (err) {
                                console.log("[!] erreur ecriture comptes");
                                // on met le parametre err a true
                                callback(true);
                            } else {
                                // on a un nouvel inscrit !
                                callback(false);
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