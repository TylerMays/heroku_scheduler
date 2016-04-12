angular.module('JobScheduler', [])
.controller('JobCtrl', function($scope, $filter) {

  $scope.jobList = [
    {
      name: "rake the leaves",
      dynoSize: "Free",
      frequency: "Daily",
      lastRun: "Never",
      nextDue: "01:00"
    }, {
      name: "make me a sandwhich",
      dynoSize: "Free",
      frequency: "Hourly",
      lastRun: "Never",
      nextDue: "00:20"
    }, {
      name: "rails generate cash",
      dynoSize: "Free",
      frequency: "Every 10 minutes",
      lastRun: "Never",
      nextDue: "3:33"
    }
  ];

  $scope.isCreating = false;

  $scope.setNotCreating = function() {
    $scope.isCreating = false;
  };

  $scope.startCreating = function() {
    $scope.createJob();
    $scope.isCreating = true;
  };

  $scope.cancelCreating = function(job) {
    $scope.deleteJob(job);
    $scope.isCreating = false;
  };

  $scope.createJob = function() {
    $scope.jobList.push({});
  };

  $scope.deleteJob = function(job) {
    var idx = $scope.jobList.indexOf(job);
    $scope.jobList.splice(idx, 1);
  };


  // Time methods and Select Options
  $scope.now = function() {
    return new Date();
  };

  $scope.inTenMinutes = function() {
    var timePlusTen = new Date( new Date().getTime() + 10*60000 );
    return $filter('date')(timePlusTen, "HH':'mm");
  };

  $scope.isFrequencySelected = function(option, selected) {
    return (option === selected) ? true : false;
  };

  $scope.frequencyOpts = ['Daily', 'Hourly', 'Every 10 minutes'];

  $scope.nextDueOpts = function(frequencyOpt) {
    if (frequencyOpt === "Daily") {
      return ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
              "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
              "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
              "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
              "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
              "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
    } else if (frequencyOpt === "Hourly") {
      return [{value:'00:00', text: ":00"},{value:'00:10',text: ":10"},{value:'00:20',text: ":20"},
              {value:'00:30',text: ":30"},{value:'00:40',text: ":40"},{value:'00:50',text: ":50"}];
    }
  };
})

.directive('jobState', function() {
  return {
    controller: function($scope) {

      $scope.isEditing = false;
      $scope.jobCopy = null;

      function newJobShouldBeEditing(isLast) {
        return (isLast && $scope.isCreating && !$scope.isEditing) ? true : false;
      };

      $scope.checkIfEditing = function(isLast, job) {
        if (newJobShouldBeEditing(isLast)) {
          return $scope.startEditing(job);
        } else {
          return $scope.isEditing;
        }
      };

      $scope.startEditing = function(job) {
        $scope.jobCopy = angular.copy(job);
        return $scope.isEditing = true;
      };

      $scope.cancelEditing = function(isLast, job) {
        $scope.isCreating && isLast ?
          $scope.cancelCreating(job) :
          $scope.isEditing = false;
      };

      function isValidJobName(job) {
        return (job.name && (job.name !== "")) ? true : false;
      };

      function newJobIsBeingSaved(isLast) {
        return (isLast && $scope.isCreating && $scope.isEditing) ? true : false;
      };

      $scope.saveJob = function(job, copy, isLast) {
        if (isValidJobName(copy)) {
          job.name = copy.name;
          job.dynoSize = copy.dynoSize;
          job.frequency = copy.frequency;
          job.lastRun = copy.lastRun;
          job.nextDue = copy.nextDue;

          if (newJobIsBeingSaved(isLast)) {
            $scope.setNotCreating();
          }
          $scope.isEditing = false;
        }
      };
    }
  };
});
