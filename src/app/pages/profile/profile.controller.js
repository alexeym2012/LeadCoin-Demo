(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController(firebase, $firebaseObject, currentAuth, Auth, $log, toastr) {
    var vm = this;

    // General database variable
    var ref = firebase.database().ref();
    var storageRef = firebase.storage().ref();
    var profiles = ref.child('users');
    //////////////////////////// *General database variable

    // Initial model
    vm.user = $firebaseObject(ref.child('users').child(currentAuth.uid));
    /////////////////////// *Initial model

    vm.user.$loaded().then(function(){

      vm.oldEmail = angular.copy(vm.user.email);

    });

    vm.changeEmail = false;
    vm.changePass = false;

    // Submit operation
    vm.save = function() {

      vm.userEntry = {
        avatar: vm.user.avatar,
        name: vm.user.name,
        email: vm.user.email,
        role: vm.user.role,
        address: {
          street: vm.user.address.street,
          city: vm.user.address.city,
          zip: vm.user.address.zip,
          country: vm.user.address.country
        },
        phone: vm.user.phone
      };

      var updateOnSuccess = function() {

        if (vm.user.avatar && vm.user.avatar.size) {
          var file = vm.user.avatar;
          var metadata = {
            'contentType': file.type,
            'contentDisposition': 'inline; filename=' + file.name
          };

          // Push to child path.
          // [START oncomplete]
          storageRef.child('/avatars/' + currentAuth.uid + '/' + file.name).put(file, metadata).then(function(snapshot) {
            var url = snapshot.metadata.downloadURLs[0];
            vm.userEntry.avatar = url;
            $log.log('File available at', url);
            profiles.child(vm.user.$id).update(vm.userEntry);
          }).catch(function(error) {
            // [START onfailure]
            $log.error('Upload failed:', error);
            // [END onfailure]
          });
          // [END oncomplete]
        } else {
          profiles.child(vm.user.$id).update(vm.userEntry);
        }

        toastr.success('Your Personal Informations has been updated', 'Saving success!');
        vm.changeEmail = false;
        vm.changePass = false;
      };

      var changeEmail = vm.changeEmail;
      var changePass = vm.changePass;

      if (changeEmail === true) {
        Auth.$signInWithEmailAndPassword(vm.oldEmail, vm.user.password).then(function(){
          Auth.$updateEmail(vm.user.email).then(function(){
            $log.log("Email changed successfully");
            toastr.success('Email has been changed successfully', 'Email changed!');
            updateOnSuccess();
          }, function(error){
            toastr.error(error.message, 'Error changing email!');
            $log.log("Error changing email:", error);
          });
        });
      } else if (changePass === true) {
        Auth.$signInWithEmailAndPassword(vm.user.email, vm.oldpassword).then(function(){
          Auth.$updatePassword(vm.user.password).then(function(){
            $log.log("Password changed successfully");
            toastr.success('Password has been changed successfully', 'Password changed!');
            updateOnSuccess();
          }, function(error){
            toastr.error(error.message, 'Error changing password!');
            $log.log("Error changing password:", error);
          });
        });
      } else {
        updateOnSuccess();
      }
    };
    /////////////////////// *Submit operation

  }

})();
