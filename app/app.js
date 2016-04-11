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
});