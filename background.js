angular.module("app", []).controller("BackgroundFetchController", function($scope, $http, $templateCache, $interval, $timeout) {  
  $scope.fetch = function(scdata) {
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
      var stringed=JSON.stringify(rows_news);
      var stringed_data=window.localStorage.getItem($scope.source+"_sha");

      
      var tosave= !(angular.equals(stringed_data,sha1(stringed)));
      console.log(tosave);
      if(tosave){
      	chrome.browserAction.setBadgeText({text:"1"});
      	window.localStorage.setItem($scope.source,stringed);
      	window.localStorage.setItem($scope.source+"_sha",sha1(stringed));
      }
    }).error(function(data, status) {
      $scope.status = status;
    });
  };
  stop = $interval(function() {
    $scope.fetch({
      "source":"worldnews+news",
      "predicate":"ups",
      "ascorder":true
    });
  }, 30976);
  stop = $interval(function() {
    $scope.fetch({
      "source":"breakingnews",
      "predicate":"ups",
      "ascorder":true
    });
  }, 20660);

});



