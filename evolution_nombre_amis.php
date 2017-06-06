<!DOCTYPE html>
<html>
<head>
	<title>Data Vizualisation - TP1</title>
	<!-- Inclusion CSS (librairie + perso) -->
	<link rel="stylesheet" type="text/css" href="css/jquery.jqplot.min.css">
	<link rel="stylesheet" type="text/css" href="css/dataviz.css">

	<!-- Inclusion JS (librairie + scripts de création de graph) -->
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/jquery.jqplot.min.js"></script>

	<!-- <script type="text/javascript" src="js/dataviz.js"></script> -->
	<script type="text/javascript" src="js/evolution_nombre_amis.js"></script>

	<!-- Renderer : Utilisés pour générer les graphiques, n'inclure QUE ce dont vous avez besoin -->
	<script type="text/javascript" src="js/renderer/jqplot.dateAxisRenderer.js"></script>
	
</head>
<body>
	<?php include ('structure/header.php'); ?>
	<div id="content">

		<h2>Evolution du nombre d'amis au fil du mois</h2>

		<div class="plot" id="chart22" data-user-id="<?=$_GET['user_id']?>"></div>

	</div>
	<div class="plot" id ="chart1"></div>

	<?php include ('structure/footer.php'); ?>
</body>
</html>