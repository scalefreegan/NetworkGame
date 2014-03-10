drawGraph2 = function(score) {
  DrawIt = function(data) {
    nv.addGraph(function() {
      var chart = nv.models.multiBarChart()
        .transitionDuration(350)
        .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
        .rotateLabels(0)      //Angle to rotate x-axis labels.
        .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
        .groupSpacing(0.1)    //Distance between each group of bars.
        .margin({top: 30, right: 20, bottom: 50, left: 100})
        .color(["rgb(255, 127, 14)","rgb(44, 160, 44)","rgb(31, 119, 180)"]);
   
      chart.xAxis
          .tickFormat(d3.format(',f'));
   
      chart.yAxis
          .tickFormat(d3.format(',.1f'));
   
      d3.select('#graph2_svg')
          .datum(data)
          .call(chart);
   
      nv.utils.windowResize(chart.update);
   
      return chart;
    });
  }
  DrawIt(score);
}