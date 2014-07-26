angular.module('components', [])
  .directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        var panes = $scope.panes = [];

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        }

        this.addPane = function(pane) {
          if (panes.length == 0) $scope.select(pane);
          panes.push(pane);
        }
      },
      template:
        '<div class="tabbable">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
  })

  .directive('pane', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
  })

  .directive('panebutton', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
  })
  ;

angular.module("app", ["components"]).controller("NewsController", function($scope, $http, $templateCache, $interval, $timeout) {
  
  $scope.fetch = function(scdata) {
    // console.log(scdata);
    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;

    // var rows_news = [];
// $scope.allnews
    var lolst=window.localStorage.getItem($scope.source);
    if(lolst){
      console.info("found it "+$scope.source);
      $scope.allnews=JSON.parse(lolst);
      console.log($scope.allnews);
    }else{
      console.log("nothing i have");
    }
  };
  // stop = $interval(function() {
  //   $scope.fetch({
  //     "source":"worldnews+news",
  //     "predicate":"ups",
  //     "ascorder":true
  //   });
  // }, 3E4);
  // console.log(stop);
  stop_timeout = $timeout(function() {
    $scope.fetch({
      "source":"worldnews+news",
      "predicate":"ups",
      "ascorder":true
    });
  }, 1);
}).controller("BreakingNewsController", function($scope, $http, $templateCache, $interval, $timeout) {
  
  $scope.fetch = function(scdata) {
    // console.log(scdata);
    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;

    // var rows_breakingnews = [];

    var lolst=window.localStorage.getItem($scope.source);
    if(lolst){
      console.info("found it "+$scope.source);
      $scope.allbreakingnews=JSON.parse(lolst);
      console.log($scope.allbreakingnews);
    }else{
      console.log("nothing i have");
    }
  };
  // stop = $interval(function() {
  //   chrome.browserAction.setBadgeText({text:"L"});  
  //   $scope.fetch({
  //     "source":"breakingnews",
  //     "predicate":"created",
  //     "ascorder":true
  //   });
  // }, 3E4);
  // console.log(stop);
  stop_timeout = $timeout(function() {
    $scope.fetch({
      "source":"breakingnews",
      "predicate":"created",
      "ascorder":true
    });
  }, 1);
});



