function init() {
  // initialisations une fois que la page est chargée
  tableauMot = mot2tab("helloworld", 0, 2, 4, 5, 8);
  erreurs = 0;
  score = 0;
  afficher("score :  0", "score");
  afficher("erreurs : 0", "erreurs");
  afficher("mot : " + mot2String(tableauMot, false), "mot");
}


/*
Fait d'un mot un tableau à deux dimensions structuré comme suit:
tableau : { 
    motcomplet : {'m', 'o', 't"} ,
    motNoncomplet : {'_', 'o', '_'}
}
*/
function mot2tab(mot, ...indicesLettresCachees) {
  var tabMot = mot.split("");
  var tab_o_ = mot2_o_(mot, indicesLettresCachees);
  var tabFinal = [tabMot, tab_o_];
    
  return tabFinal;
}


/*
Renvoie le mot passé en paramètre avec des '_' aux indices spécifiés
dans le tableau indices en paramètres
*/
function mot2_o_(mot, indices) {
  var tabMot = mot.split("");
  for (var indice = 0; indice < indices.length; indice++) {
      if (indices[indice] < tabMot.length) {
          tabMot[indices[indice]] = "_";
      }
  }
    
  return tabMot;
}


/*
Affiche un mot dans le format "m o t" (un espace entre chaque lettre)
si le paramètre complet === true alors le mot complet sera affiché
sinon le mot avec les trous le sera
*/
function mot2String(tabMot, complet) {
    var indiceDimension = complet === true ? 0 : 1;
    var aAfficher = "";
    
    for (var indice = 0; indice < tabMot[0].length; indice++) {
        aAfficher += tabMot[indiceDimension][indice] + " ";
    }
    
    return aAfficher;
}


/*
Lit une lettre contenue dans un champs de texte et
vérifie qu'elle fait partie de l'intervalle donné : a-z (A-Z)
si la lettre en fait partie alors il sera vérifié qu'elle soit
contenue dans le mot a chercher
sinon un avertissement sera affiché
*/
function lireLettre() {
  var lettre = document.getElementById("lettre").value;
  var longueur = lettre.length;
  
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/RegExp
  var regex = /[a-zA-Z]{1}/g;
  
  if (longueur === 1
      && regex.test(lettre)) {
    
    var lettresRevelees = verifierLettre(tableauMot, lettre);
    if (lettresRevelees != 0) {
      score += lettresRevelees * 100;
      if (motValide(tableauMot)) {
        // partie gagnée
        finPartie(true);
      }
    } else {
      erreurs++;
      if (erreurs >= 10) {
        // partie perdue
        finPartie(false);
      }
    }
  }
  
  // on efface le contenu écrit précédement
  document.getElementById("lettre").value = "";
  
  // on affiche le score, le mot a completer ainsi que le nombre d'erreurs
  afficherMotScoreErreurs(tableauMot, score, erreurs);
}


/*
affiche un texte donné dans un element donné par son id
*/
function afficher(texte, element = "texte") {
  document.getElementById(element).innerHTML = texte;
}


/*
vérifie qu'une lettre donnée soit contenue au moins une fois
dans un mot donné
decouvre la lettre choisie du tableau de caracteres donné
renvoie true si la lettre etait au moins une fois dans mot
sinon false
*/
function verifierLettre(tabMot, lettre) {
  if (decouvrirLettre(tabMot, lettre) != 0) {
    return true;
  }

  return false;
}


/*
decouvre la lettre choisie du tableau de caracteres donne
renvoie 0 si la lettre n'est pas presente
*/
function decouvrirLettre(tabMot, lettre) {
  var lettresDecouvertes = 0;
        
  for (var indice = 0; indice < tabMot[0].length; indice++) {
    // quand la lettre est presente dans le mot on 
    // la place dans le mot caché
    if (tabMot[0][indice] == lettre
        && tabMot[1][indice] != lettre) {
        
      tabMot[1][indice] = lettre;
      lettresDecouvertes++;
    }
  }
        
  return lettresDecouvertes;
}


/*
affiche le score, le mot a completer ainsi que le nombre d'erreurs
*/
function afficherMotScoreErreurs(tabMot, score, erreurs) {
  afficher("mot : " + mot2String(tabMot, false), "mot");
  afficher("score : " + score, "score");
  afficher("erreurs : " + erreurs, "erreurs");
}


/*
verifie si le mot est complet
*/
function motValide(tabMot) {    
  for (var indice = 0; indice < tabMot[0].length; indice++) {
    if (tabMot[0][indice] != tabMot[1][indice]) {
      return false;
    }
  }
        
  return true;
}


/*
fini la partie
le parametre doit etre a true si le joueur a gagne sinon false
*/
function finPartie(aGagne) {
  alert(aGagne ? "GG!" : "N00B!");
  document.getElementById("confirmation").innerHTML = "rejouer";
  document.getElementById("confirmation").onclick = function() {
      window.location.reload();
  };
}