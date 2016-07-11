StarterControllers.controller('DashboardCtrl', ['$scope', 'WeightFactory', 'HealthModuleFactory', function($scope, WeightFactory, HealthModuleFactory) {
  $scope.weight = WeightFactory;
  $scope.health = HealthModuleFactory;
  $scope.your_weight = 60;

  $scope.weight.load().then(function(data){
    console.log('loaded', data);
    //console.log('loaded.Rows', data.rows.length ? data.rows.item(data.rows.length - 1) : 0);
  }, function(err) {
    console.log('err1', err);
  });

  /*$scope.settings.load().then(function(data){
    console.log('loaded', data);
    //console.log('loaded.Rows', data.rows.length ? data.rows.item(data.rows.length - 1) : 0);
  }, function(err) {
    console.log('err1', err);
  });*/

  $scope.UpdateWeight = function(weight_value) {
    $scope.your_weight = weight_value;
    $scope.weight.save($scope.your_weight).then(function(data) {
      console.log('done', data);
      $scope.health.set(weight_value).then(function() {
        console.log('HealthApp saved record ', weight_value);
      });
    }, function(err){
      console.log('UpdateWeightError', err);
    });
  };

}]);
