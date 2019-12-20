
// Convert Millisenconds to minutes
function ConvertMilliSecondsToMinutes(intervalInMilliseconds){
    //console.log('Millisecond To Minute Converstion, Millisecond input '+ intervalInMilliseconds); //For Debugging
    if (intervalInMilliseconds==0 || intervalInMilliseconds==undefined){ 
        return 0; 
    }
    let intervalInMinutes=(intervalInMilliseconds/1000)/60;
    return intervalInMinutes;
}

// Angular module and controller
angular.module('popUpApp', ['ngMaterial'])
    .controller('sliderContainer', function ($scope) {
        $scope.color = {
            red: Math.floor(Math.random() * 255)
        };
       
        $scope.savedValue=function(){
            chrome.storage.sync.get(['hydration_reminder_alarm'], function (result) {
                $scope.value= ConvertMilliSecondsToMinutes(result.hydration_reminder_alarm);
                //console.log('Saved water Reminder Interval ' + $scope.value); //For Debugging
                $scope.$apply();
            });
        };

        $scope.OnChange = () => {
            chrome.runtime.sendMessage({
                command: "IntervalChange",
                interval: $scope.value
            });
        };
        $scope.savedValue();
    });

    
    