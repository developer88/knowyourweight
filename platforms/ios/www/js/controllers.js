angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  /*$scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };*/
})

.controller('DashboardCtrl', ['$scope', 'WeightFactory', 'HealthModuleFactory', function($scope, WeightFactory, HealthModuleFactory) {
  $scope.weight = WeightFactory;
  $scope.health = HealthModuleFactory;
  $scope.your_weight = 60;

  $scope.weight.load().then(function(data){
    console.log('loaded', data);
    //console.log('loaded.Rows', data.rows.length ? data.rows.item(data.rows.length - 1) : 0);
  }, function(err) {
    console.log('err1', err);
  });

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

}])

.controller('SettingsCtrl', ['$scope', 'WeightFactory', function($scope, WeightFactory) {
  $scope.weight = WeightFactory;

  $scope.ClearWeight = function() {
    $scope.weight.clear().then(function(data) {
      console.log('Cleardone', data);
    }, function(err){
      console.log('ClearWeightError', err);
    });
  };

}]);
