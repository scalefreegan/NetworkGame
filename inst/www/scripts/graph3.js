drawGraph3 = function(score) {
  
    nv.addGraph(function() {
    var chart = nv.models.scatterChart()
                  .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                  .showDistY(true)
                  .transitionDuration(350)
                  .color(d3.scale.category10().range())
                  .margin({top: 30, right: 20, bottom: 50, left: 40});
   
    //Configure how the tooltip looks.
    chart.tooltipContent(function(key) {
        return '<h3>' + key + '</h3>';
    });
   
    //Axis settings
    chart.xAxis.tickFormat(d3.format('.02f'));
    chart.yAxis.tickFormat(d3.format('.02f'));
   
    //We want to show shapes other than circles.
    chart.scatter.onlyCircles(false);
   
    d3.select('#graph3_svg')
        .datum(score)
        .call(chart);
   
    nv.utils.windowResize(chart.update);
   
    return chart;
  });
}