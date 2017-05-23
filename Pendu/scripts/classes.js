var DIFFICULTEE_FACILE = 0;
var DIFFICULTEE_MOYEN = 1;
var DIFFICULTEE_DIFFICILE = 2;

/****************** JeuPendu ************************/
var JeuPendu = class {
    // partieCourante: Partie
    
    /*
     * Constructeur de la classe JeuPendu
     */
    constructor() {}
    
    lancerPartie(difficultee) {
        window.controlesJeux.style.display = "block";
        window.choixDifficultee.style.display = "none";
       
	    window.rejouer.style.display = "none";
		window.changerDifficultee.style.display = "none";
		
		window.entree.style.display = "block";    
        window.attention.style.display = "none";
		
		window.gagnePerdu.innerHTML = "";
    
        this.partieCourante = new Partie(difficultee);
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
        var saisie = window.saisie.value;
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
                if (jeu.getPartieCourante().getDifficultee() == DIFFICULTEE_FACILE
                    && !lettreJouee) {
                    jeu.getPartieCourante().getGibet().ajouterPartie(1);
                } else if (jeu.getPartieCourante().getDifficultee() == DIFFICULTEE_MOYEN) {
                    jeu.getPartieCourante().getGibet().ajouterPartie(2);
                } else if (jeu.getPartieCourante().getDifficultee() == DIFFICULTEE_DIFFICILE) {
                    jeu.getPartieCourante().getGibet().ajouterPartie(4);
                }
            }
			
			jeu.getPartieCourante().afficherScore();
            jeu.getPartieCourante().afficherErreurs();
        } else if (saisie.length > 1) {
            motJuste = jeu.getPartieCourante().getMot().verifierMot(saisie);
            jeu.partieCourante.setScore(motJuste ? 10000 - jeu.getPartieCourante().getScore() * 10 - jeu.getPartieCourante().getGibet().getNbPartiesAffichees() * 20 : 0);
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
    // difficultee: int
    // score: int
    // mot: Mot
    // gibet: Gibet
    // lettresJouees: char[]
	// timerId: handle
	// temps: int
    
    /*
     * Constructeur de la classe Partie
     * difficultee : Difficultee de la partie
     */
    constructor(difficultee) {
        this.difficultee = difficultee;
        this.score = 0;
        this.mot = new Mot(difficultee);
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
        if (this.difficultee != DIFFICULTEE_DIFFICILE) {
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
     * Getter de l'attribut difficultee
     * retour: La valeur de difficultee
     */
    getDifficultee() {
        return this.difficultee;
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
        
        switch (this.difficultee) {
            case DIFFICULTEE_FACILE:
                erreurs = this.gibet.getNbPartiesAffichees();
				suffixe = "10";
                break;
            case DIFFICULTEE_MOYEN:
                erreurs = this.gibet.getNbPartiesAffichees() / 2;
				suffixe = "5";
                break;
            case DIFFICULTEE_DIFFICILE:
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
		window.changerDifficultee.style.display = "inline-block";
		
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
		}
        
        window.rejouer.onclick = function() {
            eval("jeu = new JeuPendu();"
                + "jeu.lancerPartie(" + jeu.getPartieCourante().getDifficultee()
                + ");");
        };
		
		window.changerDifficultee.onclick = function() {
		    jeu = new JeuPendu();
			window.controlesJeux.style.display = "none";
			window.choixDifficultee.style.display = "block";
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
    // difficultee: int
    
    /*
     * Constructeur de la classe Mot
     * difficultee: Difficultee de la partie, permet de choisir des mots
     *              rattachés a une certaine difficultee
     */
    constructor(difficultee) {
        this.difficultee = difficultee;
        this.fichierMots = new FichierMots(difficultee);
        this.motComplet = this.fichierMots.motAleatoire();
        this.motIncomplet = '';
        this.cacherLettres();
        
        console.log("Mot : " + this.motComplet + " Difficultee : " + difficultee);
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
        
        switch (this.difficultee) {
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
    // difficultee: int
    // xhrFichier: XMLHttpRequest
    
    /*
     * Constructeur de la classe FichierMots
     * difficultee: Difficultee de la partie, si 0 alors les mots seront pioches
     *              dans le fichier mots_facile.txt, etc...
     *              Doit etre dans 0..2
     */
    constructor(difficultee) {
        this.NOMS_FICHIERS = ["mots_facile.txt", "mots_moyen.txt", "mots_difficile.txt"];
        this.difficultee = difficultee;
        
        this.xhrFichier = new XMLHttpRequest();
    }
    
    /*
     * Renvoie un mot aleatoire depuis le fichier choisi en fonction de la difficultee
     * Retour: Mot aleatoire
     */
    motAleatoire() {
        // requete asynchrone
        this.xhrFichier.open("GET", this.NOMS_FICHIERS[this.difficultee], false);
        this.xhrFichier.send();
        
        if (this.xhrFichier.status == 0 || this.xhrFichier.status == 200) {
            var lignes = this.xhrFichier.responseText.split('\n');
            // on renvoie un mot aleatoire parmis ceux contenus dans le fichier
            return lignes[Math.floor(Math.random() * lignes.length)];
        } else {
            // exception ?
            console.log('erreur fichier');
            return "erreur";
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