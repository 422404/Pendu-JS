/*
 * JeuPendu.java         01/04/2017
 * IUT de Rodez
 * Pas de copyright
 */

import java.util.Scanner;

/**
 * Jeu du pendu traditionnel mais sans interface
 * graphique
 * @author Elyan Poujol
 */
public class JeuPendu {
    /** scanner pour l'entree standard */
    private static Scanner entree = new Scanner(System.in);
    
    /** tableau de mots a trouver et leur version a completer */
    private static String[][] mots = {{"elyan", "appartement", "bonjour"},
                                      {"__y__", "_p__rt_____", "_______"}};
    
    /* niveaux de difficultee */
    private static final int FACILE = 0;
    private static final int MOYEN = 1;
    private static final int DIFFICILE = 2;



    /**
     * Lance une partie et demmande a en relancer
     * une autre a l'issue de la premiere
     * @param args non utilise
     */
    public static void main(String[] args) {
        int difficultee;
        
        System.out.println("Jeu du pendu !\n");
        
        do {
            difficultee = choisirDifficultee();
            lancerPartie(difficultee);
        } while(rejouer());
        
        System.out.println("fin du jeu");
    }
    
    
    
    /**
     * Lance une nouvelle partie
     * @param difficultee Difficultee de la partie choisie
     */
    private static void lancerPartie(int difficultee) {
        char[][] mot;
        char lettreSaisie;
        int score = 0;
        int erreurs = 0;
        
        
        System.out.println("Nouvelle partie lancee !");
        // le tableau mots est un champs de classe
        mot = trouverMot(mots, difficultee);
        
        switch (difficultee) {
            case FACILE   : System.out.println("difficultee : FACILE\n");
                            break;
            
            case MOYEN    : System.out.println("difficultee : MOYEN\n");
                            break;
            
            case DIFFICILE: System.out.println("difficultee : DIFFICILE\n");
                            break;
        }
        
        afficherMotScore(mot, score);
        
        do {
            lettreSaisie = demanderlettre();
            
            if (verifierLettre(mot, lettreSaisie)) {
                score += 10 * decouvrirLettre(mot, lettreSaisie);
            } else {
                erreurs++;
            }
            
            afficherMotScore(mot, score);
            System.out.println("erreurs : " + erreurs + "\n");
        } while (erreurs < 10 && !motValide(mot));
        
        if (erreurs < 10) {
            partieGagnee(score);
        } else {
            partiePerdue(score);
        }
    }
    
    
    
    /**
     * Demmande a l'utilisateur s'il souhaite rejouer
     */
    private static boolean rejouer() {
        int choix = -1;
        
        do {
            System.out.println("1 pour (re)jouer, 0 pour arreter");
            if (entree.hasNextInt()) {
                choix = entree.nextInt();
            }
            
            if (choix != 1 && choix != 0) {
                System.out.println("Veuillez entrer 1 ou 0");
                choix = -1;
            }
            
            entree.nextLine();
        } while(choix == -1);
        
        return choix == 1;
    }
    
    
    
    /**
     * Averti l'utilisateur qu'il a gagne la partie
     */
    private static void partieGagnee(int score) {
        System.out.println("**** PARTIE GAGNEE *** \n"
                           + " Score: "+ score + "\n");
    }
    
    
    
    /**
     * Averti l'utilisateur qu'il a perdu la partie
     */
    private static void partiePerdue(int score) {
        System.out.println("**** PARTIE PERDUE *** \n"
                           + " Score: "+ score + "\n");
    }
    

    
    /**
     * Tire aleatoirement un mot dans le tableau mots
     * et construit le tableau du mot non complet a afficher
     * <p>Le tableau mots est un champs de classe</p>
     * @param mots Tableau a deux dimension contenant des mots
     *             complets et leurs versions a completer
     * @param difficultee Difficultee de la partie, influe
     *                    sur le type de mot renvoye
     * @return Tableau de caracteres representant le mot
     *         decoupe, le tableau a deux dimensions,
     *         une pour le mot entier et une pour le mot
     *         avec certaines lettres remplacees par des '_'
     */
    private static char[][] trouverMot(String[][] mots, int difficultee) {
        // TODO faire plusieurs tableaux de chaque difficultee
        // TODO finir le corps
        
        return  convStringChar(mots, difficultee);
    }
    
    
    
    /**
     * Transforme un mot complet et son equivalant non complet presents
     * dans un tableau de string a deux dimensions en un tableau de
     * caracteres a deux dimensions
     * @param stringMots Tableau de String a deux dimensions
     * @param indice Indice des mots a convertir
     * @return Tableau de caracteres a deux dimensions
     */
    private static char[][] convStringChar(String[][] stringMots, int indice) {
        char[][] mot = new char[2][stringMots[0][indice].length()];
        
        for (int indiceMot = 0; indiceMot < stringMots[0][indice].length(); indiceMot++) {
            mot[0][indiceMot] = stringMots[0][indice].charAt(indiceMot);
            mot[1][indiceMot] = stringMots[1][indice].charAt(indiceMot);
        }
        
        return mot;
    }
    
    
    
    /**
     * Verifie que la lettre est contenue au moins une fois
     * dans le mot choisi
     * @param mot Tableau de caracteres representant le mot
     *            choisi
     * @param lettre Lettre a verifier
     * @return True si la lettre y est presente sinon false
     */
    private static boolean verifierLettre(char[][] mot, char lettre) {
        for (int indice = 0; indice < mot[0].length; indice++) {
            // si au moins une lettre est presente on renvoie true
            if (mot[0][indice] == lettre) {
                return true;
            }
        }
        
        return false;
    }
    
    
    
    
    /**
     * Decouvre la lettre choisie du tableau de caracteres donne
     * <p>La methode ne fais rien si la lettre n'est pas presente</p>
     * @param mot Tableau de caracteres representant le mot
     *            choisi
     * @param lettre Lettre a decouvrir
     * @return Nombre de lettres decouvertes
     */
    private static int decouvrirLettre(char[][] mot, char lettre) {
        int lettresDecouvertes = 0;
        
        for (int indice = 0; indice < mot[0].length; indice++) {
            // quand la lettre est presente dans le mot on 
            // la place dans le mot cache
            if (mot[0][indice] == lettre) {
                mot[1][indice] = lettre;
                lettresDecouvertes++;
            }
        }
        
        return lettresDecouvertes;
    }
    
    
    
    /**
     * Demande la difficultee voulue a l'utilisaieur
     * @return Un int representant la difficultee,
     *         voir les champs de classe FACILE, MOYEN 
     *         et DIFFICILE
     */
    private static int choisirDifficultee() {
        int choix = -1;
        
        do {
            System.out.println("Choisissez votre niveau de difficultee\n"
                               + "0 pour FACILE\n"
                               + "1 pour MOYEN\n"
                               + "2 pour DIFFICILE\n");
            if (entree.hasNextInt()) {
                choix = entree.nextInt();
            }
            
            if (choix != FACILE && choix != MOYEN && choix != DIFFICILE) {
                System.out.println("Veuillez entrer 0, 1 ou 2");
                choix = -1;
            }
            
            entree.nextLine();
        } while(choix == -1);
        
        return choix;
    }
    
    
    
    /**
     * Demande la saisie d'une lettre a verifier ulterieurement
     * @return Caratere etant la lettre entree
     */
    private static char demanderlettre() {
        String lettre = "\0";
        
        System.out.print("Veuillez saisir une lettre : ");
        if (entree.hasNext("[a-zA-Z]")) {
            lettre = entree.next();
        }
        entree.nextLine();
        System.out.print("\n");
        
        return lettre.charAt(0);
    }
    
    
    
    /**
     * Affiche le mot en phase de completion et le score de l'utilisateur
     * @param mot Mot a afficher
     * @param score Score de l'utilisateur
     */
    private static void afficherMotScore(char[][] mot, int score) {
        System.out.print("mot : ");
        afficherMot(false, mot);
        System.out.println("\nscore : " + score);
    }
    
    
    
    /**
     * Affiche soit le mot complet soit le mot en phase de completion
     * @param complet True si il faut afficher le mot complet sinon false
     * @param mot Mot a afficher
     */
    private static void afficherMot(boolean complet, char[][] mot) {
        StringBuilder motConcat = new StringBuilder();
        int dimension = complet ? 0 : 1;
        
        for (int indice = 0; indice < mot[0].length; indice++) {
            motConcat.append(mot[dimension][indice]).append(' ');
        }
        
        System.out.print(motConcat);
    }
    
    
    
    /**
     * Teste l'egalite entre le mot complet et celui a completer
     * @param mot Tableau a deux dimension contenant le mot a completer
     *            et le mot complet
     * @return True si les mots sont egaux sinon false
     */
    private static boolean motValide(char[][] mot) {
        for (int indice = 0; indice < mot[0].length; indice++) {
            if (mot[0][indice] != mot[1][indice]) {
                return false;
            }
        }
        
        return true;
    }
}
