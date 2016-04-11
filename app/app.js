angular.module('JobScheduler', [])
.controller('JobCtrl', function($scope) {

  $scope.jobList = [
    {
      name: 'rake'
    }, {
      name: 'mop'
    }, {
      name: 'sweep'
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
          if (newJobIsBeingSaved(isLast)) {
            $scope.setNotCreating();
          }
          $scope.isEditing = false;
        }
      };
    }
  };
});
