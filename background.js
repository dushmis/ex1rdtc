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
    }
  };
});


var channel=function(data){
  this.source=data.source;
  this.predicate=data.predicate;
  this.ascorder=data.ascorder;
  //can not be < 2000;
  this.refreshrate=( data.refreshrate ? data.refreshrate < 2E4 ? 2E4 : data.refreshrate : 2E4 )
}


appmod.factory("EventFactory",function(){
  return {
    onChange:function(value){
        chrome.browserAction.getBadgeText({},function(result){
          chrome.browserAction.setBadgeText({text:"New"});
        });
    },
    onFetch:function(data,done){
      if(!done){
        console.log("fetching %s",data);
        chrome.browserAction.getBadgeText({},function(result){
          chrome.browserAction.setBadgeText({text:"~"});
        });
      }else{
        console.log("fetching %s done",data);
        chrome.browserAction.getBadgeText({},function(result){
          chrome.browserAction.setBadgeText({text:""});
        });
      }
    },
    onError:function(something){
      chrome.browserAction.getBadgeText({},function(result){
        chrome.browserAction.setBadgeText({text:":("});
      });
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
        refreshrate:60000
      }));
      defaults.push(new channel({
        source:"breakingnews",
        predicate:"created",
        ascorder:true,
        refreshrate:60000
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

    EventFactory.onFetch(scdata.source,false);

    var rows_news = [];
    var t=(new Date()).getTime();
    $scope.url = b64_.e("aHR0cDovL3d3dy5yZWRkaXQuY29tL3Iv") + scdata.source + b64_.e("Ly5qc29uP2xpbWl0") + "=20&tmp="+t;
    $scope.code = null;
    $scope.response = null;

    $http({method:$scope.method, url:$scope.url, cache:$templateCache}).success(function(data, status) {
      EventFactory.onFetch(scdata.source,true);
      $scope.status = status;
      data.data.children.forEach(function(a, b) {
        if(a.data.domain.indexOf("self")!==0){
          rows_news.push(a.data);
        }
      });
      var stringed=JSON.stringify(rows_news);
      var stringed_data=ItemFactory.getSha(scdata.source);

      var stringed_=ItemFactory.findSha(stringed);
      //console.log("%s - %s",scdata.source,stringed_);
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

  for (var i = 0; i <= channels.length - 1; i++) {
    (function(singleChannel){

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
