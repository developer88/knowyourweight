StarterControllers.controller('SettingsCtrl', ['$scope', 'WeightFactory', 'SettingsFactory', 'HealthModuleFactory', function($scope, WeightFactory, SettingsFactory, HealthModuleFactory) {
  $scope.weight = WeightFactory;
  $scope.settings = SettingsFactory;
  $scope.health = HealthModuleFactory;
  $scope.connection_needed = false;
  $scope.settings_data = {health_available: null};

  $scope.settings.load().then(function(data){
    data.health_available = null;
    $scope.settings_data = data;
    console.log('Settingsloaded', data);
    $scope.health.available().then(function(data) {
      $scope.settings_data.health_available = true;
    }, function() {
      $scope.settings_data.health_available = false;
    });
    //console.log('loaded.Rows', data.rows.length ? data.rows.item(data.rows.length - 1) : 0);
  }, function(err) {
    console.log('err1Settings', err);
  });

  $scope.authorize_health = function() {
    $scope.health.authorize().then(function(data){
      console.log("AuthorizationSuccess", data);
      $scope.settings_data.health_app_connection = true;
      $scope.settings.save($scope.settings_data).then(function(data){
        console.log('Settings updated');
      }, function(data) {
        console.log('Settings updated failed');
      });
    }, function(err) {
      console.log("AuthorizationError", err);
    });
  };

  $scope.ClearWeight = function() {
    $scope.weight.clear().then(function(data) {
      console.log('Cleardone', data);
    }, function(err){
      console.log('ClearWeightError', err);
    });
  };

}]);
