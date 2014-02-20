
 var w = parseInt(parseInt($("#jumbotron").css("width"))/1.4),
    h = parseInt(w/1.9),
    w_opt = parseInt(w/1000),
    h_opt = parseInt(w/1000),
    // w = 1280, 1140
    // h = 800; 712.5
    g_index = 0,
    t_time = 200,
    run = true,
    graph,
    cities_data;

var cityNetwork = [],
    locationByCity = {},
    linksByCity = {},
    countByCity = {},
    countByNode = [],
    positions = [],
    lastCircleColors = {},
    dPathOpacity = 0.25,
    dPathWidth = 0.5,
    cityInd2Name_1 = {},
    cityInd2Name_0 = {};



var projection = d3.geo.azimuthal()
    .mode("equidistant")
    .origin([-98, 38])
    .scale(parseInt(w*1.2))
    //.translate([w/1.8, h/1.9]);
    .translate([parseInt(w/1.9), parseInt(h/1.9)]);

var cityScale = d3.scale.linear()
    .domain([10000, 1000000])
    .range([w/125,w/80])

var cityColorScale = d3.scale.linear()
    .domain([1, 15])
    .range(["#deebf7","#9ecae1","#3182bd"])

var speedScale = d3.scale.linear()
    .domain([1, 100])
    .range([1000,100])
    .clamp(true);

var path = d3.geo.path()
    .projection(projection);

var jumboExit = d3.select(".container .jumbotron");

var jumbo_row = d3.select(".container .jumbotron").append("div")
  .attr("class","row");

var left_panel = jumbo_row.append("div")
  .attr("class","col-md-2")
  .attr("id","left_panel");

$("#left_panel").append($("<div id='div_option1'>").load("option1.html"));

$("#left_panel").append($("<div id='div_option2'>").load("option2.html"));

$("#left_panel").append($("<div id='div_option3'>").load("option3.html"));

$("#left_panel").append($("<div id='left_panel_r4' style='padding:20px'>").load("submit_button.html"));

// separate the columns
var right_panel = jumbo_row.append("div")
  .attr("id","right_panel")
  .attr("class","col-md-10");

var svg = right_panel.append("svg:svg")
    .attr("id","svg")
    .attr("width",w)
    .attr("height",h)
    .attr("viewBox", "0 0 " + w + " " + h)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("max-width","100%");

$("#right_panel").append($("<div class='col-md-12' style='padding:20px'>").load("svg_footer.html"));
$("#right_panel").append($("<div class='btn-toolbar' role='toolbar' style='padding:20px' id='playbuttons'>").load("playbuttons_disabled.html"));
$("#right_panel").append($("<div class='col-md-12'>").load("playbuttons2.html"));

var states = svg.append("svg:g")
    .attr("id", "states");

var circles = svg.append("svg:g")
    .attr("id", "circles");

var cells = svg.append("svg:g")
    .attr("id", "cells");

function drawStates(callback) {
    d3.json("./data/us-states.json", function(collection) {
      d3.json("./data/states_hash.json",function(hash_d) {
        // flip around state annotations
        var stateToshort = {};
        for (s in hash_d) {
          stateToshort[hash_d[s]] = s;
        }
        //debugger;
        states.selectAll("path")
          .data(collection.features)
        .enter().append("svg:path")
          .attr("d", path)
          .attr("id",function(d){return stateToshort[d.properties.name];});
        callback();
      });
    });
}

function doTour() {
      var name = "Friend"
      var tour = new Tour({
          storage : false
      });
   
      tour.addSteps([
        {
          element: "#TX",
          placement: "top",
          title: "Welcome to the Network<i>Challenge</i>!",
          content: "What's your name? <br><input class='form-control' type='text' name='your_name'>",
          onNext : function(tour){
              var nameProvided = $("input[name=your_name]").val();
              if ($.trim(nameProvided) !== ""){
                  name = nameProvided;
              }
            }
        },
        {
          element: "#CA",
          placement: "right",
          title: function(){ return "Congratulations, <b>" + name + "</b>!"; },
          content: "You have been selected by the President to plan the country's communication network. <p> </p><p><i>You must be very smart!</i></p><p></p><p>I'm here to help you learn how to do your job and win the challenge.</p>"
        },
        {
          element: "#CA",
          placement: "left",
          title: function(){ return "<b>" + name + "</b>, your job is to design a robust communication network"; },
          content: "<p>As the country grows and new cities are established, they need to be connected to pre-exisiting cities. Each year a new city will be established. You choose the rules that determine how that city gets wired into the network.</p><p></p><p>You will select how much influence each of the following has on the design of your network:</p>"
        },
        {
          element: "#div_option1",
          placement: "right",
          title: "<b>Chance</b>",
          content: "<p>Should you leave it all to chance? Or will every connection be precisely determined?</p><p><i>High values mean that <b>chance</b> is important</i></p>"
        },
        {
          element: "#div_option2",
          placement: "right",
          title: "<b>Popularity</b>",
          content: "<p>Should a new city be connected to a city that already has a lot of connections?</p><p><i>High values mean that <b>popularity</b> is important</i></p>"
        },
        {
          element: "#div_option3",
          placement: "right",
          title: "<b>Age</b>",
          content: "<p>Should new cities connect to cities that have been around for a long time?</p><p><i>High values mean that <b>age</b> is important</i></p>"
        },
        {
          element: "#TX",
          placement: "top",
          backdrop: true,
          title: "<b>Careful!!!</b>",
          content: "<p>Your selections matter. Some are more important than others.</p><p>Use your knowledge and intuition to choose the best parameters and win.</p>"
        },
        {
          element: "#go_network",
          placement: "right",
          backdrop: false,
          title: "When you're ready...",
          content: "<p>Press this button.</p><p>After building a network according to your specifications, I will score your network.</p><p>The more <b>robust</b> the <b>better</b>.</p> "
        },
        {
          element: "#go_network",
          placement: "right",
          backdrop: false,
          title: "Here's how I will score your network:",
          content: "<p>I will ask you to send a message from city <b>A</b> to <b>B</b>.</p><p>Here's where it gets fun... <p>Your cities are going to shut-down by chance. First one. Then another. And then another. And so on.</p><p> The longer your network can get the message from <b>A</b> to <b>B</b>, the higher your score.</p><p>We'll do this 100 times - just to make sure you didn't get unlucky</p><p>Got it?</p>"
        },
        {
          element: "#playbuttons",
          placement: "bottom",
          title: "Your score",
          content: "<p>When I've tallied your score, I will display it here.</p><p>You will be able to see how your network performed compared to everyone else's. You will also be able to compare your network to the top scoring network.</p>"
        },
        {
          element: "#playbuttons",
          placement: "bottom",
          title: "One more thing...",
          content: "You can control the animation using these buttons. You can increase or decrease the speed or pause the animation using these buttons."
        },
      ]);
   
     // Initialize the tour
      tour.init();
   
      // Start the tour
      tour.start();
}

drawStates(function(){doTour()});

function start(where,cities,graph) { 
      //debugger;
      // make sure voronoi checkbox is active
      $("#voronoi_checkbox").change(function(){
        cells.classed("voronoi", this.checked);
      });
      // remove content in left panel. replace with city summary table
      // clear out left panel. add city info
      $("#left_panel").load("city_info.html");
      //debugger;
      if (cities==undefined&&graph==undefined) {
        //debugger;
        cityDataParse(where,start);
      }
      if (where>100) {
        //debugger;
        $("#left_panel").append($("<div id='left_panel_r4' style='padding:20px'>").load("connection.html"));
      }
      index_g = where || 0;
      var t;
      function startDraw(){
        //debugger;
        //handle stupidity
        var tmp_speed = parseInt($("#speed").val());
        var ready_state = false;
        tmp_speed = isNaN(tmp_speed) ? 10 : tmp_speed;
        t_time = parseInt(speedScale(tmp_speed));
        index_g = index_g + 1;
        if (index_g<=cities.length && run==true) {
          draw(cities.slice(0,index_g),positions.slice(0,index_g),locationByCity,
          linksByCity,countByCity,cities);
          //console.log(index);
          t = setTimeout(function(){
            startDraw();
          },t_time); 
        } else if (run==true && index_g==cities.length+1){
          //debugger;
          var tmpcircles = d3.selectAll("circle");
          tmpcircles[[0]].forEach(function(d){lastCircleColors[d.id]=d.style.fill});
          //debugger;
          bootbox.alert("<p>Your network is read to score.</p><p>When you're ready, click the 'Score button'</p>", function() {
              $("#left_panel").append($("<div id='left_panel_r4' style='padding:20px'>").load("score_button.html"));
            }); 
        } else if (index_g>cities.length && run==true) {
          // here's where we start destroying the network
        } else if (run==false){
          clearTimeout(t);
        }
      }
      startDraw();
}

function cityDataParse(where,callback) {
  //debugger;
  d3.csv("./data/uscitiespop.csv", function(cities) {
    debugger;
    // reduce size of cities
    cities = cities.slice(0,graph.names.length);
    for (var i = 0; i<cities.length; i++) {
      cities[i].age = cities.length-i;
    }
    cities_data = cities;
    // determine connectivity
    graph.names.forEach(function(name){
      cityNetwork[name] = {
        name:name,
        count:0,
        city:undefined,
        population:undefined,
        latitude:undefined,
        longitude:undefined
        };
    });
    graph.links.forEach(function(link){
      var source = link.source,
          target = link.target;
      cityNetwork[source].count = (cityNetwork[source].count || 0) + 1;
      cityNetwork[target].count = (cityNetwork[target].count || 0) + 1;  
    });
    // sort
    for (var node in cityNetwork) {
      countByNode.push([node,cityNetwork[node].count]);
    }
    countByNode.sort(function(a, b) {return b[1] - a[1]});
    // add city,lat,long,etc
    var index = 0;
    countByNode.forEach(function(node){
      cityNetwork[parseInt(node[0])].city = cities[index].AccentCity;
      cityNetwork[parseInt(node[0])].latitude = cities[index].Latitude;
      cityNetwork[parseInt(node[0])].longitude = cities[index].Longitude;
      cityNetwork[parseInt(node[0])].population = cities[index].Population;
      // add city population to countByCity
      countByCity[cities[index].AccentCity] = cities[index].Population;
      index=index+1
      var location = [+cityNetwork[parseInt(node[0])].longitude, +cityNetwork[parseInt(node[0])].latitude];
      locationByCity[cityNetwork[parseInt(node[0])].city] = location;
      positions.push(projection(location));
    });
    graph.links.forEach(function(link){
      var source = link.source,
          target = link.target,
          links_t = linksByCity[cityNetwork[target].city] || (linksByCity[cityNetwork[target].city] = []);
          links_s = linksByCity[cityNetwork[source].city] || (linksByCity[cityNetwork[source].city] = []);
      links_t.push({source: cityNetwork[target].city, target: cityNetwork[source].city});
      links_s.push({source: cityNetwork[source].city, target: cityNetwork[target].city});
    });
    callback(where,cities_data,graph);
  });
}

function clearGraph(){
  //debugger;
  var g = cells.selectAll("g")
      .data([]);
  g.exit().remove();
  //remove voronoi cells
  var pathcell = g.selectAll("path.cell")
    .data([]);
  pathcell.exit().remove();
  $("#circles").empty();
  $("#left_panel").empty();
}

function score(where) {
  var t2,
      t3,
      score_ind,
      k_ind = 0;
  function pretendKill(ind,graph,cityUpdate,positionUpdate,currentCities,callback) {
    // select random cities
    if (currentCities==null) {
      var currentCities = [];
      cityUpdate.forEach(function(d){currentCities.push(d.AccentCity)});
      currentCities.forEach(function(d,i){cityInd2Name_1["'"+(i+1)+"'"]=d});
      currentCities.forEach(function(d,i){cityInd2Name_0["'"+i+"'"]=d});
    }
    // show shortest path 
    sPath = [];
    //debugger;
    (graph.game[ind].paths.split(" ")).forEach(function(d){sPath.push(cityInd2Name_1["\'"+d+"\'"])});
    for (var i=0;i<sPath.length-1;i=i+2) {
      debugger;
      $(':regex(id,^'+ sPath[i]+sPath[i+1] + ')').css({
        stroke:"blue",
        opacity:1,
        strokeWidth:5
      });
      $(':regex(id,^'+ sPath[i+1]+sPath[i] + ')').css({
        stroke:"blue",
        opacity:1,
        strokeWidth:5
      });
    }
    //debugger;
    if (k_ind<3) {
      k_ind = k_ind+1;
      d3.selectAll("path.arc")
        .style("stroke","black")
        .style("opacity",dPathOpacity)
        .style("stroke-width",dPathWidth);
      d3.selectAll("circle")
        .style("fill",function(d){lastCircleColors[d.AccentCity];});
      // select a random city
      var rCity = currentCities[Math.floor((Math.random()*cityUpdate.length-1))];
      // make it look different
      var tmp=$(':regex(id,^'+ rCity +')');
      var tmp_circles = tmp.filter("circle");
      var tmp_paths = tmp.filter("path");
      tmp_circles.css({
        fill:"orange"
      });
      tmp_paths.css({
        stroke:"orange",
        opacity:1,
        strokeWidth:5
      });
      t2 = setTimeout(function(){
        pretendKill(ind,graph,cityUpdate,positionUpdate,currentCities,callback);
      },t_time);
    } else {
        d3.selectAll("path.arc")
          .style("stroke","black")
          .style("opacity",dPathOpacity)
          .style("stroke-width",dPathWidth);
        d3.selectAll("circle")
          .style("fill",function(d){lastCircleColors[d.AccentCity];});
        clearTimeout(t2);
        callback(cityInd2Name[parseInt(game[ind].removed)],cityUpdate,positionUpdate,currentCities,draw);
    }
  }

  function prepareForKill(city,cityUpdate,positionUpdate,currentCities,callback) {
    // remove city from cityUpdate and positonUpdate
    cityInd = currentCities.indexOf(city);
    cityUpdate.splice(cityInd,1);
    positionUpdate.splice(cityInd,1);
    currentCities.splice(cityInd,1);
    //debugger;
    tmp=$(':regex(id,^'+ city +')');
    tmp_circles = tmp.filter("circle");
    tmp_paths = tmp.filter("path");
    tmp_circles.css({
      fill:"red"
    });
    tmp_paths.css({
      stroke:"red",
      opacity:1,
      strokeWidth:5
    });
    //debugger;
    callback(cityUpdate,positionUpdate,locationByCity,
              linksByCity,countByCity,cities_data);
  }
  score_ind = where - (cities_data.length+1);
  function runItAll(graph) {
    if (score_ind<=graph.game.length) {
      score_ind = score_ind+1;
      t3 = setTimeout(function(){
        pretendKill(score_ind,graph,cities_data,positions,null,prepareForKill);
      },t_time); 
    } else {
      clearTimeout(t3);
    }
  }
  runItAll(graph);
}

function isItNew(cities,link){
  var newCity = cities[cities.length-1].AccentCity;
  if ( link.source == newCity || link.target == newCity) {
    return true;
  } else {
    return false;
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertToInt(x) {
  // array to Int
  y = [];
  for (var i=0;i<x.length;i++) {
    y.push(parseInt(x[i]));
  }
  return y;
}

function draw(cities,positions,locationByCity,linksByCity,countByCity,allCities){
  d3.select("#current_age").text("Current round: " + cities.length);
  //debugger;
  d3.select("#progressbar").transition()
    .attr("aria-valuenow",cities.length)
    .style("width", cities.length+'%');
  var arc = d3.geo.greatArc()
    .source(function(d) { return locationByCity[d.source]; })
    .target(function(d) { return locationByCity[d.target]; });
  // Compute the Voronoi diagram of cities projected positions.  
  var polygons = d3.geom.voronoi(positions);
  
  var g = cells.selectAll("g")
      .data(cities,function(d) { return d.AccentCity; });
  
  g.exit().selectAll("path.arc").transition().duration(t_time*5)
    .style("stroke","red")
    .style("opacity",0)
    .style("stroke-width",0)
    .remove();

  g.exit().selectAll("path.cell").remove();
  
  //remove voronoi cells
  var pathcell = g.selectAll("path.cell")
    .data([]);
  pathcell.exit().remove();
  // add voronoi cells
  g.enter().append("svg:g")
    .attr("id",function(d){ return d.AccentCity; });
  g.append("svg:path")
      .attr("class", "cell")
      .attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
      .on("mouseover", function(d, i) {
        //debugger;
        d3.select("#table_city").text(d.AccentCity);
        //debugger;
        d3.select("#table_founded").text((allCities.length-d.age)+1);
        d3.select("#table_population").text(numberWithCommas(Math.round(((cities.length-(cities[0].age-d.age))/allCities.length)*countByCity[d.AccentCity])));
        d3.select("#table_connections").text(numberWithCommas($(this.parentNode).children("path.arc").length));
        //console.log(this.parentNode);
        d3.select(this.parentNode).selectAll("path.arc")
          .style("stroke","red")
          .style("opacity",0.5)
          .style("stroke-width",7.5);
      })
      .on("mouseout", function(d, i) {
        d3.select(this.parentNode).selectAll("path.arc")
          .style("stroke","black")
          .style("opacity",dPathOpacity)
          .style("stroke-width",dPathWidth);
      });
  var currentCities = [];
  for(i=0;i<cities.length;i++){
      currentCities.push(cities[i].AccentCity);
  }
  var connections = g.selectAll("path.arc")
      .data(function(d) {
        var paths = linksByCity[d.AccentCity] || [];
        var paths_tor = [];
        if (paths.length>0) {
          for(i=0;i<paths.length;i++) {
            if (currentCities.indexOf(paths[i].source)>=0 && currentCities.indexOf(paths[i].target)>=0){
              paths_tor.push(paths[i]);
            }
          }
        }
        return paths_tor;
      },function(d){return d.source+d.target});

  var connectionsEnter = connections.enter().append("svg:path")
      .attr("class", "arc")
      .attr("d", function(d) { return path(arc(d)); })
      .attr("id", function(d) { return d.source+d.target })
      .style("opacity", function(d) { return isItNew(cities,d) ? "1.0" : dPathOpacity } )
      .style("stroke",function(d) { return isItNew(cities,d) ? "blue" : "black" })
      .style("stroke-width",function(d) { return isItNew(cities,d) ? 10 : dPathWidth });
  //updated transitions
  connections.transition().duration(t_time)
      .style("opacity",dPathOpacity)
      .style("stroke","black")
      .style("stroke-width",dPathWidth);
  
  var circlesUpdate = circles.selectAll("circle")
      .data(cities,function(d) { return d.AccentCity; });

  var circlesEnter = circlesUpdate.enter().append("svg:circle")
      .attr("cx", function(d, i) { return positions[i][0]; })
      .attr("cy", function(d, i) { return positions[i][1]; })
      .attr("r", function(d, i) { return cityScale(((cities.length-(cities[0].age-d.age))/allCities.length)*countByCity[d.AccentCity]); })
      .attr("id",function(d) { return d.AccentCity; })
      .style("fill",function(d) { return cityColorScale(cities.length-(cities[0].age-d.age)) } );
      //.sort(function(a, b) { return countByCity[d.AccentCity] - countByACity[d.AccentCity]; });
  //updated onex
  circlesUpdate.transition().duration(t_time)
    .attr("r", function(d, i) { return cityScale(((cities.length-(cities[0].age-d.age))/allCities.length)*countByCity[d.AccentCity]); })
    .style("fill",function(d) { return cityColorScale(cities.length-(cities[0].age-d.age)) } );

  var circlesExit = circlesUpdate.exit().transition().duration(t_time*5)
    .attr("r",function(d,i){return this.getAttribute("r")/10})
    .remove();

  
}
  




  

 



