// Firebase Config String
var config = {
    apiKey: "AIzaSyA7LH00IwXVyCoIcBmE-Q9rFWExzhPNhQw",
    authDomain: "train-scheduler-8d78e.firebaseapp.com",
    databaseURL: "https://train-scheduler-8d78e.firebaseio.com",
    projectId: "train-scheduler-8d78e",
    storageBucket: "train-scheduler-8d78e.appspot.com",
    messagingSenderId: "528165487668"
};

// Pass config paramters to firebase
firebase.initializeApp(config);

// Set database to Firebase database.
var database = firebase.database();
  
var remainder = 0;
  // var momentTime = moment(localTime, "hh:mm a").format("X");
  
// Train - Name
var name = "";

// Train - Destination
var destination = "";

// Train - Depart Time
var time = 0;

// Train - Frequency
var frequency = 0;

// Train - Next Arrival Time
var nextArrival = 0;

// Train - Current Minutes Away
var minutesAway = 0;
  
 // When a user clicks the "Add Train" button in our form
 // pass values to firebase, when a new 

  
  $("#add-train").on("click", function(event) {
    event.preventDefault();
  
    // Grabbed values from text boxes
    name        = $("#train-name").val().trim();
    destination = $("#train-destination").val().trim();
    time        = moment($("#train-firstTime").val().trim(), "HH:mm").format("X");
    frequency   = parseInt($("#train-frequency").val().trim());
    
  
    // Pass our values to Firebase using push
    database.ref().push({
      name: name,
      destination: destination,
      time: time,
      frequency: frequency
    });
  
  });
  
  database.ref().on("child_added", function(childSnapshot) {
  
        time        = childSnapshot.val().time;
        frequency   = childSnapshot.val().frequency + 000;
        newTime = moment(moment.unix(time).add(frequency, "m")).format("X");
  
      // take your initial time, take your current time, find difference in minutes, divide(%) minutes 
      // by freq, take remainder and thats your time remaining 
  
  
        // newTime = time
  
        nextArrival = moment.unix(time).format("hh:mm A");
        minutesAway = moment.unix(time).diff(moment(), "minutes");
        remainder   = minutesAway % frequency;
  
  
        if (remainder < 0) {
  
          nextArrival = moment.unix(newTime).format("hh:mm A");
          minutesAway = moment.unix(newTime).diff(moment(), "minutes");
  
        }
  
  
      // minutesAway = moment.unix(moment.unix(time).add(frequency, "m").format("X")).diff(moment(), "minutes")
      // moment.unix(time).diff(moment(), "minutes")
        
  
  
        $("#display").append("<tr><td>" + childSnapshot.val().name +
          "</td><td>" + childSnapshot.val().destination +
          "</td><td>" + childSnapshot.val().frequency +
          "</td><td>" + nextArrival +
          "</td><td>" + minutesAway + " min" +"</td></tr>");
  
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#train-firstTime").val("");
        $("#train-frequencyt").val("");
  
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });


/*  ref.once("value", function(data) {

  });
  */