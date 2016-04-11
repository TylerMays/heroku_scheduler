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

  $scope.startCreating = function() {
    $scope.createJob();
    $scope.isCreating = true;
  };

  $scope.cancelCreating = function(job) {
    $scope.deleteJob(job);
    $scope.isCreating = false;
  };

  $scope.createJob = function() {
    $scope.list.push({});
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

      $scope.checkIfEditing = function(islast, job) {
        if ($scope.isCreating && islast) {
          return $scope.startEditing(job);
        } else {
          return $scope.isEditing;
        }
      };

      $scope.startEditing = function(job) {
        $scope.jobCopy = angular.copy(job);
        return $scope.isEditing = true;
      };

      $scope.finishEditing = function(job, copy) {
        job.name = copy.name;
        $scope.isEditing = false;
      };

      $scope.cancelEditing = function(isLast, job) {
       $scope.isCreating && isLast ?
         $scope.cancelCreating(job) :
         $scope.isEditing = false;
      };
    }
  };
});
