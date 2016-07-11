// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.factories'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    window.health = {available: false, module_type: "ios"};

    if (window.cordova && window.cordova.plugins.healthkit) {
       console.log('healthKit cordova plugin  available');
      window.plugins.cordova.healthkit.available(
        function(data) {
          window.health.available = true;
        }
      );
    }

    // TODO check for Google kit

    var db = null, sql_engine = null;
    if(window.cordova) {
      db = $cordovaSQLite.openDatabase({name: "know_your_weight", iosDatabaseLocation: 'default'}); //app syntax
      sql_engine = $cordovaSQLite;
    } else {
      db = window.openDatabase("know_your_weight.db", "1.0", "know_your_weight", 2 * 1024 * 1024); // ionic serve syntax
    }
    window.db = db;
    window.sql_engine = sql_engine;

    var isWebView = ionic.Platform.isWebView();
    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var isWindowsPhone = ionic.Platform.isWindowsPhone();
    var isMobile = false;

    if (isWebView || isIPad || isIOS || isAndroid || isMobile || isWindowsPhone) {
      isMobile = true;
    }

    window.ismobile = isMobile;
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  /*.state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })*/

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});

var StarterFactories = angular.module('starter.factories', []);
