/*
 * Jeu du pendu en JavaScript
 * Pierre Romestant, Elyan Poujol, Morgane Tuffery, Aleksandr Vassilyev
 */

var DIFFICULTE_FACILE = 0;
var DIFFICULTE_MOYEN = 1;
var DIFFICULTE_DIFFICILE = 2;

var SITE_URL = "http://localhost:8080/";


/****************** JeuPendu ************************/
var JeuPendu = class {
    // partieCourante: Partie
    
    /*
     * Constructeur de la classe JeuPendu
     */
    constructor() {}
    
    lancerPartie(difficulte) {
        window.controlesJeux.style.display = "block";
        window.choixdifficulte.style.display = "none";
       
        window.rejouer.style.display = "none";
        window.changerdifficulte.style.display = "none";
        
        window.entree.style.display = "block";    
        window.attention.style.display = "none";
        
        window.gagnePerdu.innerHTML = "";
    
        this.partieCourante = new Partie(difficulte);
        JeuPendu.resetSaisie();
        window.confirmationSaisie.onclick = JeuPendu.saisieHandler;
        focusSaisie();
    }
    
    /*
     * Renvoie la partie courante
     * Retour: la référence de la partie courante
     */
    getPartieCourante() {
        return this.partieCourante;
    }
    
    /*
     * Handler de l'appui sur le bouton de confirmation de la saisie
     * Executera la verification des entrees
     */
    static saisieHandler() {
        var saisie = window.saisie.value.toLowerCase();
        var occ;
        var motJuste;
        var tableauLettresJouees;
        var lettreJouee = false;
        
        if (saisie.length === 1) {
            occ = jeu.getPartieCourante().getMot().verifierLettre(saisie);
            jeu.getPartieCourante().setScore(jeu.getPartieCourante().getScore() + occ * 100);
            
            // on ajoute la lettre jouee a la liste des lettres jouees si on l'a
            // pas deja joue
            tableauLettresJouees = jeu.getPartieCourante().getLettresJouees();
            for (var i = 0; i < tableauLettresJouees.length; i++) {
                if (tableauLettresJouees[i] == saisie) {
                    lettreJouee = true;
                }
            }
            if (!lettreJouee) {
                // affiche les lettres
                jeu.getPartieCourante().ajouterLettresJouees(saisie);
            }
            
            // si la lettre ne figure pas dans le mot
            if (occ == 0) {
                if (jeu.getPartieCourante().getDifficulte() == DIFFICULTE_FACILE
                    && !lettreJouee) {
                    jeu.getPartieCourante().getGibet().ajouterPartie(1);
                } else if (jeu.getPartieCourante().getDifficulte() == DIFFICULTE_MOYEN) {
                    jeu.getPartieCourante().getGibet().ajouterPartie(2);
                } else if (jeu.getPartieCourante().getDifficulte() == DIFFICULTE_DIFFICILE) {
                    jeu.getPartieCourante().getGibet().ajouterPartie(4);
                }
            }
            
            jeu.getPartieCourante().afficherScore();
            jeu.getPartieCourante().afficherErreurs();
        } else if (saisie.length > 1) {
            motJuste = jeu.getPartieCourante().getMot().verifierMot(saisie);
            jeu.partieCourante.setScore(motJuste ? 5000 - jeu.getPartieCourante().getScore() * 10 - jeu.getPartieCourante().getGibet().getNbPartiesAffichees() * 20 : 0);
            Partie.finPartie(motJuste, jeu.getPartieCourante().getScore(), jeu.getPartieCourante().getGibet().getNbPartiesAffichees());
        }
        JeuPendu.resetSaisie();
        
        if (jeu.getPartieCourante().getMot().isFini()) {
            Partie.finPartie(true, jeu.getPartieCourante().getScore(), 
                             jeu.getPartieCourante().getGibet().getNbPartiesAffichees());
        } else if (jeu.getPartieCourante().getGibet().isFini()) {
            Partie.finPartie(false, jeu.getPartieCourante().getScore(), 
                             jeu.getPartieCourante().getGibet().getNbPartiesAffichees());
        }
    }

    /*
     * Vide le champ de saisie de texte
     */
    static resetSaisie() {
        window.saisie.value = '';
    }
}

var jeu = new JeuPendu();

/****************************************************/

/****************** Partie **************************/
var Partie = class {
    // difficulte: int
    // score: int
    // mot: Mot
    // gibet: Gibet
    // lettresJouees: char[]
    // timerId: handle
    // temps: int
    
    /*
     * Constructeur de la classe Partie
     * difficulte : difficulte de la partie
     */
    constructor(difficulte) {
        this.difficulte = difficulte;
        this.score = 0;
        this.mot = new Mot(difficulte);
        this.gibet = new Gibet();
        this.lettresJouees = [];
        
        this.afficherMotIncomplet();
        this.afficherScore();
        this.afficherErreurs();
        
        this.temps = 0;
        // on incremente le compteur de secondes... toutes les secondes...
        this.timerId = setInterval(function() {jeu.getPartieCourante().incTemps();}, 1000);
    }
    
    /*
     * Retourne l'handle du timer de temps de jeu
     * Retour: l'handle du timer
     */
    getTimerId() {
        return this.timerId
    }
    
    /*
     * Incremente le temps de jeu de 1 seconde
     */
    incTemps() {
        this.temps++;
    }
    
    /*
     * Renvoie le temps
     * Retour: Nombre de secondes
     */
    getTemps() {
        return this.temps;
    }
    
    /*
     * Renvoie les lettres deja entrees
     * Retour: La reference vers le tableau des lettres entrees
     */
    getLettresJouees() {
        return this.lettresJouees;
    }
    
    /*
     * Ajoute une lettre a la liste des lettres jouees et affiche la liste
     * lettre: lettre a ajouter
     */
    ajouterLettresJouees(lettre) {
        this.lettresJouees.push(lettre);
        if (this.difficulte != DIFFICULTE_DIFFICILE) {
            window.conteneurLettresJouees.innerHTML += lettre + "  ";
        }
    }
    
    /*  
     * Renvoie le mot qui est cherche durant la partie
     * Retour: La référence vers le mot
     */
    getMot() {
        return this.mot;
    }
    
    /*
     * Renvoie le gibet construit durant la partie
     * Retour: La référence 
     */
    getGibet() {
        return this.gibet;
    }
    
    /*
     * Getter de l'attribut difficulte
     * retour: La valeur de difficulte
     */
    getDifficulte() {
        return this.difficulte;
    }
    
    /*
     * Getter de l'attribut score
     * retour: La valeur de score
     */
    getScore() {
        return this.score;
    }
    
    /*
     * Setter de l'attribut score
     * nouveauScore: nouvelle valeur de l'attribut score
     */
    setScore(nouveauScore) {
        this.score = nouveauScore;
    }
    
    /*
     * Affiche le mot complet
     */
    afficherMotComplet() {
        var mot = this.mot.toString(true).split('');
        window.conteneurMot.innerHTML = "Mot : " + mot.join(' ');
    }
    
    /*
     * Affiche le mot incomplet
     */
    afficherMotIncomplet() {
        var mot = this.mot.toString(false).split('');
        window.conteneurMot.innerHTML = "Mot : " + mot.join(' ');
    }
    
    /*
     * Affiche le score
     * suffixe: Suffixe affiche si non undefined
     */
    afficherScore(suffixe) {
        window.conteneurScore.innerHTML = "Score : " + this.score + (typeof suffixe != "string" ? " pts" : suffixe);
    }
    
    /*
     * Affiche les erreurs
     */
    afficherErreurs() {
        var erreurs = 0;
        var suffixe = "";
        
        switch (this.difficulte) {
            case DIFFICULTE_FACILE:
                erreurs = this.gibet.getNbPartiesAffichees();
                suffixe = "10";
                break;
            case DIFFICULTE_MOYEN:
                erreurs = this.gibet.getNbPartiesAffichees() / 2;
                suffixe = "5";
                break;
            case DIFFICULTE_DIFFICILE:
                erreurs = Math.ceil(this.gibet.getNbPartiesAffichees() / 4);
                suffixe = "3";
        }
        window.conteneurErreurs.innerHTML = "Erreurs : " + erreurs + " / " + suffixe;
    }
    
    /*
     * Met fin a la partie et affiche le score et les erreurs ainsi que le mot complet
     * Affiche le bouton "REJOUER"
     * gagne: True si le joueur a gagne, sinon false
     * score: Score du joueur
     * erreurs: Nombre d'erreurs du joueur
     */
    static finPartie(gagne, score, erreurs) {
        var temps;
        
        // on stope le compteur de temps
        clearInterval(jeu.getPartieCourante().getTimerId());
        
        window.gagnePerdu.innerHTML = gagne ? "Félicitations ! :^)" : "Une autre fois peut-être :)";
        jeu.getPartieCourante().afficherMotComplet();

        window.rejouer.style.display = "inline-block";
        window.changerdifficulte.style.display = "inline-block";
        
        window.entree.style.display = "none";    
        window.attention.style.display = "none";
        
        window.conteneurLettresJouees.innerHTML = "";
        
        if (gagne) {
            // calcul du score final, on ajoute le bonus lié au temps
            temps = jeu.getPartieCourante().getTemps();
            if (temps <= 10) {
                score += 5000;
                jeu.getPartieCourante().setScore(score);
                jeu.getPartieCourante().afficherScore(" pts <span style=\"color: green\">(bonus temps : +5000 pts)</span>");
            } else if (temps <= 60) {
                score += 2000;
                jeu.getPartieCourante().setScore(score);
                jeu.getPartieCourante().afficherScore(" pts <span style=\"color: green\">(bonus temps : +2000 pts)</span>");
            } else if (temps <= 120) {
                score += 500;
                jeu.getPartieCourante().setScore(score);
                jeu.getPartieCourante().afficherScore(" pts <span style=\"color: green\">(bonus temps : +500 pts)</span>");
            }
        } else {
            jeu.getPartieCourante().setScore(0);
            jeu.getPartieCourante().afficherScore();
        }
        
        
        // on sauvegarde le score si l'utilisateur est connecte
        if (utilisateur.estConnecte()) {
            var xhr = new XMLHttpRequest();
        
            xhr.open("POST", "http://localhost:8080/", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log("partie sauvée");
                    // on met a jour l'affichage
                    var scoreGlobal = utilisateur.getScore() + jeu.getPartieCourante().getScore();
                    var niveau = Math.floor(scoreGlobal / 10000);
                    utilisateur.setNiveau(niveau);
                    utilisateur.setScore(scoreGlobal);
                    utilisateur.afficherStats();
                }
            };
            
            xhr.send("type=compte&id=" + utilisateur.getPseudo() 
                     + "&pass=" + utilisateur.getMotDePasse() 
                     + "&action=add-score&mot=" 
                     + jeu.getPartieCourante().getMot().toString(true)
                     + "&difficulte=" + jeu.getPartieCourante().getDifficulte()
                     + "&score=" + jeu.getPartieCourante().getScore());
        }
        
        window.rejouer.onclick = function() {
            eval("jeu = new JeuPendu();"
                + "jeu.lancerPartie(" + jeu.getPartieCourante().getDifficulte()
                + ");");
        };
        
        window.changerdifficulte.onclick = function() {
            jeu = new JeuPendu();
            window.controlesJeux.style.display = "none";
            window.choixdifficulte.style.display = "block";
            window.img_pendu.src = "images/10.png";
        }
    }
}
/****************************************************/

/****************** Mot *****************************/
var Mot = class {
    // motComplet: String
    // motIncomplet: String
    // fichierMots: FichierMots
    // difficulte: int
    
    /*
     * Constructeur de la classe Mot
     * difficulte: difficulte de la partie, permet de choisir des mots
     *              rattachés a une certaine difficulte
     */
    constructor(difficulte) {
        this.difficulte = difficulte;
        this.fichierMots = new FichierMots(difficulte);
        this.motComplet = this.fichierMots.motAleatoire();
        this.motIncomplet = '';
        this.cacherLettres();
        
        console.log("Mot : " + this.motComplet + " difficulte : " + difficulte);
    }
    
    /*
     * Renvoie une chaine de caracteres representant le mot
     * motComplet: Renvoie le complet si true ou si pas de parametres
     *             sinon renvoie le mot incomplet
     */
    toString(motComplet) {
        if (typeof motComplet != "boolean" || motComplet === true) {
            return this.motComplet;
        } else {
            return this.motIncomplet;
        }
    }
    
    /*
     * Vérifie si la lettre est presente dans le mot de cette instance et
     * affiche la/les lettre(s)
     * lettre: Lettre qui sera testee
     * retour: Le nombre de fois que le mot contient la lettre
     *         Retourne -1 en cas de probleme d'argument
     */
    verifierLettre(lettre) {
        var nbOccurences = 0;
        var motDecompose = this.motIncomplet.split('');
    
        if (lettre.length === 1) {
            for (var i = 0; i < this.motComplet.length; i++) {
                if (this.motComplet.charAt(i) == lettre
                    // seules les lettres cachees doivent etre testees...
                    && this.motIncomplet.charAt(i) == '_') {
                    
                    motDecompose[i] = this.motComplet.charAt(i);
                    nbOccurences++;
                }
            }
            
            this.motIncomplet = motDecompose.join('');
            jeu.getPartieCourante().afficherMotIncomplet();
            return nbOccurences;
        }
        // exception ?
        return -1;      
    }
    
    /*
     * Vérifie si le mot est equivalant au mot de cette instance
     * lettre: Mot qui sera teste
     * retour: True si le mot est equivalant, sinon false
     */
    verifierMot(mot) {
        return mot == this.motComplet;
    }
    
    /*
     * Cache certaine lettres du mot
     * En facile: affichage de la premiere lettre  et de toutes celles comme 
     *            elle si il y en a plusieurs
     * En moyen: affichage d'une lettre a un indice aleatoire et de toutes 
     *           celles comme elle si il y en a plusieurs
     * En difficile: Pas d'affichage de lettres
     */
    cacherLettres() {
        var indice;
        var lettreEpargnee;
        var motDecompose = this.motComplet.split('');
        
        switch (this.difficulte) {
            case 0: // facile
                indice = 0;
                break;
            
            case 1: // moyen
                indice = Math.floor((Math.random() * (this.motComplet.length - 1)) + 1);
                break;
            
            case 2: // difficile
                    // falls through
            default:
                indice = -1;
        }
        
        if (indice >= 0) {
            lettreEpargnee = motDecompose[indice];
        } else {
            lettreEpargnee = '\0';
        }
        
        for (var i = 0; i < this.motComplet.length; i++) {
            if (motDecompose[i] != lettreEpargnee) {
                motDecompose[i] = '_';
            }
        }
        
        this.motIncomplet = motDecompose.join('');
    }
    
    /*
     * Indique si le mot est complet
     * Retour: True si toutes les lettres du mot on etees trouvees
     */
    isFini() {
        return this.motComplet == this.motIncomplet;
    }
}
/****************************************************/

/****************** FichierMots *********************/
var FichierMots = class {
    // NOMS_FICHIERS: String[]
    // difficulte: int
    // xhrFichier: XMLHttpRequest
    
    /*
     * Constructeur de la classe FichierMots
     * difficulte: difficulte de la partie, si 0 alors les mots seront pioches
     *              dans le fichier mots_facile.txt, etc...
     *              Doit etre dans 0..2
     */
    constructor(difficulte) {
        this.url = SITE_URL;
        this.difficulte = difficulte;
        
        this.xhrFichier = new XMLHttpRequest();
    }
    
    /*
     * Renvoie un mot aleatoire depuis le fichier choisi en fonction de la difficulte
     * Le fichier est stocke côte serveur
     * Retour: Mot aleatoire
     */
    motAleatoire() {
        // requete synchrone meme si c'est deprecie
        this.xhrFichier.open("POST", this.url, false);
        this.xhrFichier.send("type=mot&difficulte=" + this.difficulte);
        
        if (this.xhrFichier.status == 200) {
            return this.xhrFichier.responseText;
        } else {
            console.log('erreur fichier');
            return null;
        }
    }
}
/****************************************************/

/****************** Gibet ***************************/
var Gibet = class {
    // nbPartiesAffichees: int
    // parties: PartieGibet[]
    
    /*
     * Constructeur de la classe Gibet
     */
    constructor() {
        this.nbPartiesAffichees = 0
        this.parties = [];
        
        this.afficher();
    }
    
    /*
     * Affiche le tout premier stade du gibet (vide)
     */
    afficher() {
        window.img_pendu.src = "images/empty.png";
    }
    
    /*
     * Ajoute des parties au gibet
     * nbAAjouter: Nombre de partie a ajouter
     */
    ajouterPartie(nbAAjouter) {
        if (nbAAjouter <= 0 || this.nbPartiesAffichees >= 10) {
            return;
        } else if (nbAAjouter + this.nbPartiesAffichees > 10) {
            nbAAjouter = 10 - this.nbPartiesAffichees;
        }
        
        for (var i = 0; i < nbAAjouter; i++) {
            this.parties.push(new PartieGibet(++this.nbPartiesAffichees));
        }
    }
    
    /*
     * Getter pour l'attribut nbPartiesAffichees
     * Retour: Nombrede parties affichees
     */
    getNbPartiesAffichees() {
        return this.nbPartiesAffichees;
    }
    
    /*
     * Indique si le gibet est complet
     * Retour: True si toutes les parties du gibet sont affichees
     */
    isFini() {
        return this.nbPartiesAffichees == 10;
    }
}
/****************************************************/

/****************** PartieGibet *********************/
var PartieGibet = class {
    // pathImage: String
    // numeroPartie: int
    
    /*
     * constructeur de la classe PartieGibet
     */
    constructor(numeroPartie) {
        this.numeroPartie = numeroPartie;
        this.pathImage = "images/" + this.numeroPartie + ".png";
        
        this.afficher();
    }
    
    afficher() {
        window.img_pendu.src = this.pathImage;
    }
}
/****************************************************/

/****************** Utilisateur *********************/
var Utilisateur = class {
    constructor() {
        this.pseudo = "";
        this.motDePasse = "";
        this.authentifie = false;
        this.niveau = 0;
        this.score = 0;
    }
    
    /*
     * Renvoie true si l'utilisateur est authentifie sinon false
     * Retour: true si l'utilisateur est authentifie sinon false...
     */
    estConnecte() {
        return this.pseudo != "" && this.motDePasse != "" 
               && this.authentifie;
    }
    
    /*
     * Setter de l'attribut pseudo
     * pseudo: nouveau pseudo
     */
    setPseudo(pseudo) {
        this.pseudo = pseudo;
    }
    
    /*
     * Renvoie pseudo de l'utilisateur
     * Retour: pseudo de l'utilisateur
     */
    getPseudo() {
        return this.pseudo;
    }
    
    /*
     * Setter de l'attribut motDePasse
     * motDePasse: nouveau mot de passe
     */
    setMotDePasse(motDePasse) {
        this.motDePasse = motDePasse;
    }
    
    /*
     * Renvoie le mot de passe de l'utilisateur
     * Retour: le mot de passe de l'utilisateur
     */
    getMotDePasse() {
        return this.motDePasse;
    }
    
    /*
     * Permet d'indiquer que l'utilisateur est authentifie
     * authenfie: true si l'utilisateur est authentifie sinon false
     */
    setAuthentifie(authentifie) {
        this.authentifie = authentifie;
    }
    
    /*
     * Renvoie le niveau de l'utilisateur
     * Retour: le niveau de l'utilisateur
     */
    getNiveau() {
        return this.niveau;
    }
    
    /*
     * Setter de l'attribut niveau
     * niveau: nouveau niveau
     */
    setNiveau(niveau) {
        this.niveau = niveau;
    }
    
    /*
     * Renvoie le score de l'utilisateur
     * Retour: le score de l'utilisateur
     */
    getScore() {
        return this.score;
    }
    
    /*
     * Setter de l'attribut score
     * score: nouveau score
     */
    setScore(score) {
        this.score = score;
    }
    
    
    /*
     * Affiche le pseudo, le niveau et le score de l'utilisateur dans la zone
     * superieure droite si l'utilisateur est authentifie
     */
    afficherStats() {
        if (this.estConnecte()) {
            window.pseudoUtilisateur.innerHTML = this.getPseudo();
            window.niveauUtilisateur.innerHTML = "Niv.&nbsp;" + this.getNiveau();
            window.scoreUtilisateur.innerHTML = this.getScore() + "&nbsp;pts";
        }
    }
}
/****************************************************/
var utilisateur = new Utilisateur();