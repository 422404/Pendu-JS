/*
 * Jeu du pendu en JavaScript
 * Pierre Romestant, Elyan Poujol, Morgane Tuffery, Aleksandr Vassilyev
 */

/*
 * si l'utilisateur s'est deja connecte dans cette session du navigateur
 * on le reconnecte avec son pseudo et son mot de passe absolument
 * pas securise...
 */
function reconnecter() {
    var id = sessionStorage.getItem("penduID");
    var pass = sessionStorage.getItem("penduPASS");
    
    if (id != null && pass != null) {
        connexion(false, id, pass);
    }
}


/*
 * On supprime son pseudo et son mot de passe du stockage de session
 * on recharge ensuite la page pour que le changement soit effectif
 */
function deconnecter() {
    sessionStorage.removeItem("penduID");
    sessionStorage.removeItem("penduPASS");
    location.reload();
}


/*
 * Quand on appuie sur entree c'est comme si on appuyait sur le bouton confirmer
 * Quand le texte saisi est d'une longueur superieure a une lettre, on averti 
 * l'utilisateur sur ce qui se passera si il gagne ou si il perd
 */
function keyDownHandler(e) {
    // megastuce/magie noire
    // window.saisie.value.length n'avais pas le temps de s'incrementer
    setTimeout(function() {
        if (e.keyCode == 13) {
            window.confirmationSaisie.onclick();
        } else {
            if (window.saisie.value.length > 1) {
                window.attention.style.display = "inline-block";
            } else {
                window.attention.style.display = "none";
            }
        }
    }, 50);
}


/*
 * Donne le focus sur le champ de saisie du mot recherche
 */
function focusSaisie() {
    window.saisie.focus();
}


/*
 * Affiche ou cache un popup en modifiant l'affichage de l'element parent de son
 * contenu
 * idFenetre: element parent du contenu du popup
 * ifFond: TODO enlever
 * etatDisplay: etat de l'affichage du popup, voir l'attribut display en CSS pour
 *              voir ses valeurs possibles
 */
function show(idFenetre, state){
    document.getElementById(idFenetre).style.display = state;           
    window.fondPopup.style.display = state;           
}


/*
 * ferme les popups
 */
function fermerPopup() {
    show("fenetreScore", "none");
    show("fenetreConnexion", "none");
    show("fenetreInscription", "none");
    show("fenetreAide", "none");
    show("fenetreNous", "none");
}


/*
 * Affiche la fenetre de connexion et donne le focus au champs de saisie du pseudo
 */
function afficherConnexion() {
    show('fenetreConnexion', 'block');
    window.pseudo.focus();
}


/*
 * Affiche la fenetre d'inscription et donne le focus au champs de saisie du pseudo
 */
function afficherInscription() {
    show('fenetreInscription', 'block');
    window.inscriptionPseudo.focus();
}


/*
 * Authentifie l'utilisateur et affiche son niveau et son score global
 * ui: True si la connection se fait depuis l'interface
 *     sinon false si elle se fait de maniere automatique
 * id: pseudo de l'utilisateur a specifier si ui == false
 * pass: mot de passe de l'utilisateur a specifier si ui == false
 */
function connexion(ui, id, pass) {
    if (ui) {
        utilisateur.setPseudo(window.pseudo.value);
        utilisateur.setMotDePasse(window.pass.value);
    } else {
        utilisateur.setPseudo(id);
        utilisateur.setMotDePasse(pass);
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", SITE_URL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                window.connexionEchouee.innerHMTL = "";
                utilisateur.setAuthentifie(true);
                
                var stats = JSON.parse(xhr.responseText);
                
                utilisateur.setNiveau(stats.niveau);
                utilisateur.setScore(stats.score);
                
                // heureusement que se n'est pas un projet sur la securite des donnees...
                sessionStorage.setItem("penduID", utilisateur.getPseudo());
                sessionStorage.setItem("penduPASS", utilisateur.getMotDePasse());
                
                window.connexionInscription.style.display = "none";
                window.infoUtilisateur.style.display = "block";
                
                // affichage dans le coin superieur droit
                utilisateur.afficherStats();
                
                if (ui) {
                    show('fenetreConnexion', 'none');
                }
            } else {
                if (ui) {
                    window.connexionEchouee.innerHTML = "Mauvais pseudo ou mot de passe";
                }
            }
        }
    }
    
    xhr.send("type=compte&id=" + utilisateur.getPseudo() 
             + "&pass=" + utilisateur.getMotDePasse() 
             + "&action=connect");
}


/*
 * S'assure que l'utilisateur est connecte est affiche ces parties jouees
 * si il en a faite
 */
function listerParties() {
    if (utilisateur.estConnecte()){
        var xhr = new XMLHttpRequest();
        
        xhr.open("POST", SITE_URL, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var parties = JSON.parse(xhr.responseText);
                    var partiesTable = "<table id=\"tabListeParties\">";
                    var difficulte = "";
                    
                    for (var i = 0; i < parties.length; i++) {
                        switch (parties[i].difficulte) {
                            case 0: difficulte = "facile";
                                    break;
                                    
                            case 1: difficulte = "moyen";
                                    break;
                                    
                            case 2: difficulte = "difficile";
                                    break;
                        }
                        
                        partiesTable += "<tr><td>mot : "
                                     + parties[i].mot
                                     + "</td><td>"
                                     + difficulte
                                     + "</td><td>"
                                     + parties[i].score
                                     + "&nbsp;pts</td></tr>";
                    }
                    window.listeParties.innerHTML = partiesTable + "</table>";
                } else if (xhr.status == 400) {
                    window.listeParties.innerHTML = "Vous n'avez fait aucunes parties";
                } else {
                    window.listeParties.innerHTML = "Erreur du serveur";
                }
                show('fenetreListeParties', 'block');
            }
        }
        
        xhr.send("type=compte&id=" + utilisateur.getPseudo() 
                 + "&pass=" + utilisateur.getMotDePasse() 
                 + "&action=get-scores");
    } else {
        // impossible normalement
        console.log("pas connecte");
    }
}


/*
 * S'assure que les informations necessaires a l'inscription de l'utilisateur
 * respectent le format voulu (pseudo >= 3 lettres et mot de passe >= 7 lettres)
 * et demande son inscription dans les comptes côte serveur
 * Si l'inscription a ete reussie on connecte l'utilisateur
 */
function inscription() {
    if (window.inscriptionPseudo.value.length >= 3
        && window.inscriptionPass.value.length >= 7) {
    
        if (window.inscriptionPass.value == window.inscriptionPass2.value) {
    
            utilisateur.setPseudo(window.inscriptionPseudo.value);
            utilisateur.setMotDePasse(window.inscriptionPass.value);
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", SITE_URL, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        window.inscriptionEchouee.innerHMTL = "";
                        utilisateur.setAuthentifie(true);
                        
                        utilisateur.setNiveau(0);
                        utilisateur.setScore(0);
                        
                        // heureusement que se n'est pas un projet sur la securite des donnees...
                        sessionStorage.setItem("penduID", utilisateur.getPseudo());
                        sessionStorage.setItem("penduPASS", utilisateur.getMotDePasse());
                        
                        window.connexionInscription.style.display = "none";
                        window.infoUtilisateur.style.display = "block";
                        
                        // affichage dans le coin superieur droit
                        utilisateur.afficherStats();
                        
                        show('fenetreInscription', 'none');
                    } else {
                        switch (xhr.status) {
                            case 481: // deja traite par le js
                                window.inscriptionEchouee.innerHTML = "Veuillez respecter le format des champs";
                                break;
                                
                            case 500:
                                window.inscriptionEchouee.innerHTML = "Erreur du serveur";
                                break;
                                
                            case 480:
                                window.inscriptionEchouee.innerHTML = "Pseudo déja utilisé";
                        }   
                        window.inscriptionPass.value = "";
                        window.inscriptionPass2.value = "";
                    }
                }
            };
            
            xhr.send("type=inscription&id=" + utilisateur.getPseudo() 
                     + "&pass=" + utilisateur.getMotDePasse());
        } else {
            // probleme mot de passe
            window.inscriptionEchouee.innerHTML = "Les mots de passe sont différents";
            window.inscriptionPass.value = "";
            window.inscriptionPass2.value = "";
        }
    } else {
        // probleme champs
        window.inscriptionEchouee.innerHTML = "Veuillez respecter le format des champs";
        window.inscriptionPass.value = "";
        window.inscriptionPass2.value = "";
    }
}


/*
 * Liste les 10 meilleurs joueurs suivant leur score global
 */
function listerHighscores() {
    var xhr = new XMLHttpRequest();
    
    xhr.open("POST", SITE_URL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var highscores = JSON.parse(xhr.responseText);
                var scoresTable = "<table id=\"tabListeScores\">";
                
                for (var i = 0; i < highscores.length; i++) {
                    scoresTable += "<tr><td>"
                                 + highscores[i].pseudo
                                 + "</td><td>-</td><td>"
                                 + highscores[i].score
                                 + "</td></tr>";
                }
                window.listeScores.innerHTML = scoresTable + "</table>";
            } else {
                window.listeScores.innerHTML = "Problème de récupération du top 10 des joueurs";
            }
            show('fenetreScore', 'block');
        }
    }
    xhr.send("type=highscores");
}