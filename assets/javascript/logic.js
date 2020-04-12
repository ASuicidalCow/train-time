
// Your web app's Firebase configuration

  // Your web app's Firebase configuration
  var Config = {
    apiKey: "AIzaSyAyY3y9DywcglR6zGd_xBM96tkwsr7aHxI",
    authDomain: "train-time-f8f9a.firebaseapp.com",
    databaseURL: "https://train-time-f8f9a.firebaseio.com",
    projectId: "train-time-f8f9a",
    storageBucket: "train-time-f8f9a.appspot.com",
    messagingSenderId: "20790016830",
    appId: "1:20790016830:web:d53f095444f0033a37ca6f"
  };
  // Initialize Firebase
  firebase.initializeApp(Config);

 var database = firebase.database().ref();

 // global variables

 var localArray = [];
var editableIndexNumber;

// This callback keeps the page updated when a value changes in firebase.
database.on("value", function(snapshot) {
	
	if (snapshot.child('databaseArray').exists()) {
		localArray = snapshot.val().databaseArray;
		loadTrains();

	} else {
		localArray = [];
	}
})


// onClick function collecting input values
$('#submit').click(function(event) {

	if ($('#name').val() === ""|| $('#dest').val() === ""|| $('#time').val() === "") {
		event.preventDefault();
		alert("Please fill out all form fields");

	} else {
		event.preventDefault();

		var tName = $('#name').val();
		var tDest = $('#dest').val();
		var tTime = moment($('#time').val(), 'HH:mm A').format('h:mm A');
		var tTimeUnix = moment($('#time').val(), 'HH:mm A').format('X');
		var currentTime = moment().format('h:mm A');
		var currentTimeUnix = moment().format('X');


		if (tTimeUnix > currentTimeUnix) {
			console.log('if');
			var tRemain = moment(tTime, 'HH:mm A').fromNow(true) + " from now";


		} else {
			console.log('else');
			var tRemain = "This Train has already left";
		}
		
		var trainObject = {
		  	name: tName,
		  	dest: tDest,
		  	time: tTime,
		  	remain: tRemain
		  };

		localArray.push(trainObject);

		$('#name').val('');
		$('#dest').val('');
		$('#time').val('');

		database.set({
		  databaseArray:localArray
		})

		$('tbody').empty();
		loadTrains();
	}
});

//change page to authorized user on click of login button
$(".container").on("click", "#login", function () {
	window.location.href ="https://fredlintz5.github.io/trainScheduler/authorizedUser";
});

//change page to back to main on click of logout button
$(".container").on("click", "#logout", function () {
	window.location.href ="https://fredlintz5.github.io/trainScheduler/";
});


//remove train data from page, and local/remote arrays
$('tbody').on("click", "#remove", function() {

    var indexNumber = $(this).data('index');
	
	localArray.splice(indexNumber, 1);

	database.set({
  		databaseArray:localArray
	})

 	$('tbody').empty();

	loadTrains();	
});


//edit train data on page, and update remote data
$('tbody').on("click", "#edit", function() {

    editableIndexNumber = $(this).data('index');
	var offset = $(this).offset();

	$('.container').css('opacity', '0.1');
    $('#hiddenFields').removeClass('hide');
    $('#hiddenFields').css({
    		top: offset.top -700,
    	});
});


// submit edited inputs to replace corresponding values
$('#editedSubmit').click(function() {

	if ($('#editedName').val() === ""|| $('#editedDest').val() === ""|| $('#editedTime').val() === "") {
		alert("Please fill out all form fields");

	} else {

	    var editedName = $('#editedName').val();
		var editedDest = $('#editedDest').val();
		var editedTime = moment($('#editedTime').val(), 'HH:mm A').format('h:mm A');
		var tTimeUnix = moment($('#time').val(), 'HH:mm A').format('X');
		var currentTime = moment().format('h:mm A');
		var currentTimeUnix = moment().format('X');
		
		if (tTimeUnix > currentTimeUnix) {
			var editedRemain = moment(editedTime, 'HH:mm A').fromNow(true) + " from now";

		} else {
			var editedRemain = "This Train has already left";
		}


		localArray.splice(editableIndexNumber, 1, {
			name: editedName,
		  	dest: editedDest,
		  	time: editedTime,
		  	remain: editedRemain
		});


		var editedName = $('#editedName').val("");
		var editedDest = $('#editedDest').val("");
		var editedTime = $('#editedTime').val("");

		database.set({
			databaseArray:localArray
		})

	 	$('tbody').empty();

	 	$('.container').css('opacity', '1.0');
    	$('#hiddenFields').addClass('hide');


		loadTrains();
	}
});
	

//load train data form localArray to page
function loadTrains() {

	for (var i = 0; i < localArray.length; i++) {

		var newData = $('<tr>');

		newData.attr('data-index', [i]);
		newData.append("<td>"+localArray[i].name);
		newData.append("<td>"+localArray[i].dest);
		newData.append("<td>"+localArray[i].time);
		// newData.append("<td>"+localArray[i].freq);
		newData.append("<td>"+localArray[i].remain);

		$('tbody').append(newData);
	}

	var homePage = "https://fredlintz5.github.io/trainScheduler/";

	// hide remove buttons on consumer screen
	if (window.location.href == homePage) {
		$('tr > button').toggleClass('hide');
	}
}