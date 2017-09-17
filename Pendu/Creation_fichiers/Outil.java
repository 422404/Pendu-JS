/*
 * Jeu du pendu en JavaScript
 * Pierre Romestant, Elyan Poujol, Morgane Tuffery, Aleksandr Vassilyev
 */

/*
 * Outil.java                                                21 mai 2017
 * IUT info1 2016-2017 groupe 3, pas de droits
 */
package fichier.pendu.difficulte;

import java.io.BufferedReader;
import java.lang.Integer;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;

/** 
 * différents outils pour le traitement de fichier
 * @author pierre romestant
 *
 */
public class Outil {

    /** taille maximal du tableau de mot */
    private static final int NOMBRE_LIMITE_TAILLE = 4000;

    /**
     * affecter une valeur aléatoire
     * attention, ici le minimum est toujours 1 pour éviter de tester la ligne 1
     * qui sera toujours fausse car elle contiendra le nombre de lignes du fichier
     * @param max maximum possible pour les valeurs pseudos aléatoires du tableau
     * @return aleatoire, nombre aléatoire
     */

    public static int aleatoire(int max) {
        
        int min = 1; 
        //valeur pseudo aléatoire
        int aleatoire = (int) (( Math.random()*( max - min + 1 ) ) + min);
        return aleatoire ;
    }


    /** 
     * Créer un fichier
     * ce fichier sera créé par rapport au dictionnaire de la langue française
     * ou l'on utilisera une regex placée en paramètre pour pouvoir affecter un filtre
     * sur le dictionnaire
     * @param nomFichierEntree , nom du fichier d'entrée pour la méthode
     * @param nomFichierSortie , nom du fichier crée par la méthode
     * @param regexConditionMot , String regex utilisée comme filtre
     * @param longueurMiniMot , longueur minimum du mot
     * @param longueurMaxiMot , longueur maximal du mot
     */
    public static void creationFichier(String nomFichierEntree, String nomFichierSortie, String regexConditionMot,
            int longueurMiniMot, int longueurMaxiMot) {

        // fichier logique en lecture
        BufferedReader flotEntree;

        // fichier logique en écriture
        PrintStream flotSortie;

        // ligne du fichier à lire
        String mot;

        // nombre de lignes du fichier crée
        int nbrLignes = 0;

        // ouverture du fichier (création du fichier logique)
        try {
            flotEntree = new BufferedReader(new FileReader(nomFichierEntree));

            flotSortie = new PrintStream(nomFichierSortie);

            while ((mot = flotEntree.readLine()) != null) {

                // vérification de la taille
                if (longueurMiniMot <= mot.length() && mot.length() <= longueurMaxiMot) {
                    if(mot.matches(regexConditionMot)) {
                        flotSortie.println(mot);
                        nbrLignes ++;
                    }
                }
            } // fin boucle

            // fermer les fichiers
            flotSortie.close();
            flotEntree.close();
            System.out.println("Le fichier " + nomFichierSortie + " a été écrit");

        } catch (FileNotFoundException e) {
            System.err.println("Le chemin " + nomFichierEntree + " est invalide !"
                    + "\nnom incorrect ou droits insuffisants");
            e.printStackTrace();

        } catch (IOException e) {
            System.err.println("Le fichier n'est plus manipulable");
            e.printStackTrace();
        }
        System.out.println("nombres de lignes : " + nbrLignes);
    }
    
    
    /** 
     * Une méthode permettant de tirer un mot d'un fichier formaté
     * @param nomFichier le nom du fichier ou aller tirer un mot
     * @return mot le mot choisi
     */
    public static String motAleatoire(String nomFichier) {
        
        // mot à choisir aléatoirement
        String mot = null;
        
        /* valeur utilisée pour ne pas dépasser le nbr de ligne du fichier */
        int indice = 0;
         
        /* valeur aléatoire de ligne di fichier*/
        int valeuraleatoire = 0;
        
        /* à convertir en entier */
        String caractereLimiteLigneFichier = "";
        
        /* nombres de lignes dans le tableau*/
        int LimiteLigneFichier = 0;
        
        // fichier logique en lecture
        BufferedReader flotEntree;
        
        // ouverture du fichier (création du fichier logique)
        try {
            flotEntree = new BufferedReader(new FileReader(nomFichier));
                    
            caractereLimiteLigneFichier = flotEntree.readLine(); 
            LimiteLigneFichier = Integer.parseInt(caractereLimiteLigneFichier);
            valeuraleatoire = Outil.aleatoire(LimiteLigneFichier);
            
            while ((mot = flotEntree.readLine()) != null
                    && indice != valeuraleatoire) {
                    
                       indice ++;
            }
            // fermer le fichier
            flotEntree.close();

        } catch (FileNotFoundException e) {
            System.err.println("Le chemin " + nomFichier + " est invalide !"
                    + "\nnom incorrect ou droits insuffisants");
            e.printStackTrace();

        } catch (IOException e) {
            System.err.println("Le fichier n'est plus manipulable");
            e.printStackTrace();
        }
        System.out.println("Le mot est : " + mot);
        return mot;
    }
    
    /**
     * Supprimer les accents et majuscules dans un fichier texte formaté
     * Toutes les lettres avec accents seront remplacés par leurs lettres respectives
     * exemple : à ou â ==> a
     * @param nomFichierEntree 
     * @param nomFichierSortie 
     */
    
    public static void supprimerAccent(String nomFichierEntree, String nomFichierSortie) {
        
        // fichier logique en lecture
        BufferedReader flotEntree;

        // fichier logique en écriture
        PrintStream flotSortie;

        // ligne du fichier à lire
        String mot;
        
        // lettre du mot courant
        char aVerifier = 0;
        
        // lettre par laquelle est remplacée la lettre avec accent
        char lettreSansAccent;       

        // ouverture du fichier (création du fichier logique)
        try {
            flotEntree = new BufferedReader(new FileReader(nomFichierEntree));

            flotSortie = new PrintStream(nomFichierSortie);

            while ((mot = flotEntree.readLine()) != null) {
                
                mot = mot.toLowerCase();
                
                // TabDuMot devient un tableau ou l'on place dans chaque cases une lettre du mot entrée
                // la taille de TabDuMot est égale à la taille du mot
                char[] TabDuMot = mot.toCharArray();
                for(int indice = 0; indice < mot.length(); indice ++) {
                    // vérifie toutes les lettres une par une
                    aVerifier = mot.charAt(indice);
                    switch(aVerifier) {
                    
                        // si égal à un "a" avec un accent
                        case'à': // falls through
                        case'â': // falls through
                        case'ä': // falls through
                        case'å':
                            lettreSansAccent = 'a';
                            TabDuMot[indice] = lettreSansAccent;
                            mot = String.valueOf(TabDuMot);
                            break;
                        
                        // si égal à un "e" avec un accent
                        case 'é': // falls through
                        case 'è': // falls through
                        case 'ë': // falls through
                        case 'ê':
                            lettreSansAccent = 'e';
                            TabDuMot[indice] = lettreSansAccent;
                            mot = String.valueOf(TabDuMot);
                            break;
                        
                         // si égal à un "ç"
                        case'ç':
                            lettreSansAccent = 'c';
                            TabDuMot[indice] = lettreSansAccent;
                            mot = String.valueOf(TabDuMot);
                        break;
                        
                        // si égal à un "i" avec accent
                        case'ï': // falls through
                        case'î': // falls through
                        case'ì':
                            lettreSansAccent = 'c';
                            TabDuMot[indice] = lettreSansAccent;
                            mot = String.valueOf(TabDuMot);
                            break;
                        
                        // si égal à un "u" avec un accent    
                        case'û': // falls through
                        case'ù': // falls through
                        case'ú':
                            lettreSansAccent = 'u';
                            TabDuMot[indice] = lettreSansAccent;
                            mot = String.valueOf(TabDuMot);
                            break;
                        
                         // si égal à un "n" avec un accent
                        case'ñ':
                            lettreSansAccent = 'n';
                            TabDuMot[indice] = lettreSansAccent;
                            mot = String.valueOf(TabDuMot);
                            break;
                        
                         // si égal à un "o" avec un accent
                        case'ô': // falls through
                        case'ö': // falls through
                        case'ò':
                            lettreSansAccent = 'o';
                            TabDuMot[indice] = lettreSansAccent;
                            mot = String.valueOf(TabDuMot);
                            break;
                        
                        default:
                            // rien ne se passe car pas de lettre à modifier
                    }
                }
                flotSortie.println(mot);
            } // fin boucle

            // fermer les fichiers
            flotSortie.close();
            flotEntree.close();
            System.out.println("Le fichier " + nomFichierSortie + " a été créé");

        } catch (FileNotFoundException e) {
            System.err.println("Le chemin " + nomFichierEntree + " est invalide !"
                    + "\nnom incorrect ou droits insuffisants");
            e.printStackTrace();

        } catch (IOException e) {
            System.err.println("Le fichier n'est plus manipulable");
            e.printStackTrace();
        }
    } 
    
    /**
     * Vérifier si il y a un mot par ligne 
     * si oui alors rien
     * sinon modification du fichier
     * @param nomFichierEntree 
     * @param nomFichierSortie 
     */
    
    public static void verifier1MotParLigne(String nomFichierEntree, String nomFichierSortie) {
        
        // fichier logique en lecture
        BufferedReader flotEntree;

        // fichier logique en écriture
        PrintStream flotSortie;

        // ligne du fichier à lire
        String ligne;
        
        // mot à placer
        String mot = "";
        
        // lettre courante
        char lettre = 0;

        // nombre de lignes du fichier
           int nbrMots = 0;
        
        // tableau de tous les mots du texte
        String[] aVerifier = new String[NOMBRE_LIMITE_TAILLE]; 
        
        int indiceTotal = 0;
        int indice = 0;
        
        // ouverture du fichier (création du fichier logique)
        try {
            flotEntree = new BufferedReader(new FileReader(nomFichierEntree));

            flotSortie = new PrintStream(nomFichierSortie);

            while ((ligne = flotEntree.readLine()) != null) {
                
                //indiceTotal--;
                ligne = ligne.toLowerCase();
                for(indice = 0 ; indice < ligne.length() ; indice ++) {

                    lettre = ligne.charAt(indice);
                    if(lettre != ' '
                            && lettre != '.'
                            && lettre != ','
                            && lettre != ';'
                            && lettre != '!'
                            && lettre != '?'
                            && lettre != ':') {
                        mot += lettre;
                    } else {
                        aVerifier[indiceTotal] = mot;
                        mot = "";
                        indiceTotal ++;
                        nbrMots ++;
                    } 
                }
                
                if (mot != "" 
                        && mot != " "
                        && mot != "  ") {
                    aVerifier[indiceTotal] = mot;
                    mot = "";
                    indiceTotal ++;
                    nbrMots ++;
                }

            } // fin boucle
            
            aVerifier = Outil.trierTabMots(aVerifier, nbrMots);
            
            indiceTotal = 0;
            do {
                mot = aVerifier[indiceTotal];
                if (mot != "") {
                    flotSortie.println(mot);
                    
                }
                indiceTotal ++;
            } while (indiceTotal != nbrMots);
            
            // fermer les fichiers
            flotSortie.close();
            flotEntree.close();
            System.out.println("Le fichier " + nomFichierSortie + " a été créé");

        } catch (FileNotFoundException e) {
            System.err.println("Le chemin " + nomFichierEntree + " est invalide !"
                    + "\nnom incorrect ou droits insuffisants");
            e.printStackTrace();

        } catch (IOException e) {
            System.err.println("Le fichier n'est plus manipulable");
            e.printStackTrace();
        }
    }
    
    /** 
     * Trier un tableau de mot en fonction du nbr d'occurences d'un même mot
     * si un mot apparait 2 fois on en suprime un
     * attention tableau placé en argument modifié
     * @param aTrier tableau de mot(s)
     * @param nbrMots nombre de ligne qu'il y aura dans le fichier
     * @return aTrier tableau sans doubles mots
     */
    public static String[] trierTabMots(String[] aTrier, int nbrMots) {

        int ind1 = 0;
        String impossible = "";
        while (ind1 != nbrMots) {

            for (int ind2 = ind1+1; ind2 <= nbrMots && !(aTrier[ind1].equals(impossible)) ; ind2 ++) {
                if (aTrier[ind1].equals(aTrier[ind2])
                        && !(aTrier[ind1].equals(impossible))
                        && !(aTrier[ind2].equals(impossible))) {
                    aTrier[ind2] = impossible;
                }
            }
            ind1++;
        }
        return aTrier;
    }
}
