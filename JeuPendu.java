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
    
    /** tableau de mots a trouver */
    private static String[] mots = {"elyan", "test", "bonjour"};
    
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
        System.out.println("Jeu du pendu !\n");
        
        do {
            lancerPartie(FACILE);
        } while(rejouer());
        
        System.out.println("fin du jeu");
    }
    
    
    
    /**
     * Lance une nouvelle partie
     * @param difficultee Difficultee de la partie choisie
     */
    private static void lancerPartie(int difficultee) {
        System.out.println("hello");
        partieGagnee(1000);
        // TODO finir le corps
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
     * @param difficultee Difficultee de la partie, influe
     *                    sur le type de mot renvoye
     * @return Tableau de caracteres representant le mot
     *         decoupe, le tableau a deux dimensions,
     *         une pour le mot entier et une pour le mot
     *         avec certaines lettres remplacees par des '_'
     */
    private static char[][] trouverMot(int difficultee) {
        char[][] motChoisi = {{'e', 'l', 'y', 'a', 'n'},
                              {'_', '_', 'y', '_', '_'}};
        // TODO finir le corps
        return motChoisi;
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
     */
    private static void decouvrirLettre(char[][] mot, char lettre) {
        
        for (int indice = 0; indice < mot[0].length; indice++) {
            // quand la lettre est presente dans le mot on 
            // la place dans le mot cache
            if (mot[0][indice] == lettre) {
                mot[1][indice] = lettre;
            }
        }
    }
    
    
    
    /**
     * Demande la difficultee voulue a l'utilisaieur
     * @return Un int representant la difficultee,
     *         voir les champs de classe FACILE, MOYEN 
     *         et DIFFICILE
     */
    private static int choisirDifficultee() {
        // TODO finir le corps
        return FACILE;
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
        
        return lettre.charAt(0);
    }
    
    
    
    
}
