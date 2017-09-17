/*
 * Jeu du pendu en JavaScript
 * Pierre Romestant, Elyan Poujol, Morgane Tuffery, Aleksandr Vassilyev
 */

/*
 * LesDifficultes.java                                                22 mai 2017
 * IUT info1 2016-2017 groupe 3, pas de droits
 */
package fichier.pendu.difficulte;

/** 
 * Création de fichiers textes
 * utilisable par l'application PenduJS
 * @author pierre romestant
 *
 */
public class LesDifficultes {
    
    /**
     * Lecture d'un fichier, le filtre 
     * permet le tri de fichier texte
     * toute occurence sera placé dans un nouveau fichier texte 
     * @param args
     */
    public static void main(String[] args) {
        
        Outil.verifier1MotParLigne("moyen.txt", "difficulteMoyenVerifie.txt");
        Outil.supprimerAccent("difficulteMoyenVerifie.txt","difficulteMoyenVerifieSansAccent.txt");
        
        Outil.verifier1MotParLigne("fableFacile.txt", "fableFacileVerifie.txt");
        Outil.supprimerAccent("fableFacileVerifie.txt","fableFacileVerifieSansAccent.txt");
        
        Outil.verifier1MotParLigne("fableMoyen.txt", "fableMoyenVerifie.txt");
        Outil.supprimerAccent("fableMoyenVerifie.txt","fableMoyenVerifieSansAccent.txt");
        
        Outil.verifier1MotParLigne("fableDifficile.txt", "fableDifficileVerifie.txt");
        Outil.supprimerAccent("fableDifficileVerifie.txt","fableDifficileVerifieSansAccent.txt");
       
        Outil.creationFichier("fableFacileVerifieSansAccent.txt",
                              "mots_facile1.txt",
                              /* filtre sur le début de la chaine */
                              "^(a|b|c|d|e)[a-u&&[^h]]+[a-u[^h]]"
                              /* filtre sur toutes les conjuguaisons francaises*/
                            + "[^nt|^ns|^es|^ez|^i|^is|^é|^a]{1}", 3, 6);
        Outil.creationFichier("fableMoyenVerifieSansAccent.txt",
                              "mots_moyen2.txt",
                              /* filtre sur le début de la chaine */
                              "^(a|b|c|d|e|f|g|h|i|j|k|l|m|n)[a-x]+[a-x]"
                              /* filtre sur toutes les conjuguaisons francaises*/ 
                            + "[^nt|^ns|^es|^ez|^i|^is|^é|^a]{1}" , 7, 10);
        Outil.creationFichier("fableDifficileVerifieSansAccent.txt",
                              "mots_difficile3.txt", 
                              /* filtre sur le début de la chaine */
                              "^(j|k|l|m|n|s|t|u|v|x|y|z)[a-z]+[a-z]"
                              /* filtre sur toutes les conjuguaisons francaises*/
                            + "[^nt|^ns|^es|^ez|^i|^is|^é|^a]{1}", 11, 50);

    }
}
