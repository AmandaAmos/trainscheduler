var moment = require("moment");

 // Your web app's Firebase configuration
var config = {
    apiKey: "AIzaSyC5yItKarMp5MMg79tV8SNwn4SQgPWTbcE",
    authDomain: "trainscheduler-24aka.firebaseapp.com",
    databaseURL: "https://trainscheduler-24aka.firebaseio.com",
    // projectId: "trainscheduler-24aka",
    storageBucket: "trainscheduler-24aka.appspot.com",
    // messagingSenderId: "770460365846"
};
//initialize Firebase
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn".on("click", function (e) {
    e.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = $("#first-train-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    if (trainName !== "" && destination !== "" && firstTrainTime !== "" && frequency !== "") {
        var newEntry = {
            "train-name": trainName,
            destination: destination,
            "first-train-time": firstTrainTime,
            frequency: frequency
        };
        database.ref("/info").push(newEntry);
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");
    };
}));

database.ref("/info").on("child_added", function (childsnapshot) {
    var tFrequency = childsnapshot.val().frequency;
    var firstTrainTimeConverter = moment(childsnapshot.val()["first-train-time"], "HHmm");
    var militaryTime = firstTrainTimeConverter.format("HH:mm A");

    var diffTime = moment().diff(firstTrainTimeConverter, "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrainMins = moment().add(tMinutesTillTrain, "minutes");
    var nextArrival = moment*(nextTrainMins).format("HH:mm A");

    var newEntryObj = {
        trainName: childsnapshot.val()["train-name"],
        destination: childsnapshot.val().destination,
        frequency: childsnapshot.val().frequency,
        nextArrival: nextArrival,
        minsAway: tMinutesTillTrain
    };

    var tr = $("<tr>");
    tr.addClass(childsnapshot.key);
    tr.append(
        $("<td>").text(newEntryObj.trainName).addClass("name"),
        $("<td>").text(newEntryObj.destination).addClass("destination"),
        $("<td>").text(newEntryObj.frequency).addClass("frequency"),
        $("<td>").text(newEntryObj.nextArrival).addClass("time"),
        $("<td>").text(newEntryObj.minsAway).addClass("minsAway"),
    );
    $("train-table").append(tr);
});



        

   