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
    <script type="text/javascript" src="js/renderer/jqplot.dateAxisRenderer.js"></script>

    <script type="text/javascript" src="js/dataviz.js"></script>
</head>
<body>
<?php include ('structure/header.php'); ?>
<div id="content">
    <div><span id="info1"></span></div>
    <div class="plot" data-user-id="<?=$_GET['user_id']?>" id="chart32"></div>
</div>
<?php include ('structure/footer.php'); ?>
</body>
</html>
<script>
    $(document).ready(function() {
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
            console.log(notations);
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
                title:'Default Date Axis',
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
    });
</script>