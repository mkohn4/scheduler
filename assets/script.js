/*GIVEN I am using a daily planner to create a schedule
WHEN I open the planner
THEN the current day is displayed at the top of the calendar
WHEN I scroll down
THEN I am presented with time blocks for standard business hours
WHEN I view the time blocks for that day
THEN each time block is color-coded to indicate whether it is in the past, present, or future
WHEN I click into a time block
THEN I can enter an event
WHEN I click the save button for that time block
THEN the text for that event is saved in local storage
WHEN I refresh the page
THEN the saved events persist*/

//initialize object
var schedule = [];
var datetime = null;

//function that updates textarea classes with color coding based on time of day
function updateTimeColor() {
    //set variable to get current hour with moment js
    var currHour = moment().format("H");
    //turn current hour into an integer
    currHour = parseInt(currHour);

    //set schedule blocks counter to 0
    var schedBlocksNum = 0;
    //get number of elements in schedule
    var schedBlocks = document.querySelectorAll(".time-block");
    //loop through elements in schedule
    for (var i=0; i<schedBlocks.length; i++) {
        //grab id hour attribute and set equal to variable
        var idVal = $(".time-block").eq(schedBlocksNum).attr('id');
        //get partial value of id
        var idNum = idVal.replace('hour-','');
        //check if currHour is greater, equal to, or less than value of number to determine past, present and future
        if (currHour > idNum) {
            //add past class to textarea in number element
            $(".time-block").eq(schedBlocksNum).children('.description').addClass('past');
        } else if (currHour == idNum) {
            //add present class to textarea in number element
            $(".time-block").eq(schedBlocksNum).children('.description').addClass('present');
        } else if (currHour < idNum) {
            //add future class to textarea in number element
            $(".time-block").eq(schedBlocksNum).children('.description').addClass('future');
        };
        //increment schedBlocksNum so that loop will move to next element
        schedBlocksNum = schedBlocksNum+1;
    }
   
}

//run this function when a saveBtn element is clicked
function saveTask (event) {
    //assign hour variable to the time held by the hour block id
    var schedHour = $(event.target).closest('.time-block').attr('id');
    //assign value of textarea element to value variable
    var schedValue = $(event.target).siblings('.description').val();
    //add schedule block hour and value to object in array
    schedule.push({
        hour: schedHour,
        value: schedValue
    });
    //save in local storage as "schedule" with stringify'd version of schedule array
    localStorage.setItem("schedule", JSON.stringify(schedule));
};

//on page load, load tasks from local storage
function loadTasks () {
  
    //set object schedule = localStorage schedule
    schedule = JSON.parse(localStorage.getItem("schedule"));

    //if schedule NOT in localStorage, create schedule array
    if (!schedule) {
        schedule = [];
    } else {
        //set schedule blocks counter to 0
        var arrayNum = 0;
        //get number of elements in schedule
        var schedBlocks = document.querySelectorAll(".time-block");

        //loop through elements in schedule
        for (var i=0; i<schedBlocks.length; i++) {
            //grab id hour attribute and set equal to variable
            var idVal = $(".time-block").eq(i).attr('id');
            //if the idValue of the timeblock = the hour value in the array object
            if (idVal == schedule[arrayNum].hour) {
                //on the timeblock divs child textarea, set value of textarea = key/value pair in array that matches
                $(schedBlocks[i]).children('textarea').val(schedule[arrayNum].value);
                //increment schedule array counter
                arrayNum++;
                //if next schedule array position doesnt exist, exit loop
                if (!schedule[arrayNum]) {
                    return;
                }

            }
        }
    }


};

//on page load call other functions
function main() {
    //load tasks into schedule
    loadTasks();
    updateTimeColor();
    //update time colors based on past, present or future
    setInterval(updateTimeColor, (1000*60*30));
    //add click event to saveBtn elements
    $(document).on("click", ".saveBtn", saveTask);
};

function updateTime() {
    //set currentDay = momentjs datetime
    datetime.text(moment().format('MMMM Do YYYY, h:mm:ss a'));
}


//when page loads, display current date/time
$(document).ready( function() {
    //call main function
    main();
    //replace text of #currentDay element with current date and time
    datetime = $('#currentDay');
    //call updateTime function
    updateTime();
    //run updateTime function every second
    setInterval(updateTime, 1000);
 
});