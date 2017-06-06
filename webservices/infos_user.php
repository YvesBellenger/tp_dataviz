<?php
	// Le tableau de résultat
	$result_request = array();
	
	/*
		On teste si le paramètre GET existe
		0 -> tous les utilisateurs
		id_unique -> un seul utilisateur
		plusieurs id séparés par des virgules -> plusieurs utilisateurs
	*/
	if(isset($_GET['user'])) {
		// Connexion à la BDD
		include("../bdd/connexion_bdd.php");
		
		$user = $_GET['user'];
	
		$query = "SELECT id, pseudo, password, email, photo, date_inscription, age, sexe
				FROM utilisateurs";
		if($user != 0) {
			$query = $query." WHERE id IN (".$user.")";
		}
		
		$result = mysqli_query($conn, $query);
	
		while ($row = mysqli_fetch_array($result)) {
			$result_request[] = array(intval($row[0]), $row[1], $row[2], $row[3], intval($row[4]), $row[5], intval($row[6]), intval($row[7]));
		}

		mysqli_free_result($result);
	
		// Déconnexion de la BDD
		include("../bdd/deconnexion_bdd.php");
	}
	
	// Renvoyer le résultat au javascript
	echo json_encode($result_request);

?>