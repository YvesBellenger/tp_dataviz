$(document).ready(function(){
	// Pas de cache sur les requête IMPORTANT !
	$.ajaxSetup({ cache: false });
	
	/*** 
		On définit ici les fonctions de base qui vont nous servir à la récupération des données
		Je ne définis que le GET ici, mais il est possible d'utiliser POST pour récupérer ses données (on le verra dans un prochain TP)
	****/
	function getRequest(url, callback) {
		$.get(url, function(data) {
			data = $.parseJSON(data);
			callback(data);
		});
	}
	
	/***************************************
		QUESTION 1 : PIE CHART : Visite par marque
	****************************************/
	getRequest("webservices/infos_user.php?user=2", function(data) {
		console.log(data);
	});

	/*********************************************************
	 	Graph représentant le % de messages aux amis/non amis
	 **********************************************************/
	var user_id =  $('#chart31').data('user-id');
	var amis;
	var messages;
	jQuery.ajax({
		type: "GET",
		url: "/webservices/messages_user.php?user="+user_id
	}).done(function (data) {
		messages = $.parseJSON(data);
		console.log(messages);
		jQuery.ajax({
			type: "GET",
			url: "/webservices/liste_amis_user.php?user="+user_id
		}).done(function (data) {
			amis = $.parseJSON(data);
			var messages_amis = 0;
			var messages_non_amis = 0;
			for (var i = 0; i < messages.length; i++) {
				for (var j = 0; j < amis.length; j++) {
					if ((messages[i][0] == amis[j][0] || messages[i][1] == amis[j][1]) || (messages[i][0] == amis[j][1] || messages[i][1] == amis[j][0])) {
						messages_amis++;
						break;
					} else {
						messages_non_amis++;
						break;
					}
				}
			}

			$.jqplot.config.enablePlugins = true;
			var s1 = [(messages_amis / messages.length) * 100, (messages_non_amis / messages.length) * 100];
			var ticks = ['Messages amis', 'Messages non amis'];

			plot1 = $.jqplot('chart31', [s1], {
				animate: !$.jqplot.use_excanvas,
				seriesDefaults: {
					renderer: $.jqplot.BarRenderer,
					pointLabels: {show: true, formatString: '%d'}
				},
				axes: {
					xaxis: {
						renderer: $.jqplot.CategoryAxisRenderer,
						ticks: ticks
					}
				},
				highlighter: {show: false}
			});
			/*****
			 * Permet de cliquer sur les barres pour afficher des détails
			 */
			$('#chart31').bind('jqplotDataClick',
				function (ev, seriesIndex, pointIndex, data) {
					$('#info31').html('valeur: '+data[1]+' %');
				}
			);
		});
	});
	/*************************************************************
	 * FIN GRAPH
	 ************************************************************/

	/*********************************************************
	 Graph représentant l'évolution de la popularité de la photo
	 **********************************************************/
	var user_id =  $('#chart32').data('user-id');
	var notations;
	jQuery.ajax({
		type: "GET",
		url: "/webservices/notations_user.php?user="+user_id
	}).done(function (data) {
		notations = $.parseJSON(data);
		notations.sort(function(a, b) {
			var dt1 = Date.parse(a[3]);
			var dt2 = Date.parse(b[3]);

			if (dt1 < dt2) return -1;
			if (dt2 < dt1) return 1;
			return 0;
		});
		for (var i = 0; i<notations.length; i++) {
			notations[i].reverse();
			if (i > 0 && notations[i][0] == notations[i-1][0]) {
				notations[i][2] = (notations[i-1][1] + notations[i][1]) / 2;
				delete notations[i-1];
			}
			delete notations[i][2];
			delete notations[i][3];
		}
		notations = notations.filter(function(n){return n !== undefined});

		var plot1 = $.jqplot('chart32', [notations], {
			axes:{
				xaxis:{
					renderer:$.jqplot.DateAxisRenderer
				},
				yaxis: {
					min: 0,
					max: 5
				}
			},
			series:[{lineWidth:4, markerOptions:{style:'square'}}]
		});
	});
	/***************************************
	 * FIN DE GRAPH
	 ***************************************/

	function generatePieChart(idDiv, data) {
		// On génère l'exemple du TP :
		var plot1 = $.jqplot(idDiv, [data], {
			gridPadding: {top:0, bottom:38, left:0, right:0},
			seriesDefaults:{
				renderer:$.jqplot.PieRenderer,
				trendline:{ show:false },
				rendererOptions: { padding: 8, showDataLabels: true, sliceMargin: 6, startAngle: -90 }
			},
			legend:{
				show:true,
				placement: 'inside',
				rendererOptions: {
					numberRows: 3
				},
				location:'ne',
				marginTop: '15px'
			}
		});
	}

	function generateBarChart(idDiv, data) {
		plot1 = $.jqplot(idDiv, [data[0]], {
			// Only animate if we're not using excanvas (not in IE 7 or IE 8)..
			animate: !$.jqplot.use_excanvas,
			seriesDefaults:{
				renderer:$.jqplot.BarRenderer,
				rendererOptions: {
					varyBarColor: true,
					barWidth: 35,
				},
				pointLabels: { show: true }
			},
			axes: {
				xaxis: {
					renderer: $.jqplot.CategoryAxisRenderer,
					ticks: data[1]
				}
			},
			highlighter: { show: false }
		});
	}

	function generateGroupBarChart(idDiv, data) {
		plotgroupBar = $.jqplot(idDiv, data[1], {
			seriesDefaults: {
				renderer:$.jqplot.BarRenderer,
				pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
				shadowAngle: 135,
				rendererOptions: {
					barDirection: 'horizontal'
				}
			},
			axes: {
				yaxis: {
					renderer: $.jqplot.CategoryAxisRenderer
				}
			},
			legend: {
				show: true,
				location: 'ne',
				placement: 'inside',
				labels: data[0]
			},
		});
	}

	function generateDateAxis(idDiv, data) {
		//var line1=[['2008-06-30 8:00AM',4], ['2008-7-14 8:00AM',6.5], ['2008-7-28 8:00AM',5.7], ['2008-8-11 8:00AM',9], ['2008-8-25 8:00AM',8.2]];
		var plot2 = $.jqplot(idDiv, [data], {
			title:'Fréquentation des donjons au cours de l\'année',
			axes:{
				xaxis:{
					renderer:$.jqplot.DateAxisRenderer,
					tickOptions:{formatString:'%#d-%m'},
					min:'01-01',
					max:'31-12',
					tickInterval:'1 month'
				}
			},
			series:[{lineWidth:4, markerOptions:{style:'square'}}]
		}).replot();
	}

	/***************************************
	 QUESTION 1 : PIE CHART : Visite par marque
	 ****************************************/
	getRequest("webservices/infos_user.php?user=2", function(data) {

	});


	getRequest("webservices/liste_amis_user.php?user=2", function(amis) {
		var amis_hommes = 0;
		var amis_femmes = 0;
		var counter = amis.length;
		$.each(amis,function(i,ami){
			getRequest("webservices/infos_user?user="+ami[1],function(data_ami){
				if(data_ami[0][7] == 0)
				{
					amis_femmes++;
				}
				else
				{
					amis_hommes++;
				}
				counter--;
				if(counter === 0){
					var data_tableau = [['Amis Femmes',amis_hommes],['Amis Hommes',amis_femmes]];
					generatePieChart("pourcentage_amis_masculin_feminin", data_tableau);
				}
			});
		});
	});

	getRequest("webservices/notations_user?user=22", function(amis) {
		var un_h = 0;
		var deux_h = 0;
		var trois_h = 0;
		var quatre_h = 0;
		var cinq_h = 0;

		var un_f = 0;
		var deux_f = 0;
		var trois_f = 0;
		var quatre_f = 0;
		var cinq_f = 0;

		var counter = amis.length;
		$.each(amis,function(i,ami){
			getRequest("webservices/infos_user?user="+ami[0],function(data_ami){
				if(data_ami[0][7] == 0)
				{
					switch(ami[2]){
						case '1':
							un_f++;
							break;
						case '2':
							deux_f++;
							break;
						case '3':
							trois_f++;
							break;
						case '4':
							quatre_f++;
							break;
						case '5':
							cinq_f++;
							break;
					}
				}
				else
				{
					switch(ami[2]){
						case '1':
							un_h++;
							break;
						case '2':
							deux_h++;
							break;
						case '3':
							trois_h++;
							break;
						case '4':
							quatre_h++;
							break;
						case '5':
							cinq_h++;
							break;
					}
				}
				counter--;
				if(counter === 0){
					var data_tableau_femmes = [['Un',un_f],['Deux',deux_f],['Trois',trois_f],['Quatre',quatre_f],['Cinq',cinq_f]];
					var data_tableau_hommes = [['Un',un_h],['Deux',deux_h],['Trois',trois_h],['Quatre',quatre_h],['Cinq',cinq_h]];
					generatePieChart("popularite_profil_femmes", data_tableau_femmes);
					generatePieChart("popularite_profil_hommes", data_tableau_hommes);
					$("#popularite_profil_hommes").hide();
				}
			});
		});
	});

	$('input:radio[name=genre]').change(function(){
		if(this.value === "feminin"){
			$("#popularite_profil_femmes").show();
			$("#popularite_profil_hommes").hide();
		}
		else if (this.value === "masculin") {
			$("#popularite_profil_femmes").hide();
			$("#popularite_profil_hommes").show();
		}
		console.log("fail");
	});
});