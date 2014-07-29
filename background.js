var appmod = angular.module("app", []);

appmod.factory("Item",function(){
  var Item={
    getStorage:function(){
      return window.localStorage;
    }
  };
  return Item;
});

appmod.controller("BackgroundFetchController", function($scope, $http, $templateCache, $interval, Item) {  
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
      var stringed_data=Item.getStorage().getItem($scope.source+"_sha");
      
      var tosave= !(angular.equals(stringed_data,sha1(stringed)));

      if(tosave){
        chrome.browserAction.getBadgeText({},function(result){
          chrome.browserAction.setBadgeText({text:(+result+1)+""});
        });
      	Item.getStorage().setItem($scope.source,stringed);
      	Item.getStorage().setItem($scope.source+"_sha",sha1(stringed));
      }else{
        // chrome.browserAction.setBadgeText({text:""});
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
  }, 3976);
  stop = $interval(function() {
    $scope.fetch({
      "source":"breakingnews",
      "predicate":"ups",
      "ascorder":true
    });
  }, 2660);

});


var removeNotifications=function(){
    if(chrome.browserAction && chrome.browserAction.onClicked) // you can add all stuff that you need.        
      chrome.browserAction.setBadgeText({"text": ""});
}
