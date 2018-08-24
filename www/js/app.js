// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'ngRoute', 'firebase']);
var posObj = {lat:0,long:0};
var http = {};
var getState = 1;
var getId = '';
var getCount = 1;
var userRef = {};

app.config(function($routeProvider) {

  $routeProvider

      // login
      .when('/', {
          template: '<home-directive></home-directive>',
          controller: 'homeController'
      })

      .when('/grab', {
          template: '<grab-directive></grab-directive>',
          controller: 'grabController'
      })

      .when('/devices', {
          template: '<devices-directive></devices-directive>',
          controller: 'devicesController'
      })

      .when('/newdevice', {
          template: '<newdevice-directive></newdevice-directive>',
          controller: 'newdeviceController'
      })

      .when('/groups', {
          template: '<groups-directive></groups-directive>',
          controller: 'groupsController'
      })

      .when('/newgroup', {
          template: '<newgroup-directive></newgroup-directive>',
          controller: 'newgroupController'
      })

      // other
      .otherwise({ redirectTo: '/' });;

});


app.directive('homeDirective', function () {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: './html/page-home.html'
  }; 
});

app.directive('grabDirective', function () {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: './html/page-grab.html'
  }; 
});

app.directive('devicesDirective', function () {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: './html/page-devices.html'
  }; 
});

app.directive('newdeviceDirective', function () {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: './html/page-newdevice.html'
  }; 
});

app.directive('groupsDirective', function () {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: './html/page-groups.html'
  }; 
});

app.directive('newgroupDirective', function () {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: './html/page-newgroup.html'
  }; 
});


// home controller
app.controller('homeController', function($scope, $window, $location, $cordovaGeolocation, $http, $ionicPlatform, $firebaseObject, $firebaseAuth) {
  $ionicPlatform.ready(function() {

    cordova.plugins.backgroundMode.enable();

    $scope.menuClass = false;
    try{
      $firebaseAuth().$signInWithEmailAndPassword("sesamaua@gmail.com", "AK7mae")
        .then(function(firebaseUser) {
          alert('User uid: '+firebaseUser.user.uid)
        }).catch(function(error) {
          alert('User error '+error)
      });
    }
    catch(e){
      alert(e);
    }

    try {
      // download the data into a local object
      var ref = firebase.database().ref().child("Users").child("0");
      // create a synchronized array
      // click on `index.html` above to see it used in the DOM!
      userRef = $firebaseObject(ref);
      userRef.$loaded().then(function() {
        $scope.messages = userRef;
      })
    } catch (error) {
      alert('err6: ' + error)
    }
    /*cordova.plugins.backgroundMode.onactivate = function () {
      var counter = 0;
  
        // Update badge number every second
        // and write update to log
        try{
          timer = setInterval(function () {
              counter++;
              console.log('Running since ' + counter + ' sec');
              cordova.plugins.notification.badge.set(counter);
          }, 1000);
        }
        catch(e){
          alert('err6: ' + e);
        }
    };*/
    http = $http;
    $window.scrollTo(0, 0);
    $scope.pageClass = 'page-home';

    $scope.next = function(path){
        $location.path(path);
    };

    $scope.addMessage = function(msg) {
      try{

        userRef.test = msg;
        userRef.$save().then(function(ref) {
          alert(ref);
          $scope.messages = userRef;
        }, function(error) {
          console.log("Error:", error);
        });
      }
      catch(e){
        alert('err7: ' + e);
      }
    };

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;
        posObj = {lat:lat,long:long};
      }, function(err) {
        // error
      });

    var watchOptions = {
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        // error
      },
      function(position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude
        posObj = {lat:lat,long:long};
        //alert("long: " + long);
    });


    var config = {
      appId: '5de8e54a-467c-4ca2-91e9-a14f591c59f2',
      appSecret: '09721bb1-1b8d-4998-8d49-77cdb3f979cd',
      appName: 'XYZTest',
      reloadOnFlicEvent: true,
    }


    try{
      Flic.init(config.appId, config.appSecret, config.appName, config, this);
    }
    catch(e){
      alert('error: 0 ' + e)
    }
  })

  $scope.showMenu = function(){
    $scope.menuClass = (!$scope.menuClass);
  };

  $scope.goTo = function(path){
    $location.path(path);
  };
});

// home controller
app.controller('devicesController', function($scope, $window, $location, $ionicPlatform, $timeout) {
  $ionicPlatform.ready(function() {

    cordova.plugins.backgroundMode.enable();

    $window.scrollTo(0, 0);
    $scope.pageClass = 'page-devices';
    $scope.deviceId = '';
    $scope.messages = userRef;


    $scope.next = function(path){
        $location.path(path);
    };

    $scope.edit = function(device){
        alert(device);
    };

  })
  
});


// home controller
app.controller('newdeviceController', function($scope, $window, $location, $ionicPlatform, $timeout) {
  $ionicPlatform.ready(function() {

    cordova.plugins.backgroundMode.enable();

    $window.scrollTo(0, 0);
    $scope.pageClass = 'page-newdevices';
    $scope.deviceId = '';
    $scope.deviceName = '';
    $scope.deviceClick = '';
    $scope.deviceText = '';
    $scope.messages = userRef;
    $scope.deviceGroups = [false];
    $scope.groupValue = {};

    userRef.Groups.forEach((element,index) => {
      $scope.groupValue[index] = false
    });


    $scope.next = function(path){
        $location.path(path);
    };


    $scope.lookDevice = function(){
      try {
        grabButton();
        getState = 2;
        getCount++;
        $scope.deviceId = 'Buscando...';
        /*setTimeout(() => {
          $scope.getDevice();
        }, 2000);*/

        $timeout(countUp, 2000);
      } catch (error) {
        alert('err4: ' + error)
      }
    };

    var countUp = function() {
        getCount++;
        //alert(getCount);
        //$scope.deviceId = getCount;
        try {
          if(getState == 2){
            $timeout(countUp, 2000);
          }
          else if(getState == 3){
            getState = 1;
            $scope.deviceId = getId;
          }
            
        } catch (error) {
          alert('Err 3: ' + error);        
        }
    }


    $scope.saveDevice = function(deviceId, deviceName, deviceClick, deviceText, groupValue){
      try {
        var newDevice = {id:deviceId, name:deviceName, click:deviceClick, message:deviceText, Groups:groupValue, active:true};
        if(userRef.Devices === undefined){
          userRef.Devices = [newDevice];
        }
        else{
          userRef.Devices.push(newDevice);
        }
        userRef.$save().then(function(ref) {
          alert('Nuevo dispositivo añadido correctamente');
          $location.path('devices');
        }, function(error) {
          alert("Error:", error);
        });

      } catch (error) {
        alert('err4: ' + error)
      }
    };

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  })

  
});

// home controller
app.controller('groupsController', function($scope, $window, $location, $ionicPlatform, $timeout) {
  $ionicPlatform.ready(function() {

    cordova.plugins.backgroundMode.enable();

    $window.scrollTo(0, 0);
    $scope.pageClass = 'page-groups';
    $scope.deviceId = '';
    $scope.messages = userRef;


    $scope.next = function(path){
        $location.path(path);
    };

    $scope.edit = function(device){
        alert(device);
    };

  })
  
});


// home controller
app.controller('newgroupController', function($scope, $window, $location, $ionicPlatform, $timeout) {
  $ionicPlatform.ready(function() {

    cordova.plugins.backgroundMode.enable();

    $window.scrollTo(0, 0);
    $scope.pageClass = 'page-newgroup';
    $scope.groupsName = '';
    $scope.groupColor = 'green';
    $scope.groupContacts = {0:{email:'',added:false}};
    $scope.contactsAdded = {0:''};
    $scope.contactCount = 0;

    $scope.messages = userRef;


    $scope.next = function(path){
        $location.path(path);
    };

    $scope.selectedColor = function(color){
      $scope.groupColor = color;
    };

    $scope.changeContact = function(index){
      $scope.groupContacts[index].email = $scope.contactsAdded[index];
    };

    $scope.newContact = function(){
      $scope.groupContacts[$scope.contactCount].added = true;
      $scope.contactCount++;
      $scope.groupContacts[$scope.contactCount] = {email:'',added:false};
    };

    $scope.saveGroup = function(groupName, groupColor, contactsAdded){
      try {
        var newGroup = {name:groupName, color:groupColor, Members:contactsAdded, active:true};
        if(userRef.Groups === undefined){
          userRef.Groups = [newGroup];
        }
        else{
          userRef.Groups.push(newGroup);
        }
        userRef.$save().then(function(ref) {
          alert('Nuevo grupo añadido correctamente');
          $location.path('groups');
        }, function(error) {
          alert("Error:", error);
        });

      } catch (error) {
        alert('err4: ' + error)
      }
    };

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  })

  
});


function errorInit(message) {
  alert('Flic init failed: ' + message);
}


function renderKnownButtons() {
  
  Flic.getKnownButtons(function(buttons) {
  
      console.log('Flic getKnownButtons succeeded');
      console.log('Flic known buttons: ' + JSON.stringify(buttons));
      var buttonsCont = document.querySelector('#buttons');
      buttonsCont.innerHTML = '';
      for (var i = 0; i < buttons.length; i += 1) {
          var button = buttons[i];
          var element = document.createElement('div');
          element.classList.add('btn')
          if (button.colorHex) {
              element.style.borderColor = '#' + button.colorHex;
          } else {
              element.style.borderColor = button.color;
          } 
          element.innerHTML = 'Button status: ' + button.status;
          element.id = app.escapeId(button.buttonId);
          buttonsCont.appendChild(element);
      }
  },
  function(message) {
      console.log('Flic getKnownButtons failed: ' + message);
      alert('Flic getKnownButtons failed: ' + message);
  });
}

function onFlicButtonPressed(result) {
  userRef.Devices.forEach((device, index) => {
    if((device.id === result.button.buttonId) && (device.click === result.event) && (device.active)){
      try{
        var urlString = 'https://us-central1-dingo-51db0.cloudfunctions.net/app/searchAlert';
        var postObj = {alertInfo:device, user:0, geo:posObj, active:true, groupsInfo: userRef.Groups, messages:[]};
        http.post(urlString, postObj)
        .success(function(data, status, headers, config) {
          cordova.plugins.notification.local.schedule({
              title: 'Alert',
              text: 'New notification',
              foreground: true
          });
              //alert('AK7');
              //$scope.data = data;
              //$location.path(path);
          }).error(function(data, status, headers, config) {
                  alert('Datos No Enviados. Por Favor Intente de Nuevo');
          });
        
      } catch (error) {
        alert('err 3: ' + error);    
      }
    }
  })

  //alert(result.button.buttonId); // (String) singleClick or doubleClick or hold
  console.log(result.button.buttonId); // (String)
  console.log(result.button.color); // (String) green
  console.log(result.wasQueued); // (Boolean) If the event was locally queued in the button because it was disconnected. After the connection is completed, the event will be sent with this parameter set to true.
  console.log(result.timeDiff); // (Number) If the event was queued, the timeDiff will be the number of seconds since the event happened.
}
function buttonGrabbed(buttonId, color, status) {
  //alert(buttonId);
  getId = buttonId;
  getState = 3;
}

function onFlicButtonPressedError(err){
  console.log(err);
  alert('Error pressed: '+err )
}
function grabButton() {
  Flic.grabButton(function(button) {
      console.log('Flic grabButton succeeded');
      alert('Flic grabbed button: ' + JSON.stringify(button));
      renderKnownButtons()
  },
  function(message) {
      console.log('Flic grabButton failed: ' + message);
      alert('Flic grabButton failed: ' + message);
  });
}



// Subscription to button events

//Flic.onButtonClick(onFlicButtonPressed, onFlicButtonPressedError)