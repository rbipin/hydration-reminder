var scheduledDays = null;
getSavedValue();

//Get the value from persistance storage
function getSavedValue(keyname) {
    chrome.storage.sync.get(['hydration_schedule'], function (result) {
        //console.log('Saved Schedule ' + result.hydration_schedule); //For Debugging
        scheduledDays = result.hydration_schedule;
    });
}
// Convert Millisenconds to minutes
function convertMilliSecondsToMinutes(intervalInMilliseconds) {
    //console.log('Millisecond To Minute Converstion, Millisecond input '+ intervalInMilliseconds); //For Debugging
    if (intervalInMilliseconds == 0 || intervalInMilliseconds == undefined) {
        return 0;
    }
    let intervalInMinutes = (intervalInMilliseconds / 1000) / 60;
    return intervalInMinutes;
}

// Angular module and controller
angular.module('popUpApp', ['ngMaterial'])
    //First Controller to handle the interval slider
    .controller('sliderContainer', function ($scope) {
        $scope.color = {
            red: Math.floor(Math.random() * 255)
        };

        $scope.savedValue = function () {
            chrome.storage.sync.get(['hydration_reminder_alarm'], function (result) {
                $scope.value = convertMilliSecondsToMinutes(result.hydration_reminder_alarm);
                //console.log('Saved water Reminder Interval ' + $scope.value); //For Debugging
                $scope.$apply();
            });
        };

        //On Slider Change, update the interval
        $scope.OnChange = () => {
            let alertInterval=convertMinutesToMilliseconds($scope.value)
            updateInterval(alertInterval);
        };

        $scope.savedValue();
    })
    //Second Controller for handling the Days schedule
    .controller('DaysSwitchCtrl', function ($scope) {
        $scope.data = {};
        $scope.setSavedValue = function () {
            chrome.storage.sync.get(['hydration_schedule'], function (result) {
                //console.log('Inside set Saved value, schedule: ' + result.hydration_schedule); //for debugging
                let schedule = result.hydration_schedule;
                //console.log('schedule variable: ' + schedule); //for debugging
                if (schedule == undefined || schedule == null)
                    return;
                for (var itemCount = 0; itemCount <= schedule.length - 1; itemCount++) {
                    //console.log('item[' + itemCount + '] : ' + schedule[itemCount]) //for debugging
                    Object.defineProperty($scope.data, 'cb' + schedule[itemCount], {
                        value: true,
                        writable: true
                    });
                    //console.log(scope.data); //for debugging
                    $scope.$apply();
                }
            });
        };

        $scope.onChange = function (cbState, value) {
            //console.log('state: ' + cbState + 'value: ' + value); //for debugging
            updateSchedule(cbState, value);
        };

        $scope.setSavedValue();
    });

//Update the interval in chrome storage
function updateInterval(newInterval) {
    chrome.storage.sync.set({
        'hydration_reminder_alarm': newInterval
    }, function () {
        //console.log('Reminder Interval set to ' + newInterval); //For Debugging
    });
    //Send the message of the update
    chrome.runtime.sendMessage({
        command: "IntervalChange",
        interval: newInterval
    });
};

// Convert Minutes to milliseconds
function convertMinutesToMilliseconds(intervalInMinutes) {
    if (intervalInMinutes == 0 || intervalInMinutes == undefined) {
        return 0;
    }
    return (intervalInMinutes * 60 * 1000);
};

//Update the schedule
function updateSchedule(state, day) {
    //console.log('Scheduled Days: ' + scheduledDays); //for debugging
    if (scheduledDays == null || scheduledDays == undefined)
        scheduledDays = [];
    if (state) { //if state is true, push to the array
        if (!scheduledDays.includes(day)) {
            scheduledDays.push(day);
        }
    } else { //if state is false, remove from array
        for (var count = scheduledDays.length - 1; count >= 0; count--) {
            if (scheduledDays[count] == day) {
                scheduledDays.splice(count, 1);
            }
        }
    }
    //store to persistance storage
    chrome.storage.sync.set({
        'hydration_schedule': scheduledDays
    }, function () {
        //console.log('Schedule set to ' + scheduledDays); //For Debugging
    });
    //Send the change
    chrome.runtime.sendMessage({
        command: "ScheduleChange",
        alertScheduleDays: scheduledDays
    });
};