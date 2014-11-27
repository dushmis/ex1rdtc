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

var app=angular.module("app", ["components"]);

  app.controller("NewsController", function($scope, $timeout) {
  $scope.fetch_ = function(scdata) {
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.order = scdata.order;

    var lolst=window.localStorage.getItem(scdata.source);
    if(lolst){
      $scope.allnews=JSON.parse(lolst);
    }
  };
  stop_timeout = $timeout(function() {
    $scope.fetch_({
      "source":"worldnews",
      "predicate":"ups",
      "order":true
    });
  }, 1);
}).controller("BreakingNewsController", function($scope, $timeout) {

  $scope.fetch_ = function(scdata) {
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.order = scdata.order;


    var lolst=window.localStorage.getItem(scdata.source);
    if(lolst){
      $scope.allbreakingnews=JSON.parse(lolst);
    }
  };
  stop_timeout = $timeout(function() {
    $scope.fetch_({
      "source":"breakingnews",
      "predicate":"created",
      "order":true
    });
  }, 1);
});
chrome.extension.getBackgroundPage().removeNotifications();
