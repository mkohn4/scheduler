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
var schedule = {};

function updateTimeColor() {
    //set variable to get current hour with moment js
    var currHour = moment().format("H");
    //turn current hour into an integer
    currHour = parseInt(currHour);
    console.log("currHour = " + currHour);

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
        console.log(idNum);
        //if current hour value is greater than idNum, time has passed
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

        schedBlocksNum = schedBlocksNum+1;
    }
   
}

//run this function when a saveBtn element is clicked
function saveTask (event) {
    //assign hour variable to the time held by the hour block id
    var schedHour = $(event.target).closest('.time-block').attr('id');
    //assign value of textarea element to value variable
    var schedValue = $(event.target).siblings('.description').val();
    //add schedule block hour and value to object
    schedule.cal.push({
        hour: schedHour,
        value: schedValue
    });
    console.log(JSON.stringify(schedule));
    //save in local storage
    //localStorage.setItem(hour, value);
};

//on page load, load tasks from local storage
function loadTasks () {
    //set object schedule = localStorage schedule
    schedule = JSON.parse(localStorage.getItem(schedule));

    //if schedule NOT in localStorage, create object schedule
    if (!schedule) {
        schedule = {
            cal: []
        };
    }

};

//on page load
function main() {
    //load tasks into schedule
    loadTasks();
    //update time colors based on past, present or future
    updateTimeColor();

    //add click event to saveBtn elements
    $(document).on("click", ".saveBtn", saveTask);
};




//when page loads, display current date/time
$(document).ready( function() {
    //replace text of #currentDay element with current date and time
    $('#currentDay').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    
    //call main function
    main();
});