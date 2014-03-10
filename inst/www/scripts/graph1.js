function median(values) {
  values.sort( function(a,b) {return a - b;} );
   
  var half = Math.floor(values.length/2);
   
  if(values.length % 2)
  return values[half];
  else
  return (values[half-1] + values[half]) / 2.0;
}

drawGraph1 = function(score,yours,margin,width,height) {
  
  var values = score;

  //debugger;
  
  var graph = d3.select("#graph1_svg")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var high = values.sort(function(a,b){return a - b})[values.length-1];
  var low = values.sort(function(a,b){return a - b})[0];
  // var high = values.indexOf(Array.max(values));
  // var low = values.indexOf(Array.max(values));


  //debugger;
  var x = d3.scale.linear()
        //.domain([0,1])
        .domain([low-(low*.15),high+(high*.15)])
        .range([0, width]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  //debugger;

  // Generate a histogram using twenty uniformly-spaced bins.
  var data = d3.layout.histogram()
      .bins(x.ticks(bins))
      (values.sort());

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height, 0]);

  var bar = graph.selectAll(".bar")
      .data(data,function(d,i){return i})
    .enter().append("g")
      .attr("class", "bar")
      .attr("id",function(d,i) {return "Bin"+i })
      .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      //.attr("width", x(data[0].dx) - 1)
      .attr("width",width/(bins))
      .attr("height", function(d) { return height - y(d.y); })
      .style("fill",function(d){
        if (yours>=d.sort(function(a,b){return a - b})[0] && yours<=d.sort(function(a,b){return a - b})[d.length-1]) {
          return "rgb(255, 127, 14)"
        } else if (high>=d.sort(function(a,b){return a - b})[0] && high<=d.sort(function(a,b){return a - b})[d.length-1]){
          return "rgb(44, 160, 44)"
        } else {
          return "rgb(31, 119, 180)"
        }
      });

  bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", width/bins-9)
      .attr("text-anchor", "middle")
      .style("font-size",".6em")
      .text(function(d) { return formatCount(d.y); });

  bar.append("svg:title")
     .text(function(d) { 
         if (yours>=d.sort(function(a,b){return a - b})[0] && yours<=d.sort(function(a,b){return a - b})[d.length-1]) {
          return "Your score: " + formatCount2(yours);
        } else if (high>=d.sort(function(a,b){return a - b})[0] && high<=d.sort(function(a,b){return a - b})[d.length-1]){
          return "High score: " + formatCount2(high);
        } else {
          return formatCount2(median(d));
        }
     });

  graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  select = graph.selectAll(".graph1 selector")
      .data(["1","2"])
    .enter().append("g")
      .attr("class","graph1 selector")
      .attr("transform", function(d,i) { return "translate(" + 0 + "," + i*25 + ")"; });

}

redrawHist = function(values,bins,yours,margin,width,height) {
  var high = values.sort(function(a,b){return a - b})[values.length-1];
  var low = values.sort(function(a,b){return a - b})[0];
  // var high = values.indexOf(Array.max(values));
  // var low = values.indexOf(Array.max(values));

  var x = d3.scale.linear()
      //.domain([0,1])
      .domain([low-(low*.15),high+(high*.15)])
      .range([0, width]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(6)
      .orient("bottom");

  var data = d3.layout.histogram()
    .bins(x.ticks(bins))
    (values.sort());

  //debugger;

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);
  var graph = d3.select("#graph1_svg");
  var bar = graph.selectAll(".bar")
    .data(data,function(d,i){return i;});

  var barUpdate = bar.transition().duration(1000)
    .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  barUpdate.select("rect")
    .attr("height", function(d) { return height - y(d.y); })
    .style("fill",function(d){
      if (yours>=d.sort(function(a,b){return a - b})[0] && yours<=d.sort(function(a,b){return a - b})[d.length-1]) {
          return "rgb(255, 127, 14)"
        } else if (high>=d.sort(function(a,b){return a - b})[0] && high<=d.sort(function(a,b){return a - b})[d.length-1]){
          return "rgb(44, 160, 44)"
        } else {
          return "rgb(31, 119, 180)"
        }
    });

  barUpdate.select("text")
    .text(function(d) { return formatCount(d.y); });

  barUpdate.select("title")
   .text(function(d) { 
       if (yours>=d.sort(function(a,b){return a - b})[0] && yours<=d.sort(function(a,b){return a - b})[d.length-1]) {
        return "Your score: " + formatCount2(yours);
      } else if (high>=d.sort(function(a,b){return a - b})[0] && high<=d.sort(function(a,b){return a - b})[d.length-1]){
        return "High score: " + formatCount2(high);
      } else {
        return formatCount2(median(d));
      }
   });

  // update axis 
  //debugger;
  graph.selectAll(".x.axis")
    .call(xAxis);
}
  
initGraph1 = function() {
  //debugger;
  drawGraph1(score1,yours1,g1_margin,g1_width,g1_height);
}
