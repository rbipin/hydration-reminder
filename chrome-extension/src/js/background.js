//global variables
let alertInvervalTime = 0;
let alertTriggered = false;
let intervalId;
let alertScheduleDays=[];

//chrome message listener
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.command) {
            case "IntervalChange":
                var intervalInMilliseconds = ConvertMinutesToMilliseconds(request.interval)
                OnIntervalChange(intervalInMilliseconds)
                break;
            case "ScheduleChange":
                loadSavedSchedule();
                StartAlert();
                break;    
        }
    });

//When chrome notification is closed, reset triggered variable to false.
chrome.notifications.onClosed.addListener(function(notificationID, byUser) {
    //console.log('chrome notification closed'); //For Debugging
    ResetAlertTrigger();
});

//When chrome notification is clicked, reset the triggered variable to false.
chrome.notifications.onClicked.addListener(function (notificationID){
    //console.log('chrome notification closed'); //For Debugging
    ResetAlertTrigger();
});

//Reset the alert triggered
function ResetAlertTrigger(){
    alertTriggered = false;
}

GetSavedInterval();
loadSavedSchedule();
StartAlert();

//Get the interval time if it is already saved in chrome
function GetSavedInterval() {
    chrome.storage.sync.get(['hydration_reminder_alarm'], function (result) {
        //console.log('Saved water Reminder Interval ' + result.hydration_reminder_alarm); //For Debugging
        if (result.hydration_reminder_alarm == undefined) {
            alertInvervalTime = 0;
            return;
        }
        alertInvervalTime = result.hydration_reminder_alarm;
    });
}

function loadSavedSchedule(){
    chrome.storage.sync.get(['hydration_schedule'], function (result) {
        //console.log('Saved water Reminder Interval ' + result.hydration_reminder_alarm); //For Debugging
        alertScheduleDays = result.hydration_schedule;
    });
}


//On Invterval change, Clear the interval, update the value and start the alerting process
function OnIntervalChange(interval) {
    ClearInterval();
    UpdateInterval(interval);
    StartAlert();
};

//Clear the set Interval timer
function ClearInterval() {
    if (intervalId != undefined) {
        clearInterval(intervalId);
    }
};

//Update the interval in chrome storage
function UpdateInterval(newInterval) {
    alertInvervalTime = newInterval;
    chrome.storage.sync.set({
        'hydration_reminder_alarm': alertInvervalTime
    }, function () {
        //console.log('Reminder Interval set to ' + newInterval); //For Debugging
    });
};

//Start a timer to trigger notification to drink water for that time
function StartAlert() {
        
    if (alertInvervalTime == 0 || alertInvervalTime == undefined || !IsScheduledDay() ) {
        //console.log("Reminder is not running"); //For Debugging
        clearInterval();
        return;
    }
    intervalId = window.setInterval(() => {
        if (alertTriggered == false) {
            //var d = new Date(); //For Debugging
            //console.log('triggering alert ' + d.toTimeString()); //For Debugging
            CreateAlert();
            alertTriggered = true;
        }
    }, alertInvervalTime);
};

//Check if the day is scheduled
function IsScheduledDay(){   
    if (alertScheduleDays==null || alertScheduleDays==undefined || alertScheduleDays.length==0){
        return false;
    }   
    let current_date = new Date()
    let dayOfWeek=current_date.getDay()+1;
    if (alertScheduleDays.includes(dayOfWeek)){
        return true;
    }  
    return false;
}

//Create the alert message from chrome notification to drink water.
function CreateAlert() {
    var notificationOptions = {
        type: "basic",
        title: "Hydration Reminder",
        message: "Hydrate Now!!",
        iconUrl: "assets/icons/bottle-32.png"

    };
    chrome.notifications.create(notificationOptions);
};

// Convert Minutes to milliseconds
function ConvertMinutesToMilliseconds(intervalInMinutes) {
    return (intervalInMinutes * 60 * 1000);
};