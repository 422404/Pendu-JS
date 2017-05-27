"use strict";

class Connexion {
    constructor(pseudo, motDePasse) {
        this.pseudo = pseudo;
        this.motDePasse = motDePasse;
        this.fichierUtilisateurs = "donnees/utilisateurs.json";
    }
    
    /*
     * TODO doc
     * 
     */
    authentifier(callback) {
        var _this = this;
    
        jsonfile.readFile(this.fichierUtilisateurs, function(err, obj) {
            var trouve = false;
            
            if (err) {
                console.log("[!] erreur json");
            } else {
                // recherche du compte
                for (var i = 0; i < obj.utilisateurs.length; i++) {
                    if (obj.utilisateurs[i].pseudo == _this.pseudo
                        && obj.utilisateurs[i].pass == _this.motDePasse) {
                    
                        console.log("utilisateur : " + obj.utilisateurs[i].pseudo);
                        // err: boolean, compte: Compte
                        callback(false, obj.utilisateurs[i]);
                        trouve = true;
                        break;
                    }
                }
                
                if (!trouve) {
                    callback(true, null);
                }
            }
        });
    }
}

var jsonfile = require('jsonfile');
module.exports = Connexion;