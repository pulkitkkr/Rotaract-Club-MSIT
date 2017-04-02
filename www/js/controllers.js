angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope,$ionicPopup,FireBaseFactory,$firebaseAuth, $location,$rootScope, $ionicLoading) {
	$scope.EnterRotary = function(username,password){
      $ionicLoading.show({
        template: 'Please Wait...'
       });
     
       
			var FB = new Firebase("https://rotaract-msit.firebaseio.com/");
  		 	var fbAuth = $firebaseAuth(FB);
  	   		fbAuth.$authWithPassword({
           		email: username,
            	password: password
        	}).then(function(authData) {
           		$rootScope.UserLoggedIn = username;
             $ionicLoading.hide();
              $location.path("/home/User_Profile").replace();
       		}).catch(function(error) {
            	console.error("ERROR: " + error);
            	 $ionicLoading.hide();
                $ionicPopup.alert({
    					title: 'Sorry!!',
     					template: error

   					});

        });
	}
	 
})

 .controller('avatarCtrl',function($scope,$rootScope, $ionicHistory){
   $scope.SelectionMade = function(index){
    $rootScope.selectedAvatar = index + 1;
    $rootScope.LaunchButton="Selected";
    $rootScope.myClassx.pop('button-assertive');
    $rootScope.myClassx.push('button-balanced');
     
     window.history.back();
   }
   


  $scope.imgx = [1,2,3,4,5,6,7,8,9,13,14,15,16,17,18,19,20,21,22,23];
 }) 

.controller('signupCtrl', function($scope,$rootScope, $ionicPopup,FireBaseFactory,$firebaseAuth,$ionicLoading, $location) {
  $scope.Data =  new Firebase("https://rotaract-msit.firebaseio.com/Users");
  $scope.spinnerShow = false;
  var FB = new Firebase("https://rotaract-msit.firebaseio.com/");
     
  $rootScope.LaunchButton="Choose Avatar";
  $rootScope.myClass = [];
  $rootScope.myClassx = [];


  
  var register = function(username,password,name,tel,ProfileImage,Course, Shift, Year, Position){
    $ionicLoading.show({
      template: 'Please Wait...'
    });
    var fbAuth = $firebaseAuth(FB);
        fbAuth.$createUser({email: username, password: password}).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {

           $scope.Data.push({
          "Name": name,
          "UserName": username,
          "Password": password,
          "Phone": tel,
          "ProfileImage" :  ProfileImage,
          "Course" : Course,
          "Shift" : Shift,
          "Year" : Year,
          "Position" : Position
        },function oncomplete(){
          $ionicPopup.alert({
              title: 'Congrats!!',
              template: 'You are Now Registered!!! Welcome To Rotaract Club MSIT'

            });
          });
          $ionicLoading.hide();   
          $location.path("/login"); 
        }).catch(function(error) {
            console.error("ERROR " + error);
            $ionicPopup.alert({
              title: 'Sorry!!',
              template: error+' Unable to Register,We Regret for inconvenience'

            });
            $ionicLoading.hide();
        });

  }
  $scope.submitForm = function(FormData) {
      
      if(FormData.UserName && FormData.Name && FormData.Pass && FormData.Tel && $rootScope.selectedAvatar && FormData.Course && FormData.Shift && FormData.Year && FormData.Position){
          register(FormData.UserName, FormData.Pass,FormData.Name,FormData.Tel,$rootScope.selectedAvatar,FormData.Course,FormData.Shift ,FormData.Year, FormData.Position);
                    
        FormData = null;
                
      }
      else if(FormData.UserName && FormData.Name && FormData.Pass && FormData.Tel && FormData.Course && FormData.Shift && FormData.Year && FormData.Position){
          
                    
      $ionicPopup.alert({
             title: 'Error!!!',
              template: 'Please Choose your Profile Avatar'

            });

                
      }
      else{
        $ionicPopup.alert({
             title: 'Error!!!',
              template: 'Make Sure You have filled all fields Correctly'

            });
        
     }

  }
   

})

   
.controller('rotaractMembersCtrl', function($rootScope,$scope,$timeout) {
    $rootScope.Users = [];
   
    var ref = new Firebase("https://rotaract-msit.firebaseio.com/Users");
    ref.on("child_added", function(snapshot, prevChildKey) {
      var CurrentUser = snapshot.val();
      var pushData = {};
      pushData.Name = CurrentUser.Name;
      pushData.Tel = CurrentUser.Phone;
      pushData.UserName = CurrentUser.UserName;
      pushData.Course = CurrentUser.Course;
      pushData.Year = CurrentUser.Year;
      pushData.Shift = CurrentUser.Shift;
      pushData.Position = CurrentUser.Position;
      if(CurrentUser.ProfileImage)
      {

      pushData.ProfileImagex = CurrentUser.ProfileImage;
       
      }
      else{
        pushData.ProfileImagex ='img/User.png';
      }
      $rootScope.Users.push(pushData);
         
    }, undefined, undefined);

    $scope.ShowUserDetails = function(index){
      $rootScope.MemberSelected = index;
    }
    
    
    $scope.Showusers = function(){
      $rootScope.Users = [];
      OfflineFirebase.clear();
      ref.on("child_added", function(snapshot, prevChildKey) {
      var CurrentUser = snapshot.val();
      var pushData = {};
      pushData.Name = CurrentUser.Name;
      pushData.Tel = CurrentUser.Phone;
      pushData.UserName = CurrentUser.UserName;
      if(CurrentUser.ProfileImage)
      {

      pushData.ProfileImagex = CurrentUser.ProfileImage;
       
      }
      else{
        pushData.ProfileImagex ='img/User.png';
      }
      $rootScope.Users.push(pushData);
         
    }, undefined, undefined, true);
      $scope.$broadcast('scroll.refreshComplete');

      scope.$apply();


    }

  
  

})
   
.controller('noticesCtrl', function($scope) {

    /* var options = {
      quality: 80,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
  $scope.LaunchButton="Choose File";
  $scope.myClass = [];
  $scope.AddNoticeToggle = function(){
    $scope.InAdd = true;
    $scope.InView = false;
  };
  $scope.ViewNoticeToggle = function(){
    $scope.InView= true;
    $scope.InAdd = false;
  };
  $scope.LaunchImagePicker = function(){
      $cordovaCamera.getPicture(options).then(
            function(results){
               $scope.ImageData = "data:image/jpeg;base64," + results; 
               $scope.LaunchButton="Image Selected";
               $scope.myClass.pop('button-assertive');
               $scope.myClass.push('button-balanced');
            },function(error){
              $scope.myClass.pop('button-balanced');
              $scope.myClass.push('button-assertive');
              $scope.LaunchButton="Choose File";
            }
        );
  };*/

   
    
     
})
.controller('ViewUserCtrl', function($scope,$rootScope){
   console.log($rootScope.Users[$rootScope.MemberSelected]);
  $scope.SelectedData = $rootScope.Users[$rootScope.MemberSelected];
  console.log($scope.SelectedData);
  $scope.showAlert = function(){
    alert("adsfsf");
  }
    
})
   
.controller('myProfileCtrl', function($scope,$ionicPopup,$rootScope,$location) {
    $scope.PresentUser = [];
    if(!$rootScope.UserLoggedIn){
      $rootScope.UserLoggedIn = "mhota@gmail.com";
    }
    if ($rootScope.UserLoggedIn == "sabarnik1@gmail.com") {
        $ionicPopup.alert({
              title: 'My Sabby!!',
              template: 'I Love You Sabby :-p Just Never Dare To Leave Me'
            
            });
    };
     
    var ProfileRef = new OfflineFirebase("https://rotaract-msit.firebaseio.com/Users");
    ProfileRef.orderByChild("UserName").equalTo($rootScope.UserLoggedIn).on("child_added", function(snapshot, prevChildKey) {
      var CurrentUser = snapshot.val();
      var UserData = {};
      UserData.Name = CurrentUser.Name;
      UserData.UserName = CurrentUser.UserName;
      UserData.Tel = CurrentUser.Phone;
      UserData.Course = CurrentUser.Course;
      UserData.Year = CurrentUser.Year;
      UserData.Shift = CurrentUser.Shift;
      UserData.Position = CurrentUser.Position;
     
      
      if(CurrentUser.ProfileImage)
      {

       UserData.ProfileImagex = CurrentUser.ProfileImage;
       
      }
      else{
         UserData.ProfileImagex ='img/User.png';
      }
      $scope.PresentUser.push(UserData);
         
    }, undefined, undefined);


  $scope.SignOut = function(){
    $location.path('#/login')
  };
})
    