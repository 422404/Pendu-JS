/*
 * Jeu du pendu en JavaScript
 * Pierre Romestant, Elyan Poujol, Morgane Tuffery, Aleksandr Vassilyev
 */

"use strict";

class Connexion {
    constructor(pseudo, motDePasse) {
        this.pseudo = pseudo;
        this.motDePasse = motDePasse;
        this.fichierUtilisateurs = "donnees/utilisateurs.json";
    }
    
    /*
     * Cherche si l'utilisateur est deja inscrit avec le pseudo et le mot de passe
     * fourni
     * Si l'utilisateur existe alors les informations de son comptes sont renvoyees
     * callback:
     *     fonction de callback ayant pour parametres:
     *         err: true si une erreur est survenue sinon false
     *         utilisateur: informations sur l'utilisateur, stockee dans le fichiers
     *                      des comptes. C'est un objet de la forme suivante
     *                      {"pseudo": "valeurPseudo", "pass": "valeurPass",
     *                       "idjoueur": valeurId, "score": valeurScore,
     *                       "niveau": valeurNiveau}
     */
    authentifier(callback) {
        var _this = this;
    
        jsonfile.readFile(this.fichierUtilisateurs, function(err, obj) {
            var trouve = false;
            
            if (err) {
                console.log("[!] erreur json");
                callback(true, null);
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