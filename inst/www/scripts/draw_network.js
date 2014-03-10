var g_index = 0,
    t_time = 200,
    run = true,
    graph,
    cities;

var cityNetwork = [],
    locationByCity = {},
    linksByCity = {},
    countByCity = {},
    countByNode = [],
    positions = [],
    lastCircleColors = {},
    lastCircleR = {},
    dPathOpacity = 0.25,
    dPathWidth = 0.5,
    cityName2Ind = {},
    cityGraphName2Name = {},
    nRand = 3,
    cityUpdate,
    cityUpdate_obj,
    positionUpdate,
    positionUpdate_obj,
    removeCity;

loadjscssfile("./scripts/nv.d3.min.js", "js");
loadjscssfile("./scripts/stream_layers.js", "js");

var jumboExit = d3.select(".container .jumbotron");

var jumbo_row = d3.select(".container .jumbotron").append("div")
  .attr("id","panel_container")
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

var right_panel_leader = right_panel.append("div")
  .attr("id","right_panel_leader")
  .attr("class","col-md-12")

var w = parseInt(parseInt($("#right_panel").css("width"))*.8),
    h = parseInt(w/1.6),
    w_opt = parseInt(w/1000),
    h_opt = parseInt(w/1000);
    // w = 1280, 1140
    // h = 800; 712.5

var projection = d3.geo.azimuthal()
    .mode("equidistant")
    .origin([-98, 38])
    .scale(parseInt(w*1.35))
    //.translate([w/1.8, h/1.9]);
    .translate([parseInt(w/2), parseInt(h/2)]);

// var projection = d3.geo.albers()
//     //.rotate([96, 0])
//     .center([-.6, 38.7])
//     .parallels([29.5, 45.5])
//     .scale(1070)
//     .translate([w / 2, h / 2])
//     .precision(.1);

var cityScale = d3.scale.linear()
    .domain([10000, 10000000])
    .range([w/160,w/20]);

var cityScaleScore = d3.scale.linear()
    .domain([0, nRand+1])
    .range([w/50,w/20]);

var cityColorScale = d3.scale.linear()
    .domain([1, 15])
    .range(["#deebf7","#9ecae1","#3182bd"])

var orangeTored = d3.scale.linear()
    .domain([0, nRand+1])
    .range(["white","blue"]);

var speedScale = d3.scale.linear()
    .domain([1, 100])
    .range([1000,100])
    .clamp(true);

var path = d3.geo.path()
    .projection(projection);

var svg = right_panel.append("svg:svg")
    .attr("id","svg")
    .attr("width",w)
    .attr("height",h)
    .attr("viewBox", "0 0 " + w + " " + h)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("max-width","100%");

$("#right_panel").append($("<div class='col-md-12' style='padding:20px'>").load("svg_footer.html"));
$("#right_panel").append($("<div class='btn-toolbar' role='toolbar' style='padding:20px' id='playbuttons'>").load("playbuttons.html"));
$("#right_panel").append($("<div class='col-md-12'>").load("playbuttons2.html"));

var states = svg.append("svg:g")
    .attr("id", "states");

var circles = svg.append("svg:g")
    .attr("id", "circles");

var cells = svg.append("svg:g")
    .attr("id", "cells");


//DELETE THIS BEFORE DEPLOYING: STATIC FILE
var bins = 20,
    score1 = [],
    score1_nosort = [],
    score2 = [],
    score2_nosort = [],
    yours1,
    yours2,
    chance = [],
    popularity = [],
    age = [],
    high_ind;
// d3.json("./data/graph.json", function(data) {
//   graph = data;
//   for (var i = 0; i<graph.other_data.length; i++) {
//     score1.push(graph.other_data[i].score_1);
//     score1_nosort.push(graph.other_data[i].score_1);
//     score2.push(graph.other_data[i].score_2);
//     score2_nosort.push(graph.other_data[i].score_2);
//     chance.push(graph.other_data[i].chance_val);
//     popularity.push(graph.other_data[i].popularity_val);
//     age.push(graph.other_data[i].age_val);
//     if (i==graph.other_data.length-1) {
//       yours1 = graph.other_data[i].score_1
//       yours2 = graph.other_data[i].score_2
//     }
//   }
//   high_ind = score1.indexOf(Array.max(score1));
// });
// d3.json("./data/degree2.json", function(data) {
//   degree = data;
// });
// d3.json("./data/betweenness.json", function(data) {
//   betweenness = data;
// });

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

function doTour1() {
      userName = "Friend"
      var tour = new Tour({
          storage : false,
          onEnd : function(tour) {$("#go_network").prop("disabled",false)},
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
                  userName = nameProvided;
              }
            }
        },
        {
          element: "#CA",
          placement: "right",
          title: function(){ return "Congratulations, <b>" + userName + "</b>!"; },
          content: "You have been selected by the President to plan the country's communication network. <p> </p><p><i>You must be very smart!</i></p><p></p><p>I'm here to help you learn how to do your job and win the challenge.</p>"
        },
        {
          element: "#CA",
          placement: "left",
          title: function(){ return "<b>" + userName + "</b>, your job is to design a robust communication network"; },
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
      ]);
   
     // Initialize the tour
      tour.init();
   
      // Start the tour
      tour.start();
}

function doTour2(callback) {
      var name = "Friend"
      var tour = new Tour({
          storage : false,
          onEnd: function (tour) {
            $('#stop').prop("disabled",false);
            $('#first').prop("disabled",false);
            $('#last').prop("disabled",false);
            callback(0,start);
          },
      });
   
      tour.addSteps([
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
          content: "You can control the speed or pause the animation using these buttons. Have fun!"
        },
        ]);
      spinner.stop();
      // Initialize the tour
      tour.init();
   
      // Start the tour
      tour.start();
      
}

drawStates(function(){doTour1()});

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
      index_g = where || 0;
      var t;
      function startDraw(){
        //handle stupidity
        var tmp_speed = parseInt($("#speed").val());
        tmp_speed = isNaN(tmp_speed) ? 10 : tmp_speed;
        t_time = parseInt(speedScale(tmp_speed));
        index_g = index_g + 1;
        if (index_g<=graph.names.length && run==true) {
          var cities_now,
              positions_now;
          cities_now = dataGivenIndex(index_g,cities,graph,cityNetwork,cityName2Ind);
          positions_now = dataGivenIndex(index_g,positions,graph,cityNetwork,cityName2Ind);
          draw(cities_now,positions_now,locationByCity,
          linksByCity,countByCity,cities);
          t = setTimeout(function(){
            startDraw();
          },t_time); 
        } else if (run==true && index_g==graph.names.length+1){
          var tmpcircles = d3.selectAll("circle");
          tmpcircles[[0]].forEach(function(d){lastCircleColors[d.id]=d.style.fill});
          tmpcircles[[0]].forEach(function(d){lastCircleR[d.id]=d.getAttribute("r")});
          bootbox.alert("<p>Your network is ready!</p><p>You can see how your network performed or watch a simulation of your network's performance by clicking the 'play' button.</p>", function() {
              $("#right_panel").append($("<div class='col-md-12'>").load("score_button.html"));
              $("#playbuttons").load("playbuttons.html");
              linkViewOn();
            }); 
        } else {
          clearTimeout(t);
        }
      }
      startDraw();
}

function linkViewOn(sPath) {
  sPath = sPath || []
  var tmpcells = d3.selectAll("path.cell");
  tmpcells.on("mouseover", function(d,i){
      d3.select("#table_city").text(d.AccentCity);
      d3.select("#table_founded").text((cities.length-d.age)+1);
      d3.select("#table_population").text(numberWithCommas(d.Population));
      d3.select("#table_connections").text(numberWithCommas($(this.parentNode).children("path.arc").length));
      d3.select(this.parentNode).selectAll("path.arc")
      .style("stroke","red")
      .style("opacity", 0.5)
      .style("stroke-width",7.5);
    });
  tmpcells.on("mouseout", function(d, i) {
      d3.select(this.parentNode).selectAll("path.arc")
        .style("stroke","black")
        .style("opacity",dPathOpacity)
        .style("stroke-width",dPathWidth);
      if (sPath.length>0) {
        colorSPath(sPath)
      }  
    }); 
}

function linkViewOff(sPath) {
  sPath = sPath || [];
  // make sure links are set to default
  d3.selectAll("path.arc")
      .style("stroke",function(d){
        if (sPath.indexOf(d.source)==-1 && sPath.indexOf(d.target)==-1) {
          return "black"
        } else {
          return $(this).css("stroke");
        }
        
      })
      .style("opacity",function(d){
        if (sPath.indexOf(d.source)==-1 && sPath.indexOf(d.target)==-1) {
          return dPathOpacity
        } else {
          return $(this).css("opacity");
        }
        
      })
      .style("stroke-width",function(d){
        if (sPath.indexOf(d.source)==-1 && sPath.indexOf(d.target)==-1) {
          return dPathWidth
        } else {
          return $(this).css("stroke-width");
        }
    });
  var tmpcells = d3.selectAll("path.cell");
  tmpcells.on("mouseover", function(d,i){
      d3.select("#table_city").text(d.AccentCity);
      d3.select("#table_founded").text((cities.length-d.age)+1);
      d3.select("#table_population").text(numberWithCommas(d.Population));
      d3.select("#table_connections").text(numberWithCommas($(this.parentNode).children("path.arc").length));
    }); 
}

function colorSPath(sPath) {
  var greenTored = d3.scale.linear()
    .domain([0, sPath.length-1])
    .range(["green","red"]);
  sPath = sPath || [];
  // color node
  var cStart=$(':regex(id,^'+ sPath[0] +')').filter("circle");
  var cEnd=$(':regex(id,^'+ sPath[sPath.length-1] +')').filter("circle");
  cStart.css({
          fill : greenTored(0)
        });
  cStart.attr({
          r : w/35
        });
  cEnd.css({
          fill : greenTored(sPath.length)
        });
  cEnd.attr({
          r : w/35
        });
  d3.selectAll("path.arc")
      .style("stroke","black")
      .style("opacity", dPathOpacity)
      .style("stroke-width", dPathWidth)
  for (var i=0;i<sPath.length-1;i++) {
      //debugger;
      $(':regex(id,^'+ sPath[i]+sPath[i+1] + ')').css({
        stroke:greenTored(i),
        opacity:1,
        strokeWidth:5
      });
      $(':regex(id,^'+ sPath[i+1]+sPath[i] + ')').css({
        stroke:greenTored(i),
        opacity:1,
        strokeWidth:5
      });
  }
  $("#Ostart").text(sPath[0]+ " ").css({color:"green"});
  $("#right_arrow").show();
  $("#Ostop").text(" " +sPath[sPath.length-1]).css({color:"red"});
}

function dataGivenIndex(index_d,data,graph,cityNetwork,cityName2Ind) {
  // restrict cities and positions data given an index
  // node names
  var subCities = cityNetwork.slice(0,index_d);
  // restrict data given these nodes
  var data_return = [];
  subCities.forEach(function(d){
    data_return.push(data[cityName2Ind[d.city]])
  });
  return data_return;
}

function cityDataParse(where,callback) {
  //debugger;
  d3.csv("./data/uscitiespop.csv", function(data) {
    //debugger;
    // reduce size of cities
    cities = data.slice(0,graph.names.length);
    var i = 0;
    cities.forEach(function(n){
      cityName2Ind[n.AccentCity+" "+n.Region] = i;
      i = i+1;
    })
    for (var i = 0; i < cities.length; i++) {
      cities[i].altName = cities[i].AccentCity+" "+cities[i].Region
    }
    // determine connectivity
    graph.names.forEach(function(name){
      cityNetwork[parseInt(name)] = {
        name:parseInt(name),
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
      cityNetwork[parseInt(node[0])].city = cities[index].AccentCity + " " + cities[index].Region;
      cityNetwork[parseInt(node[0])].latitude = cities[index].Latitude;
      cityNetwork[parseInt(node[0])].longitude = cities[index].Longitude;
      cityNetwork[parseInt(node[0])].population = cities[index].Population;
      // add city population to countByCity
      countByCity[cities[index].AccentCity + " " + cities[index].Region] = cities[index].Population;
      index=index+1
      var location = [+cityNetwork[parseInt(node[0])].longitude, +cityNetwork[parseInt(node[0])].latitude];
      locationByCity[cityNetwork[parseInt(node[0])].city] = location;
      positions.push(projection(location));
    });
    for (var i = 0; i<cityNetwork.length; i++) {
      cities[cityName2Ind[cityNetwork[i].city]].age = cities.length-cityNetwork[i].name;
    }
    for (var i = 0; i<cityNetwork.length; i++) {
      cityGraphName2Name["'"+cityNetwork[i].name+"'"] = cityNetwork[i].city;
    }
    graph.links.forEach(function(link){
      var source = link.source,
          target = link.target,
          links_t = linksByCity[cityNetwork[target].city] || (linksByCity[cityNetwork[target].city] = []);
          links_s = linksByCity[cityNetwork[source].city] || (linksByCity[cityNetwork[source].city] = []);
      links_t.push({source: cityNetwork[target].city, target: cityNetwork[source].city});
      links_s.push({source: cityNetwork[source].city, target: cityNetwork[target].city});
    });
    cityUpdate_obj = jQuery.extend(true, {}, cities);
    positionUpdate_obj = jQuery.extend(true, {}, positions);
    callback(where,cities,graph);
  });
}

function obj2array(x) {
  tor = [];
  for (var j in x) {
    tor.push(x[j]);
  }
  return tor;
}

function clearGraph(callback,sPath){
  //debugger;
  // repopulate cities
  sPath = sPath ||[];
  cities = obj2array(cityUpdate_obj);
  positions = obj2array(positionUpdate_obj);
  cityUpdate = cities;
  positionUpdate = positions;
  var g = cells.selectAll("g")
      .data([]);
  g.exit().remove();
  //remove voronoi cells
  var pathcell = g.selectAll("path.cell")
    .data([]);
  pathcell.exit().remove();
  $("#circles").empty();
  //$("#left_panel").empty();
  cities_now = dataGivenIndex(cities.length-1,cities,graph,cityNetwork,cityName2Ind);
  positions_now = dataGivenIndex(cities.length-1,positions,graph,cityNetwork,cityName2Ind);
  if (callback==draw) {
    callback(cities_now,positions_now,locationByCity,linksByCity,countByCity,cities);
    colorSPath(sPath);
  } else if (callback==start){
    callback(0,cities,graph);
  }
  
}

function score(where) {
  var t2,
      t3,
      score_ind,
      k_ind = 0,
      sPath = [];
  
  function pretendKill(ind,cityUpdate,positionUpdate,currentCities,callback) {
    // show shortest path 
    sPath = [];
    (graph.game[ind].paths.split(" ")).forEach(function(d){sPath.push(cityGraphName2Name["\'"+d+"\'"])});
    linkViewOff(sPath);
    colorSPath(sPath);
    if (k_ind<(nRand+2) && run == true) {
      if (k_ind<nRand) {
        // select a random city
        var rCity = currentCities[Math.floor((Math.random()*cityUpdate.length-1))];
        while (rCity==undefined) {
          rCity = currentCities[Math.floor((Math.random()*cityUpdate.length-1))];
        }
        d3.select("#current_age").text("Close call " + rCity).style("color",orangeTored(k_ind));
        // make it look different
        var tmp=$(':regex(id,^'+ rCity +')');
        var tmp_circles = tmp.filter("circle");
        var tmp_paths = tmp.filter("path");
        tmp_circles.css({
          fill : orangeTored(k_ind)
        });
        tmp_paths.css({
          stroke: orangeTored(k_ind),
          opacity:1,
          strokeWidth:5
        });
      } else if (k_ind==(nRand)) {
        callback(cityGraphName2Name["\'"+parseInt(graph.game[ind].removed)+"\'"],cityUpdate,positionUpdate);
      } else {
      }
      k_ind = k_ind+1;
      t2 = setTimeout(function(){
        pretendKill(ind,cityUpdate,positionUpdate,currentCities,Kill);
      },t_time*2);
    } else if (run == true) {
      clearTimeout(t2);
      runItAll();
    } else {
      linkViewOn(sPath);
      clearTimeout(t2);
    }
  }
  function Kill(city,cityUpdate,positionUpdate) {
    removeCity = city;
    d3.select("#current_age").text("SHUTTING DOWN " + city).style("color",orangeTored(k_ind)).style("font-size","24");
    // remove city from cityUpdate and positonUpdate
    var cityInd = cityName2Ind_update[city];
    cityUpdate.splice(cityInd,1);
    positionUpdate.splice(cityInd,1);
    tmp=$(':regex(id,^'+ city +')');
    tmp_circles = tmp.filter("circle");
    tmp_paths = tmp.filter("path");
    tmp_circles.css({
      fill: orangeTored(k_ind)
    });
    tmp_circles.attr({
          r : cityScaleScore(k_ind)
        });
    tmp_paths.css({
      stroke: orangeTored(k_ind),
      opacity:1,
      strokeWidth:5
    });
    draw(cityUpdate,positionUpdate,locationByCity,
              linksByCity,countByCity,cities,sPath,true,removeCity);
    score_ind = score_ind+1;
    index_g = score_ind + (cities.length+1);
  }
  function checkStatus(score_ind) {
    if (score_ind>0) {
      // look to previous graph
      if (graph.game[score_ind].paths!=graph.game[score_ind-1].paths) {
        // this means you need a redraw
        clearGraph(draw,sPath);
      } 
    } 
  }
  function updateCityName2Ind(cityUpdate) {
    cityName2Ind_update = {};
    var i = 0;
    cityUpdate.forEach(function(n){
      cityName2Ind_update[n.AccentCity+" "+n.Region] = i;
      i = i+1;
    });
    return cityName2Ind_update;
  }
  function runItAll() {
    var tmp_speed = parseInt($("#speed").val());
        tmp_speed = isNaN(tmp_speed) ? 10 : tmp_speed;
        t_time = parseInt(speedScale(tmp_speed));
    if (score_ind<=graph.game.length) {
      checkStatus(score_ind);
      k_ind = 0;
      // select random cities
      var currentCities = [];
      var citySelection = $("circle");
      for (var i = 0; i < citySelection.length; i++) {
        currentCities.push(citySelection[i].getAttribute("id"));
      }
      cityName2Ind_update = updateCityName2Ind(cityUpdate);
      pretendKill(score_ind,cities,positions,currentCities,Kill);
      
    } else {
      linkViewOn(sPath);
    }
  }
  score_ind = where - (cities.length+1);
  runItAll();
}

function isItNew(cities,link){
  var newCity = cities[cities.length-1].altName;
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

function draw(cities_sub,positions,locationByCity,linksByCity,countByCity,allCities,sPath,score,removeCity){
  //debugger;
  sPath = sPath || [];
  score = score || false
  // make sure paths are reset
  percentRemaining = (cities_sub.length/graph.names.length)*100;
  if (score==false) {
    d3.select("#current_age").text("Current round: " + cities_sub.length);
    //debugger;
    d3.select("#progressbar")
      .attr("aria-valuenow",percentRemaining.toFixed(0))
      .style("width", percentRemaining.toFixed(0)+'%')
      .text(percentRemaining.toFixed(0)+"%");
    } else {
      d3.select("#progressbar")
      .attr("aria-valuenow",percentRemaining.toFixed(0))
      .style("width", percentRemaining.toFixed(0)+'%')
      .text(percentRemaining.toFixed(0)+"%");
    }
  var arc = d3.geo.greatArc()
    .source(function(d) { return locationByCity[d.source]; })
    .target(function(d) { return locationByCity[d.target]; });
  // Compute the Voronoi diagram of cities_sub projected positions.  
  var polygons = d3.geom.voronoi(positions);
  
  var g = cells.selectAll("g")
      .data(cities_sub,function(d) { return d.altName; });
  
  g.exit().selectAll("path.arc").transition().duration(t_time*10)
    .style("stroke","grey")
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
    .attr("id",function(d){ return d.altName; });
  g.append("svg:path")
      .attr("class", "cell")
      .attr("d", function(d, i) { 
        if (polygons[i].length>0) {
          return "M" + polygons[i].join("L") + "Z"; 
        }
      })
      .on("mouseover", function(d, i) {
        d3.select("#table_city").text(d.AccentCity);
        d3.select("#table_founded").text((allCities.length-d.age)+1);
        d3.select("#table_population").text(numberWithCommas(Math.round(((cities_sub.length-(cities_sub[0].age-d.age))/allCities.length)*countByCity[d.altName])));
        d3.select("#table_connections").text(numberWithCommas($(this.parentNode).children("path.arc").length));
      });
  var currentCities = [];
  for(i=0;i<cities_sub.length;i++){
      currentCities.push(cities_sub[i].altName);
  }
  var connections = g.selectAll("path.arc")
      .data(function(d) {
        //debugger;
        if (currentCities.indexOf(d.altName)>=0) {
          var paths = linksByCity[d.altName] || [];
          var paths_tor = [];
          if (paths.length>0) {
            for(i=0;i<paths.length;i++) {
              if (currentCities.indexOf(paths[i].source)>=0 && currentCities.indexOf(paths[i].target)>=0){
                  paths_tor.push(paths[i]);
              }
            }
          }
        }
        return paths_tor;
      },function(d){return d.source+d.target});

  connections.exit().transition().duration(t_time*10)
    .style("stroke","grey")
    .style("opacity",0)
    .style("stroke-width",0)
    .remove();

  var connectionsEnter = connections.enter().append("svg:path")
      .attr("class", "arc")
      .attr("d", function(d) { return path(arc(d)); })
      .attr("id", function(d) { return d.source+d.target })
      .style("opacity", function(d) { return isItNew(cities_sub,d) ? "1.0" : dPathOpacity } )
      .style("stroke",function(d) { return isItNew(cities_sub,d) ? "blue" : "black" })
      .style("stroke-width",function(d) { return isItNew(cities_sub,d) ? 10 : dPathWidth });
  //updated transitions
  g.selectAll("path.arc").transition().duration(t_time)
      .style("stroke",function(d){
        if (sPath.indexOf(d.source)==-1 && sPath.indexOf(d.target)==-1) {
          // make sure reverse if also reset?
          return "black";
        } else {
          return $(this).css("stroke");
        }   
      })
      .style("opacity",function(d){
        if (sPath.indexOf(d.source)==-1 && sPath.indexOf(d.target)==-1) {
          return dPathOpacity;
        } else {
          return $(this).css("opacity");
        }
      })
      .style("stroke-width",function(d){
        if (sPath.indexOf(d.source)==-1 && sPath.indexOf(d.target)==-1) {
          return dPathWidth+"px";
        } else {
          return $(this).css("stroke-width");
        }
      });
  
  var circlesUpdate = circles.selectAll("circle")
      .data(cities_sub,function(d) { return d.altName; });

  var circlesEnter = circlesUpdate.enter().append("svg:circle")
      .attr("cx", function(d, i) { return positions[i][0]; })
      .attr("cy", function(d, i) { return positions[i][1]; })
      .attr("r", function(d, i) { return cityScale(((cities_sub.length-(cities_sub[0].age-d.age))/allCities.length)*countByCity[d.altName]); })
      .attr("id",function(d) { return d.altName; })
      .style("fill",function(d) { return cityColorScale(cities_sub.length-(cities_sub[0].age-d.age)) } );
      //.sort(function(a, b) { return countByCity[d.AccentCity] - countByACity[d.AccentCity]; });
  //updated onex
  circlesUpdate.transition().duration(t_time)
    .attr("r", function(d, i) { 
      if (score == true) {
        //debugger;
      }
      if (d.altName!=sPath[0] && d.altName!=sPath[sPath.length-1]) {
        return cityScale(((cities_sub.length-(cities_sub[0].age-d.age))/allCities.length)*countByCity[d.altName]); 
      } else {
        return this.getAttribute("r");
      }
    })
    .style("fill",function(d) { 
       if (d.altName!=sPath[0] && d.altName!=sPath[sPath.length-1]) {
        return cityColorScale(cities_sub.length-(cities_sub[0].age-d.age));
      } else {
        return this.style["fill"];  
      }
    });
  var circlesExit = circlesUpdate.exit().transition().duration(t_time*10)
    //.attr("r",function(d,i){return this.getAttribute("r")/10})
    .attr("r",0)
    .style("opacity",0)
    .remove();
}

function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
 }
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref)
}

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

  




  

 



