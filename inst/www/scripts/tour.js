
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
        element: "#TX",
        placement: "top",
        title: function(){ return "Congratulations, <b>" + name + "</b>!"; },
        content: "You have been selected by the President to plan the country's communication network. <p></p><p><i>You must be very smart!</i></p>"
      },
      {
        element: "#TX",
        placement: "top",
        title: "Your job",
        content: "<p>As the country grows and new cities are established they will need to be connected to other cities in the country. Each year a new city will be established. You choose the rules that determine how that new city gets wired into the network.</p><p></p><p>You will select how much influence each of the following has on the design of your network:</p>"
      },
      {
        element: "#option1",
        placement: "left",
        title: "Main navigation",
        content: "Here are the sections of this page, easily laid out."
      },
      {
        element: "#option2",
        placement: "left",
        title: "Main navigation",
        content: "Here are the sections of this page, easily laid out."
      },
      {
        element: "#option3",
        placement: "left",
        backdrop: false,
        title: "Main section",
        content: "This is a section that you can read. It has valuable information."
      },
      {
        element: "#go_network",
        placement: "left",
        backdrop: false,
        title: "Main section",
        content: "This is a section that you can read. It has valuable information."
      },
    ]);
 
   // Initialize the tour
    tour.init();
 
    // Start the tour
    tour.start();



