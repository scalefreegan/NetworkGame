drawGraph3 = function(score) {
  
    nv.addGraph(function() {
    var chart = nv.models.scatterChart()
                  .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                  .showDistY(true)
                  //.transitionDuration(350)
                  .color(["rgb(255, 127, 14)","rgb(44, 160, 44)","rgb(31, 119, 180)"])
                  .margin({top: 30, right: 20, bottom: 50, left: 40})
                  .showLegend(true)
                  //.transitionDuration(1000);
   
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
        .transition().duration(1500)
        .call(chart);
   
    nv.utils.windowResize(chart.update);
   
    return chart;
  });
}