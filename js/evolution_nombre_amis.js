$(document).ready(function(){
	// Pas de cache sur les requête IMPORTANT !
	$.ajaxSetup({ cache: false });
	var user_id =  $('#chart22').data('user-id');
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

	//$.each(data, function(i, data)){

	//}

	function generateDateAxis(idDiv, data){
		//var line1=[['2008-08-12 4:00PM',4], ['2008-09-12 4:00PM',6.5], ['2008-10-12 4:00PM',5.7], ['2008-11-12 4:00PM',9], ['2008-12-12 4:00PM',8.2]];
		console.log(data);
		//console.log(data[0][2]);
		//for(var i=0; i<data.length; i++){
		//	console.log(data[i][2]);
		//}
		//
	

		var plot1 = $.jqplot(idDiv, [data], {
			title:'Evolution du nombre d\'amis',
			axes:{
				xaxis:{
					renderer:$.jqplot.DateAxisRenderer,
				},
				yaxis: {
                        min: 0,
                        max: 5
                }
			},
			series:[{lineWidth:4, markerOptions:{style:'circle'}}]
		});
	}


	/***************************************
			1 - Date Axis
	****************************************/
	getRequest("webservices/liste_amis_user.php?user="+user_id, function(data) {
		console.log(data);
		generateDateAxis("chart22", data);
	});
});