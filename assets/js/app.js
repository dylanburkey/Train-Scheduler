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
  
// Remove Variables
  
 // When a user clicks the "Add Train" button in our form
 // pass values to firebase, when a new 
$("#add-train").on("click", function(event) {
    event.preventDefault();

    var name        = $("#train-name").val().trim();
    var destination = $("#train-destination").val().trim();
    var time        = moment($("#train-firstTime").val().trim(), "HH:mm").format("X");
    //newTime;    =  moment($("#train-firstTime").val().trim(), "DD/MM/YY").format("X");
    var frequency = $("#train-frequency").val().trim();


      $("#train-name").val('');
      $("#train-destination").val('');
      $("#train-firstTime").val('');
      $("#train-frequency").val('');


      /*
      Pass our values to Firebase using push
            database.ref().push({name: name,
        destination: destination,
      time: time,
      frequency: frequency
    });
    */

    // new temp object for Firebase
    /*var newTrain = {
        name: name,
        destination: destination,
        time: time,
        frequency: frequency
    }
    */

    // Reference the newTrain object when passing to Firebase

    /*console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);
    */

      // Code for handling the push
      database.ref('/train/schedule').push({
          trainName: name,
          trainDestination: destination,
          trainTime: time,
          trainFrequency: frequency,
          // ADd Timestap for sorting later
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  
  });


database.ref('/train/schedule').orderByChild("dateAdded").limitToLast(30).on("child_added", function (snapshot) {
    // database.ref().on("child_added", function(childSnapshot) {

    //  Create a value to return the value in Firebase
    var serverValue = snapshot.val();

    //time        = childSnapshot.val().time;
    // frequency   = childSnapshot.val().frequency + 000;
    // newTime = moment(moment.unix(time).add(frequency, "m")).format("X");

    // take your initial time, take your current time, find difference in minutes, divide(%) minutes
    // by freq, take remainder and thats your time remaining
    // initialTime - currentTrainTime
    // timeDifference/freq


    var tDateAdded = moment(serverValue.dateAdded);
    // Console.loging the last user's data
    //\console.log(serverValue.trainName, serverValue.destination, serverValue.FirstTrainTime, serverValue.frequency, DateAdded, serverValue.dateAdded);

   // Math for Train Scheduler
    //

    // firstTrainTime - Trying to subtract a year so I am not returning negative values
    var firstTrainTime = moment(serverValue.trainTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTrainTime = moment();

    // Difference between the times
    var timeDifference = moment().diff(moment(firstTrainTime), "minutes");

    // timeDifference % Frequency
    var timeRemainder = timeDifference % serverValue.trainFrequency;

    // Subtract frequency from our timeRemainder value
    var minutesUntilTrain = serverValue.trainFrequency - timeRemainder;

    // Next Train Value
    var nextTrain = moment().add(minutesUntilTrain, "minutes");


    // Create some tbody variables for data returned from Firebase

    // Table Row
    var tr = $('<tr>');

    var tdTrain = $('<td>');
    // Return trainName value
    tdTrain.text(serverValue.trainName);

    var tdDestination = $('<td>');
    tdDestination.text(serverValue.trainDestination);

    var tdFrequency = $('<td>');
    tdFrequency.text(serverValue.trainFrequency);
    // Next Arrival
    var tdNextArrival = $('<td>');

    var nextTrainTimeConverted=moment(nextTrain).format("hh:mm") ;
    tdNextArrival.text(nextTrainTimeConverted);

    var tdMinutesAway = $('<td>');
    tdMinutesAway.text(minutesUntilTrain);



        // minutesAway = moment.unix(moment.unix(time).add(frequency, "m").format("X")).diff(moment(), "minutes")
        // moment.unix(time).diff(moment(), "minutes")


        /*
         $("#display").append("<tr><td>" + childSnapshot.val().name +
           "</td><td>" + childSnapshot.val().destination +
           "</td><td>" + childSnapshot.val().frequency +
           "</td><td>" + nextArrival +
           "</td><td>" + minutesAway + " min" +"</td></tr>");
   */
        tr.append(tdTrain).append(tdDestination).append(tdFrequency).append(tdNextArrival).append(tdMinutesAway);

        // Add Values to our tbody
        $('#train-schedule').append(tr);

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });



