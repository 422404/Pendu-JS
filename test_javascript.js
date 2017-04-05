/*
Fait d'un mot un tableau à deux dimensions structuré comme suit:
tableau : { 
    motComplet : {'m', 'o', 't"} ,
    motNonComplet : {'_', 'o', '_'}
}
*/
function mot2tab(mot, ...indicesLettresCachees) {
    let tabMot = mot.split("");
    let tab_o_ = mot2_o_(mot, indicesLettresCachees);
    let tabFinal = [tabMot, tab_o_];
    
    return tabFinal;
}


/*
Renvoie le mot passé en paramètre avec des '_' aux indices spécifiés
dans le tableau indices en paramètres
*/
function mot2_o_(mot, indices) {
    let tabMot = mot.split("");
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
function afficherTabMot(tabMot, complet) {
    var indiceDimension = complet === true ? 0 : 1;
    var aAfficher = "";
    
    for (var indice = 0; indice < tabMot[0].length; indice++) {
        aAfficher += tabMot[indiceDimension][indice] + " ";
    }
    
    console.log(aAfficher);
}


var tableauMot = mot2tab("helloworld!", 4, 8, 10, 2);
afficherTabMot(tableauMot, true);
afficherTabMot(tableauMot, false);
