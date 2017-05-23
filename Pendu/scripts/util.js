/*
 * Quand on appuie sur entree c'est comme si on appuyait sur le bouton confirmer
 * Quand une saisie est superieure a une lettre, on averti l'utilisateur sur ce
 * qui se passera
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
 * Donne le focus sur le champ de saisie
 */
function focusSaisie() {
    window.saisie.focus();
}


		//JavaScript
function show(idFenetre, idWrapper, state){
	// console.log(idFenetre + ' ' + idWrapper + ' ' + state)
	document.getElementById(idFenetre).style.display = state;			
	document.getElementById(idWrapper).style.display = state; 			
}