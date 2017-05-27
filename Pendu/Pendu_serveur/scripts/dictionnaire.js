"use strict";

class Dictionnaire {
    constructor() {
        this.fichiersMots = ["dictionnaires/mots_facile.txt",
                             "dictionnaires/mots_moyen.txt", 
                             "dictionnaires/mots_difficile.txt"];
    }
    
    /*
     * Pioche un mot aleatoire et execute le callback avec le parametre err
	 * en premier et le mot en second parametre
     * Les mots proviennent de plusieurs fichiers aillant un niveau de difficulte
     * different
     * difficulte: niveau de difficulte du mot doit etre l'intervalle 0..2
     * callback: fonction appellee a la fin sous la forme function(err, mot)
     */
    motAleatoire(difficulte, callback) {
        var fichier;
        
        // on verifie que la difficulte soit valide
        if (typeof difficulte != "number" 
            && (difficulte < 0 || difficulte > 2)) {
            
            console.log("[!] mauvaise difficulte");
            callback(true, null);
        } else {
            fichier = this.fichiersMots[difficulte];
            console.log("difficulte = " + difficulte);
            
            // on ouvre le fichier...
            fs.open(fichier, "r", function(err, fd) {
                if (err) {
                    console.log("[!] erreur ouverture fichier\n" + err);
                    callback(true, null);
                } else {
                    // ...on lit son contenu en temps que texte...
                    // (on suppose un encodage en ascii)
                    fs.readFile(fichier, "ascii", function(err, data) {
                        if (err) {
                            console.log("[!] erreur lecture fichier\n" + err);
                            callback(true, null);
                        } else {
                            var splittedData = data.split('\n');
                            var mot = splittedData[Math.floor(Math.random() * splittedData.length)];
                            
                            console.log("Mot : " + mot);
                            callback(false, mot);
                        }
                    });
                }
            });
        }
    }
}

var fs = require("fs");
module.exports = Dictionnaire;