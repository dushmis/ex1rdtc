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

      // console.log(data);
      var error=false;
      try {
        data=JSON.parse(data);
      }
      catch(err) {
        console.log("error json" + data)
        error=true;
      }
      if(error){
        return data;
      }

      // console.log(data);
      var sha="";
      for(var i=0;i<data.length;i++){
        sha+=data[i].title;
      }
      return sha1(sha);
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


appmod.factory("EventFactory",function(){
  return {
    onChange:function(value){
        // console.info("change %s",value);
        chrome.browserAction.getBadgeText({},function(result){
          //chrome.browserAction.setBadgeText({text:(+result+1)+""});
          chrome.browserAction.setBadgeText({text:"New"});
        });
    },
    onFetch:function(data){
      //  console.log("fetch ");
    },
    onError:function(something){
      // console.error(something);
    }
  };
});

appmod.factory("ChannelFactory",function(ItemFactory){
  return {

    getDefault:function() {
      var defaults=[];
      defaults.push(new channel({
        source:"worldnews",
        predicate:"ups",
        ascorder:true,
        refreshrate:300
      }));
      defaults.push(new channel({
        source:"breakingnews",
        predicate:"created",
        ascorder:true,
        refreshrate:300
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
  $scope.fetch = function(scdata,dowhat) {

    $scope.method = "GET";
    $scope.source = scdata.source;
    $scope.predicate = scdata.predicate;
    $scope.ascorder = scdata.ascorder;

    // console.log("object %s",scdata);

    EventFactory.onFetch(scdata.source);

    var rows_news = [];
    var t=(new Date()).getTime();
    $scope.url = b64_.e("aHR0cDovL3d3dy5yZWRkaXQuY29tL3Iv") + scdata.source + b64_.e("Ly5qc29uP2xpbWl0") + "=20&tmp="+t;
    $scope.code = null;
    $scope.response = null;

    $http({method:$scope.method, url:$scope.url, cache:$templateCache}).success(function(data, status) {
      $scope.status = status;
      data.data.children.forEach(function(a, b) {
        rows_news.push(a.data);
      });
      var stringed=JSON.stringify(rows_news);
      var stringed_data=ItemFactory.getSha(scdata.source);

      var stringed_=ItemFactory.findSha(stringed);
      var tosave= !(angular.equals(stringed_data,stringed_));
      dowhat(scdata.source);

      if(tosave){
        EventFactory.onChange(scdata.source);
      	ItemFactory.save(scdata.source,stringed);
      }
    }).error(function(data, status) {
      $scope.status = status;
      EventFactory.onError(status);
    });
  };

  var channels = ChannelFactory.get();
  $scope.channels=channels;
  // console.log(channels);
  for (var i = 0; i <= channels.length - 1; i++) {
    (function(singleChannel){
      // console.log("sing " + i +  singleChannel + " " + (singleChannel.refreshrate+(i+1)*10));
      stop = $interval(function(){
        $scope.fetch({
          "source":singleChannel.source,
          "predicate":singleChannel.predicate,
          "ascorder":singleChannel.ascorder
        },function(dowhat){
          // console.info("do what %s",dowhat);
        });
      }, singleChannel.refreshrate+(i+1)*10);
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
