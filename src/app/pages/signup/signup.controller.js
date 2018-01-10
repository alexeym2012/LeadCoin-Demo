(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('SignupController', SignupController);

  /** @ngInject */
  function SignupController(currentAuth, Auth, $log, $state, toastr) {
    var vm = this;

    vm.currentAuth = currentAuth;

    //redirect if user is logged in
    if (vm.currentAuth) {
      $state.go('dashboard', {}, {reload: true});
    }

    vm.createUser = function() {
      vm.message = null;
      vm.error = null;

      toastr.warning('Please uncomment me in SignupController to make me work', 'This should create an Account!');

      // Create a new user
      /*Auth.$createUserWithEmailAndPassword(vm.email, vm.password)
        .then(function(firebaseUser) {
          vm.message = "User created with uid: " + firebaseUser.uid;
          // authenticate so we have permission to write to Firebase
          return Auth.$signInWithEmailAndPassword(vm.email, vm.password);
        })
        .then(function(firebaseUser){
          var ref = firebase.database().ref();

          // create a user profile in our data store
          ref.child('users').child(firebaseUser.uid).set({
            name: vm.name,
            email: vm.email,
            created_at: firebase.database.ServerValue.TIMESTAMP,
            updated_at: firebase.database.ServerValue.TIMESTAMP
          });

          toastr.success('Your Account has been Created', 'Account Created!');
          $state.go('dashboard', {}, {reload: true});
        })
        .catch(function(error) {
          vm.error = error;
          toastr.error(vm.error, 'Creating Account Failed!');
        });*/
    };

  }

})();
