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

app.controller("MYB", function($scope) {
  $scope.SavedChannels=[
    {"A":"WorldNews",},
    {"A":"BreakingNews",}
  ];
});

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
(function(){
  chrome.extension && chrome.extension.getBackgroundPage().removeNotifications();
})();


app.factory("ItemFactory",function(){
  return {
    getStorage:function(){
      return window.localStorage;
    },
    get:function(name){
      return this.getStorage().getItem(name);
    },
    getObject:function(name){
      //todo: null check later
      return JSON.parse(this.getStorage().getItem(name));
    },
    save:function(name,value){
      this.getStorage().setItem(name,value);
      this.setSha(name,this.findSha(value));
    },
    saveWithDiffSha:function(name,value,shagen){
      this.getStorage().setItem(name,value);
      this.setSha(name,shagen);
    },
    saveObject:function(name,value){
      value=JSON.stringify(value);
      this.getStorage().setItem(name,value);
    },
    setSha:function(name,value){
      //may be remove the sha concept later
      this.getStorage().setItem(name+"_sha",value);
    },
    getSha:function(name){
      return this.get(name+"_sha");
    },
    findSha:function(data){
      var error=false;
      try {
        data = JSON.parse(data);
      } catch (err) {
        error = true;
      }
      if(error){
        return data;
      }

      var sha="";
      for(var i=0;i<data.length;i++){
        sha+=data[i].title;
      }
      return sha1(sha);
    },
    saveChannel:function(channel){
      
    },
  };
});

app.controller("OptionContoller", function($scope,ItemFactory) {
  $scope.SavedChannels=ItemFactory.getObject("channels");
  
  $scope.addToChannels = function() {
    $scope.SavedChannels=ItemFactory.getObject("channels");
    $scope.SavedChannels.push({
      source:$scope.ChanTest,
      predicate:"ups",
      ascorder:true,
      refreshrate:30000
    });
    ItemFactory.saveObject("channels",$scope.SavedChannels);
    //$scope.todoText = '';
    console.log(ItemFactory);
  };
});
