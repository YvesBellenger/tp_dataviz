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


	function generateDateAxis(idDiv, data){
		var evol = [];
		//
		data.sort(function(a, b) {
            var dt1 = Date.parse(a[3]);
            var dt2 = Date.parse(b[3]);

            if (dt1 < dt2) return -1;
            if (dt2 < dt1) return 1;
            return 0;
        });
        for (var i = 0; i<data.length; i++) {
            data[i].reverse();
			if (i > 0 && data[i][0] == data[i-1][0]) {
				evol[i-1] = [data[i][0], i+1];
			} else {
				evol[i] = [data[i][0], i+1];
			}

        }
		var plot1 = $.jqplot('chart22', [evol], {
			title:'Evolution du nombre d\'amis',
			axes:{
				xaxis:{
					renderer:$.jqplot.DateAxisRenderer,
				},
				yaxis: {
                        min: 0,
                        max: 20,
                }
			},
			series:[{lineWidth:4, markerOptions:{style:'circle'}}]
		});
	}


	/***************************************
			1 - Date Axis
	****************************************/
	getRequest("webservices/liste_amis_user.php?user="+user_id, function(data) {
		generateDateAxis("chart22", data);
	});
});