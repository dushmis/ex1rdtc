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
  });

angular.module("app", ["components"]).controller("NewsController", function($scope, $http, $templateCache, $interval, $timeout) {
  
  $scope.fetch = function(scdata) {
    // console.log(scdata);
    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;

    var rows_news = [];

    $scope.url = b64_.e("aHR0cDovL3d3dy5yZWRkaXQuY29tL3Iv") + $scope.source + b64_.e("Ly5qc29uP2xpbWl0") + "=20";
    $scope.code = null;
    $scope.response = null;
    $http({method:$scope.method, url:$scope.url, cache:$templateCache}).success(function(data, status) {
      $scope.status = status;
      data.data.children.forEach(function(a, b) {
        rows_news.push(a.data);
      });
      $scope.allnews = rows_news;
    }).error(function(data, status) {
      $scope.allnews = data || "Request failed";
      $scope.allbreakingnews = data || "Request failed";
      $scope.status = status;
    });
  };
  stop = $interval(function() {
    $scope.fetch({
      "source":"worldnews+news",
      "predicate":"ups",
      "ascorder":true
    });
  }, 3E4);
  // console.log(stop);
  stop_timeout = $timeout(function() {
    $scope.fetch({
      "source":"worldnews+news",
      "predicate":"ups",
      "ascorder":true
    });
  }, 100);
}).controller("BreakingNewsController", function($scope, $http, $templateCache, $interval, $timeout) {
  
  $scope.fetch = function(scdata) {
    // console.log(scdata);
    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;

    var rows_breakingnews = [];

    $scope.url = b64_.e("aHR0cDovL3d3dy5yZWRkaXQuY29tL3Iv") + $scope.source + b64_.e("Ly5qc29uP2xpbWl0") + "=20";
    $scope.code = null;
    $scope.response = null;
    $http({method:$scope.method, url:$scope.url, cache:$templateCache}).success(function(data, status) {
      $scope.status = status;
      data.data.children.forEach(function(a, b) {
        rows_breakingnews.push(a.data);
      });
      // console.log(rows_breakingnews);
      $scope.allbreakingnews = rows_breakingnews;
    }).error(function(data, status) {
      $scope.allnews = data || "Request failed";
      $scope.allbreakingnews = data || "Request failed";
      $scope.status = status;
    });
  };
  stop = $interval(function() {
    $scope.fetch({
      "source":"breakingnews",
      "predicate":"created",
      "ascorder":true
    });
  }, 3E4);
  // console.log(stop);
  stop_timeout = $timeout(function() {
    $scope.fetch({
      "source":"breakingnews",
      "predicate":"created",
      "ascorder":true
    });
  }, 100);
});


