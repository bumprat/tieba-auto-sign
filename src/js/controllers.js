angular.module('app.controllers', [])
  
.controller('page2Ctrl', function($scope, $ionicTabsDelegate) {
  	swaptabs($scope, $ionicTabsDelegate);
})
   
.controller('page3Ctrl', function($scope, $ionicTabsDelegate) {
	swaptabs($scope, $ionicTabsDelegate);
})
   
.controller('page4Ctrl', function($scope, $ionicTabsDelegate) {
	swaptabs($scope, $ionicTabsDelegate);
})


function swaptabs($scope, $ionicTabsDelegate){	
    $scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    };

    $scope.goBack = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
    };
}