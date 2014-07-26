angular.module("app", []).controller("BackgroundFetchController", function($scope, $http, $templateCache, $interval, $timeout) {  
  $scope.fetch = function(scdata) {
    // console.log(scdata);
    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;

    var rows_news = [];
	// chrome.browserAction.setBadgeText({text:".."});
    $scope.url = b64_.e("aHR0cDovL3d3dy5yZWRkaXQuY29tL3Iv") + $scope.source + b64_.e("Ly5qc29uP2xpbWl0") + "=20";
    $scope.code = null;
    $scope.response = null;
    $http({method:$scope.method, url:$scope.url, cache:$templateCache}).success(function(data, status) {
      $scope.status = status;
      data.data.children.forEach(function(a, b) {
        rows_news.push(a.data);
      });
      // $scope.allnews = rows_news;
      console.log("background " + " + "+$scope.source);
      window.localStorage.setItem($scope.source,JSON.stringify(rows_news));
      // chrome.browserAction.setBadgeText({text:""});
    }).error(function(data, status) {
      // $scope.allnews = data || "Request failed";
      // $scope.allbreakingnews = data || "Request failed";
      $scope.status = status;
    });
  };
  $scope.fetch_ = function(scdata) {
    // console.log(scdata);
    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;

    var rows_news_ = [];

    $scope.url = b64_.e("aHR0cDovL3d3dy5yZWRkaXQuY29tL3Iv") + $scope.source + b64_.e("Ly5qc29uP2xpbWl0") + "=20";
    $scope.code = null;
    $scope.response = null;
    $http({method:$scope.method, url:$scope.url, cache:$templateCache}).success(function(data, status) {
      $scope.status = status;
      data.data.children.forEach(function(a, b) {
        rows_news_.push(a.data);
      });
      // $scope.allnews = rows_news_;
      console.log("background " + " + "+$scope.source);
      window.localStorage.setItem($scope.source,JSON.stringify(rows_news_));
    }).error(function(data, status) {
      // $scope.allnews = data || "Request failed";
      // $scope.allbreakingnews = data || "Request failed";
      $scope.status = status;
    });
  };
  stop = $interval(function() {
    $scope.fetch({
      "source":"worldnews+news",
      "predicate":"ups",
      "ascorder":true
    });
  }, 3976);
  stop = $interval(function() {
    $scope.fetch({
      "source":"breakingnews",
      "predicate":"ups",
      "ascorder":true
    });
  }, 2766);

});



