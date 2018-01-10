(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UsersController', UsersController)
    .controller('NewUserController', NewUserController)
    .controller('EditUserController', EditUserController)
    .controller('ShowUserController', ShowUserController);

  /** @ngInject */
  function UsersController($scope, $filter, NgTableParams, toastr, $log, firebase, $firebaseArray, $firebaseObject, currentAuth, Auth) {
    var vm = this;

    // General database variable
    var ref = firebase.database().ref();
    vm.users = $firebaseArray(ref.child('users'));
    vm.blockedUsers = ref.child('blockedUsers');

    vm.currentUser = $firebaseObject(ref.child('users').child(currentAuth.uid));
    //////////////////////////// *General database variable

    vm.currentUser.$loaded(function(){
      if (vm.currentUser.role === 'admin'){
        vm.roles = {
          admin: "admin",
          superuser: "superuser",
          user: "user"
        };
      } else {
        vm.roles = {
          superuser: "superuser",
          user: "user"
        };
      }
    });


    //////////////////////////////////////////
    //************ Table Settings **********//
    //////////////////////////////////////////

    // Delete CRUD operation
    vm.delete = function (user) {
      if (confirm('Are you sure?')) {
        vm.users.$ref().child(user.$id).child('blocked').set(true);
        vm.blockedUsers.child(user.$id).set({blocked: true});
        vm.tableParams.reload();
      }
    };
    //////////////////////////// *Delete CRUD operation

    // password reset operation
    vm.passReset = function (user) {
      if (confirm('Are you sure?')) {
        Auth.$sendPasswordResetEmail(user.email).then(function(){
          toastr.success('We have sent an email with new password', 'Password reset!');
          $log.log("Password reset email sent successfully");
        }, function(error){
          $log.log("Error sending password reset email:", error);
        });
      }
    };
    //////////////////////////// *password reset operation


    // Initialize table
    vm.users.$loaded().then(function() {

      // watch data in scope, if change reload table
      $scope.$watchCollection(function() {
        return vm.users;
      }, function(newVal, oldVal) {
        if (newVal !== oldVal) {
          vm.tableParams.reload();
        }
      });

      $scope.$watch(function() {
        return vm.searchText;
      }, function(newVal, oldVal) {
        if (newVal !== oldVal) {
          vm.tableParams.filter({ $: newVal });
          vm.tableParams.reload();
        }
      });
      ///////////////////////////////////////////// *watch data in scope, if change reload table

      vm.tableParams = new NgTableParams({
        // initial filter
        sorting: {
          name: 'asc'
        },
        filter: {
          blocked: false
        }
      }, {
        dataset: vm.users
      });


    });
    ////////////////////////////////////////// *Initialize table

  }

  function NewUserController(toastr, $log, firebase, $firebaseArray, $state){
    var vm = this;
    var ref = firebase.database().ref();

    vm.users = $firebaseArray(ref.child('users'));
    var profiles = ref.child('users');

    // Submit operation
    vm.submit = function() {

      vm.userEntry = {
        name: vm.user.name,
        email: vm.user.email,
        role: vm.user.role,
        address: {
          street: vm.user.address.street,
          city: vm.user.address.city,
          zip: vm.user.address.zip,
          country: vm.user.address.country
        },
        phone: vm.user.phone,
        blocked: false
      };

      /* eslint-disable */
      secondaryApp.auth().createUserWithEmailAndPassword(vm.user.email, vm.user.password)
        .then(function(userData) {
          profiles.child(userData.uid).set(vm.userEntry);
          secondaryApp.auth().signOut();
          secondaryApp.delete();
          $log.log("Successfully created user account with uid:", userData.uid);
          toastr.success('User has been created', 'User Added!');
          $state.go('users.list', {}, {reload: true});
        }, function(error) {
          $log.log("Error creating user:", error);
          toastr.error(error.message, 'Adding User Error!');
        }); /////////////////////// *Create CRUD operation

    };
    /* eslint-enable */
    /////////////////////// *Submit operation

  }

  function EditUserController(toastr, $log, firebase, $firebaseObject, $firebaseArray, $state, $stateParams){

    var ref = firebase.database().ref();
    var vm = this;
    var id = $stateParams.id;

    vm.editing = true;

    vm.user = $firebaseObject(ref.child('users').child(id));
    vm.users = $firebaseArray(ref.child('users'));
    var profiles = ref.child('users');

    vm.users.$loaded(function(){
      // Submit operation
      vm.submit = function() {
        vm.userEntry = {
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
          profiles.child(vm.user.$id).update(vm.userEntry, function() {
            toastr.success('User has been saved', 'User Saved!');
            $state.go('users.list', {}, {reload: true});
          });
        };

        updateOnSuccess();
      };
      /////////////////////// *Submit operation
    });

  }

  function ShowUserController(firebase, $firebaseObject, $stateParams){
    var ref = firebase.database().ref();
    var vm = this;
    var id = $stateParams.id;

    vm.user = $firebaseObject(ref.child('users').child(id));
  }

})();
