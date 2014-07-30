var appmod = angular.module("app", []);


appmod.factory("ItemFactory",function(){
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
      this.setSha(name,value);
    },
    saveObject:function(name,value){
      value=JSON.stringify(value);
      this.getStorage().setItem(name,value);
    },
    setSha:function(name,value){
      //may be remove the sha concept later
      this.getStorage().setItem(name+"_sha",sha1(value));
    },
    getSha:function(name){
      return this.get(name+"_sha");
    }
  };
});

var channel=function(data){
  this.source=data.source;
  this.predicate=data.predicate;
  this.ascorder=data.ascorder;
  //can not be < 2000;
  this.refreshrate=( data.refreshrate ? data.refreshrate < 2000 ? 2000 : data.refreshrate : 2000 )
}

// appmod.constant("dushyant",{name:"test"});

appmod.factory("EventFactory",function(){
  return {
    onChange:function(value){
        chrome.browserAction.getBadgeText({},function(result){
          chrome.browserAction.setBadgeText({text:(+result+1)+""});
        });
    },
    onFetch:function(data){
       console.log("fetch ");
    },
    onError:function(something){
      console.error(something);
    }
  };
});

appmod.factory("ChannelFactory",function(ItemFactory){
  return {

    getDefault:function() {
      var defaults=[];
      defaults.push(new channel({
        source:"worldnews+news",
        predicate:"ups",
        ascorder:true,
        refreshrate:200
      }));
      defaults.push(new channel({
        source:"breakingnews",
        predicate:"ups",
        ascorder:true,
        refreshrate:200
      }));
      ItemFactory.saveObject("channels",defaults);
      return defaults;
    },

    get:function(){
      var channels=ItemFactory.getObject("channels");
      return channels?channels:this.getDefault();
    }

  };
});


appmod.controller("BackgroundFetchController", function($scope, $http, $templateCache, $interval, ItemFactory, EventFactory, ChannelFactory) {  
  $scope.fetch = function(scdata) {

    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;
    
    //console.log(scdata);

    EventFactory.onFetch($scope.source);

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
      var stringed_data=ItemFactory.getSha($scope.source);

      var tosave= !(angular.equals(stringed_data,sha1(stringed)));

      if(tosave){
        EventFactory.onChange({});
      	ItemFactory.save($scope.source,stringed);
      }
    }).error(function(data, status) {
      $scope.status = status;
      EventFactory.onError(status);
    });
  };

  var channels = ChannelFactory.get();
  $scope.channels=channels;
  console.log(channels);
  for (var i = channels.length - 1; i >= 0; i--) {
    (function(singleChannel){
      stop = $interval(function(){
        $scope.fetch({
          "source":singleChannel.source,
          "predicate":singleChannel.predicate,
          "ascorder":singleChannel.ascorder
        });
      }, singleChannel.refreshrate+i);    
    })(channels[i]);
  };

});

var ffunc=function(data){
  this.data=data;
};

ffunc.prototype.get=function(func){
  return func(this.data);
};

// app.js uses this.
var removeNotifications=function(){
    if(chrome.browserAction && chrome.browserAction.onClicked)
      chrome.browserAction.setBadgeText({"text": ""});
}
