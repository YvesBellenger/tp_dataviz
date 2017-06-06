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
    <script type="text/javascript" src="js/renderer/jqplot.barRenderer.js"></script>
    <script type="text/javascript" src="js/renderer/jqplot.categoryAxisRenderer.js"></script>

    <script type="text/javascript" src="js/dataviz.js"></script>
</head>
<body>
<?php include ('structure/header.php'); ?>
<div id="content">
    <div><span id="info1"></span></div>
    <div class="plot" id="chart1"></div>
</div>
<?php include ('structure/footer.php'); ?>
</body>
</html>
<script>
    $(document).ready(function() {
        var amis;
        var messages;
        jQuery.ajax({
            type: "GET",
            url: "/webservices/messages_user.php?user=0"
        }).done(function (data) {
            messages = $.parseJSON(data);
            jQuery.ajax({
                type: "GET",
                url: "/webservices/liste_amis_user.php?user=0"
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

                plot1 = $.jqplot('chart1', [s1], {
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
                $('#chart1').bind('jqplotDataClick',
                    function (ev, seriesIndex, pointIndex, data) {
                        $('#info1').html('valeur: '+data[1]+' %');
                    }
                );
            });
        });
    });
</script>