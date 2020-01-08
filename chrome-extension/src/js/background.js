//global variables
let alertInvervalTime = 0;
let alertTriggered = false;
let intervalId;
let alertScheduleDays=[];

Promise.all([getSavedInterval(), loadSavedSchedule()])
.then(()=>startAlert());

//chrome message listener
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.command) {
            case "IntervalChange":
                alertInvervalTime = request.interval;
                onIntervalChange(alertInvervalTime);
                break;
            case "ScheduleChange":
                alertScheduleDays=request.alertScheduleDays;
                startAlert();
                break;    
        }
    });

//When chrome notification is closed, reset triggered variable to false.
chrome.notifications.onClosed.addListener(function(notificationID, byUser) {
    //console.log('chrome notification closed'); //For Debugging
    resetAlertTrigger();
});

//When chrome notification is clicked, reset the triggered variable to false.
chrome.notifications.onClicked.addListener(function (notificationID){
    //console.log('chrome notification closed'); //For Debugging
    resetAlertTrigger();
});

//Reset the alert triggered
function resetAlertTrigger(){
    alertTriggered = false;
}

//Get the interval time if it is already saved in chrome storage sync
function getSavedInterval() {
    return new Promise((resolve, reject)=>{
        chrome.storage.sync.get(['hydration_reminder_alarm'], function (result) {
            //console.log('Saved water Reminder Interval ' + result.hydration_reminder_alarm); //For Debugging
            if (result.hydration_reminder_alarm == undefined) {
                alertInvervalTime = 0;
                return;
            }
            alertInvervalTime = result.hydration_reminder_alarm;
            resolve();
        })
    }
    );
}

//load the saved Schedule from chrome storage sync
function loadSavedSchedule(){
    return new Promise((resolve, reject)=>{
        chrome.storage.sync.get(['hydration_schedule'], function (result) {
            //console.log('Saved water Reminder Schedule: ' + result.hydration_schedule); //For Debugging
            alertScheduleDays = result.hydration_schedule;
            resolve();
        })
    });
}


//On Invterval change, Clear the interval, update the value and start the alerting process
function onIntervalChange(interval) {
    clearAlertInterval();
    startAlert();
};

//Clear the set Interval timer
function clearAlertInterval() {
    if (intervalId != undefined) {
        clearInterval(intervalId);
    }
};

//Start a timer to trigger notification to drink water for that time
function startAlert() {
    //console.log('Inside start alert alertInterval: '+ alertInvervalTime + " alertTriggered: "+alertTriggered +" alertSchedule: "+alertScheduleDays); //For Debugging   
    if (alertInvervalTime == 0 || alertInvervalTime == undefined || !isScheduledDay() ) {
        //console.log("Reminder is not running"); //For Debugging
        clearAlertInterval();
        return;
    }
    //console.log('Setting the alert'); //For Debugging;
     intervalId = window.setInterval(() => {
        if (alertTriggered == false) {
            var today = new Date(); //For Debugging
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //For Debugging
            //console.log('triggering alert '+date +" " + today.toTimeString()); //For Debugging
            triggerAlert();
            alertTriggered = true;
        }
    }, alertInvervalTime);
    //console.log('Alert Trigger Set, intervalId: '+intervalId); //For Debugging
};

//Check if the day is scheduled
function isScheduledDay(){   
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
function triggerAlert() {
    var notificationOptions = {
        type: "basic",
        title: "Hydration Reminder",
        message: "Hydrate Now!!",
        iconUrl: "assets/icons/bottle-32.png"

    };
    chrome.notifications.create(notificationOptions);
};