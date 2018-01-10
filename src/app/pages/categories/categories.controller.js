(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('CategoriesController', CategoriesController)
    .controller('NewCategoryController', NewCategoryController)
    .controller('EditCategoryController', EditCategoryController)
    .controller('ShowCategoryController', ShowCategoryController);

  /** @ngInject */
  function CategoriesController($scope, $filter, NgTableParams, toastr, $log, firebase, $firebaseArray, $firebaseObject) {
    var vm = this;

    // General database variable
    var ref = firebase.database().ref();
    vm.categories = $firebaseArray(ref.child('categories'));
    vm.categoriesObject = $firebaseObject(ref.child('categories'));
    //////////////////////////// *General database variable

    //////////////////////////////////////////
    //************ Table Settings **********//
    //////////////////////////////////////////

    // Delete CRUD operation
    vm.delete = function (category) {
      if (confirm('Are you sure?')) {
        vm.categories.$remove(category).then(function () {
          $log.log('category deleted');
          toastr.success('Category Removed!', 'Category has been removed');
        });
      }
    };
    //////////////////////////// *Delete CRUD operation


    // Initialize table
    vm.categories.$loaded().then(function() {

      //extend array
      angular.forEach(vm.categories, function(value){
        if (value.parentId && vm.categoriesObject[value.parentId]) {
          value.parentName = vm.categoriesObject[value.parentId].name;
        }
      });
      ///////////////////////////////////////////// *extend array


      // watch data in scope, if change reload table
      $scope.$watchCollection(function() {
        return vm.categories;
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
        }
      }, {
        dataset: vm.categories
      });


    });
    ////////////////////////////////////////// *Initialize table

  }

  function NewCategoryController(toastr, $log, firebase, $firebaseArray, $state){
    var vm = this;
    var ref = firebase.database().ref();

    vm.categories = $firebaseArray(ref.child('categories'));

    // Submit operation
    vm.submit = function() {
      if (!vm.category.parentId) {
        vm.category.parent = true;
      } else {
        vm.category.parent = false;
      }
      vm.categories.$add(vm.category).then(function (categoryRef) {
        ref.child('categories').child(categoryRef.key)
          .update({created_at: firebase.database.ServerValue.TIMESTAMP});
        toastr.success('Category Added!', 'Category has been created');
        $state.go('categories.list', {}, {reload: true});
      });
    };
    /////////////////////// *Submit operation
  }

  function EditCategoryController(toastr, $log, firebase, $firebaseObject, $firebaseArray, $state, $stateParams){

    var ref = firebase.database().ref();
    var vm = this;
    var id = $stateParams.id;

    vm.category = $firebaseObject(ref.child('categories').child(id));
    vm.categories = $firebaseArray(ref.child('categories'));

    vm.categories.$loaded(function(){
      // Submit operation
      vm.submit = function() {
        if (!vm.category.parentId) {
          vm.category.parent = true;
        } else {
          vm.category.parent = false;
        }
        vm.category.$save().then(function (categoryRef) {
          ref.child('categories').child(categoryRef.key)
            .update({updated_at: firebase.database.ServerValue.TIMESTAMP});
          toastr.success('Category Saved!', 'Category has been saved');
          $state.go('categories.list', {}, {reload: true});
        });
      };
      /////////////////////// *Submit operation
    });

  }

  function ShowCategoryController(firebase, $firebaseObject, $stateParams){
     var ref = firebase.database().ref();
      var vm = this;
      var id = $stateParams.id;

      vm.category = $firebaseObject(ref.child('categories').child(id));
      vm.categoriesObject = $firebaseObject(ref.child('categories'));
  }

})();
