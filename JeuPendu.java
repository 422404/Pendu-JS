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
     * <p>Le tableau mots est un champs de classe</p>
     * @param difficultee Difficultee de la partie, influe
     *                    sur le type de mot renvoyé
     * @return Tableau de caracteres representant le mot
     *         decoupe
     */
    private static char[] trouverMot(int difficultee) {
        char[] motChoisi = {'e', 'l', 'y', 'a', 'n'};
        // TODO finir le corps
        return motChoisi;
    }
    
    
    
    
    
    
    
}
