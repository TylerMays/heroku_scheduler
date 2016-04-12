angular.module('JobScheduler', ['ngMockE2E'])
.controller('JobCtrl', function($scope, $filter, $http, $timeout) {

    $scope.getJobs = function() {
      $http.get('/jobs').then(function(response) {
        $scope.jobList = response.data;
      });
    };

    $scope.postJob = function(job) {
      $http.post('/jobs', job).then(function(response) {
        $scope.jobList = response.data;
        console.log("POST JOB: ", $scope.jobList)
      });
    };

    $scope.putJob = function(job) {
      $http.put('/jobs', job).then(function(response) {
        $scope.jobList = response.data;
        console.log("after PUT JOB: ", $scope.jobList)
      });
    };

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
  };

  $scope.createJob = function() {
    $scope.jobList.push({});
  };

  $scope.deleteJob = function(job) {
    var idx = $scope.jobList.indexOf(job);
    $http.delete('/jobs', {data: idx}).then(function(response) {
      $scope.jobList = response.data;
    });
    $timeout(function () {
      $scope.isCreating = false;
    }, 0);
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

  $scope.getJobs();
})

.directive('jobState', function() {
  return {
    controller: function($scope) {

      var isEditing = false;
      $scope.isRemoving = false;
      $scope.jobCopy = null;

      function newJobShouldBeEditing(isLast) {
        return (isLast && $scope.isCreating && !isEditing) ? true : false;
      };

      $scope.checkIfEditing = function(isLast, job) {
        if (newJobShouldBeEditing(isLast)) {
          return $scope.startEditing(job);
        } else {
          return isEditing;
        }
      };

      $scope.startEditing = function(job) {
        if (!$scope.isRemoving) {
          $scope.jobCopy = angular.copy(job);
          return isEditing = true;
        }
      };

      $scope.cancelEditing = function(isLast, job) {
        $scope.isCreating && isLast ?
          $scope.cancelCreating(job) :
          isEditing = false;
      };

      $scope.startRemoving = function() {
        $scope.isRemoving = true;
      };

      $scope.cancelRemoving = function() {
        $scope.isRemoving = false;
      };

      function isValidJobName(job) {
        return (job.name && (job.name !== "")) ? true : false;
      };

      function newJobIsBeingSaved(isLast) {
        return (isLast && $scope.isCreating && isEditing) ? true : false;
      };

      $scope.saveJob = function(job, copy, isLast) {
        if (isValidJobName(copy)) {
          if (newJobIsBeingSaved(isLast)) {
            $scope.postJob(copy);
            $scope.setNotCreating();
          } else {
            if ($scope.isCreating && !isLast) {
              $scope.jobList.pop();
              $scope.setNotCreating();
            }
            job.name = copy.name;
            job.dynoSize = copy.dynoSize;
            job.frequency = copy.frequency;
            job.lastRun = copy.lastRun;
            job.nextDue = copy.nextDue;
            $scope.putJob($scope.jobList);
          }
          isEditing = false;
        }
      };
    }
  };
})

//  Mock Backend
.run(function($httpBackend) {

  var jobs = [
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

  $httpBackend.whenGET('/jobs').respond(jobs);

  $httpBackend.whenPOST('/jobs').respond(function(method, url, data) {
    var job = angular.fromJson(data);
    jobs.push(job);
    return [200, jobs, {}];
  });

  $httpBackend.whenPUT('/jobs').respond(function(method, url, data) {
    var newJobs = angular.fromJson(data);
    jobs = newJobs;
    return [200, jobs, {}];
  });

  $httpBackend.whenDELETE('/jobs').respond(function(method, url, data) {
    jobs.splice(data, 1);
    return [200, jobs, {}];
  });
});
