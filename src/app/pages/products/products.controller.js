(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ProductsController', ProductsController)
    .controller('NewProductController', NewProductController)
    .controller('EditProductController', EditProductController)
    .controller('ShowProductController', ShowProductController);

  /** @ngInject */
  function ProductsController($scope, $filter, NgTableParams, toastr, $log, firebase, $firebaseArray, $firebaseObject) {
    var vm = this;

    // General database variable
    var ref = firebase.database().ref();
    vm.products = $firebaseArray(ref.child('products'));
    vm.productsObject = $firebaseObject(ref.child('products'));

    vm.categories = $firebaseArray(ref.child('categories'));
    vm.categoriesObject = $firebaseObject(ref.child('categories'));
    //////////////////////////// *General database variable

    vm.categories.$loaded().then(function() {
      vm.childCategories = [];
      //extend array
      angular.forEach(vm.categories, function (value) {
        if (value.parentId && vm.categoriesObject[value.parentId]) {
          value.parentName = vm.categoriesObject[value.parentId].name;
          vm.childCategories.push(value);
        } else {
          if ($filter('filter')(vm.categories, {parentId: value.$id}).length === 0) {
            vm.childCategories.push(value);
          }
        }
      });
    });

    vm.units = {
      pc: "Piece",
      kg: "Kilogram",
      g: "Gram",
      m: "Meter",
      l: "Liter"
    };

    vm.statuses = {
      published: "published",
      notPublished: "not published",
      banned: "banned"
    };

    //////////////////////////////////////////
    //************ Table Settings **********//
    //////////////////////////////////////////

    // Delete CRUD operation
    vm.delete = function (product) {
      if (confirm('Are you sure?')) {
        vm.products.$remove(product).then(function () {
          $log.log('product deleted');
          toastr.success('Product Removed!', 'Product has been removed');
        });
      }
    };
    //////////////////////////// *Delete CRUD operation


    // Initialize table
    vm.products.$loaded().then(function() {

      //extend array
      function extendArray(){
        angular.forEach(vm.products, function(value){
          if (value.categoryId && vm.categoriesObject[value.categoryId]) {
            value.categoryName = vm.categoriesObject[value.categoryId].name;
          }
        });
      }
      extendArray();
      ///////////////////////////////////////////// *extend array


      // watch data in scope, if change reload table
      $scope.$watchCollection(function() {
        return vm.categories;
      }, function(newVal, oldVal) {
        if (newVal !== oldVal) {
          extendArray();
          vm.tableParams.reload();
        }
      });

      $scope.$watch(function() {
        return vm.searchText;
      }, function(newVal, oldVal) {
        if (newVal !== oldVal) {
          extendArray();
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
        dataset: vm.products
      });


    });
    ////////////////////////////////////////// *Initialize table

  }

  function NewProductController(toastr, $log, firebase, $firebaseArray, $state, $filter){

    /* eslint-disable */
    firebase.storage().ref().constructor.prototype.putFiles = function(files) {
      var ref = this;
      return Promise.all(files.map(function(file) {
        var metadata = {
          'contentType': file.type,
          'contentDisposition': 'inline; filename=' + file.name
        };
        return ref.child('/products/' + id + '/' + file.name).put(file, metadata);
      }));
    };
    /* eslint-enable */

    var vm = this;
    var ref = firebase.database().ref();
    var storageRef = firebase.storage().ref();

    vm.products = $firebaseArray(ref.child('products'));
    vm.product = {};

    vm.processing = false;

    ref.child('productsCounter')
      .once('value', function(snapshot){
        var data = snapshot.val();
        if (data) {
          vm.product.id = $filter('digits')(data+1,6);
        } else {
          vm.product.id = '000001';
        }
      });

    // Submit operation
    vm.submit = function() {
      vm.processing = true;

      function save(){
        vm.products.$add(vm.product).then(function (productRef) {
          ref.child('productsCounter').transaction(function(currentValue) {
            return (currentValue || 0) + 1;
          }, function(err, committed, ss) {
            if( err ) {
              $log.log(err);
            }
            else if(committed) {
              var id = $filter('digits')(ss.val(),6);

              ref.child('products').child(productRef.key)
                .update({id: id, created_at: firebase.database.ServerValue.TIMESTAMP});
            }
          });
          toastr.success('Product Added!', 'Product has been created');
          $state.go('products.list', {}, {reload: true});
        });
      }

      if (vm.product.images) {
        storageRef.putFiles(vm.product.images).then(function(metadatas) {
          // Get an array of file metadata
          $log.log(metadatas);
          angular.forEach(metadatas, function(meta, key){
            var file = meta.a;
            vm.product.images[key] = {};
            vm.product.images[key].src = file.downloadURLs[0];
          });
          save();
        }).catch(function(error) {
          // If any task fails, handle this
          vm.processing = false;
          $log.error('Upload failed:', error);
        });
      } else {
        save();
      }

    };
    /////////////////////// *Submit operation
  }

  function EditProductController(toastr, $log, firebase, $firebaseObject, $firebaseArray, $state, $stateParams){

    /* eslint-disable */
    firebase.storage().ref().constructor.prototype.putFiles = function(files) {
      var ref = this;
      return Promise.all(files.map(function(file) {
        var metadata = {
          'contentType': file.type,
          'contentDisposition': 'inline; filename=' + file.name
        };
        return ref.child('/products/' + id + '/' + file.name).put(file, metadata);
      }));
    };
    /* eslint-enable */

    var ref = firebase.database().ref();
    var storageRef = firebase.storage().ref();
    var vm = this;
    var id = $stateParams.id;

    vm.product = $firebaseObject(ref.child('products').child(id));
    vm.products = $firebaseArray(ref.child('products'));

    vm.editing = true;
    vm.processing = false;

    vm.products.$loaded(function(){
      // Submit operation
      vm.submit = function() {
        vm.processing = true;

        function save(){
          vm.processing = false;
          vm.product.$save().then(function (productRef) {
            ref.child('products').child(productRef.key)
              .update({updated_at: firebase.database.ServerValue.TIMESTAMP});
            toastr.success('Product Saved!', 'Product has been saved');
            $state.go('products.list', {}, {reload: true});
          });
        }

        if (vm.form.images.$modelValue[0] && vm.form.images.$modelValue[0].size && vm.form.images.$valid) {
          storageRef.putFiles(vm.product.images).then(function(metadatas) {
            // Get an array of file metadata
            angular.forEach(metadatas, function(meta, key){
              var file = meta.a;
              vm.product.images[key] = {};
              vm.product.images[key].src = file.downloadURLs[0];
            });
            save();
          }).catch(function(error) {
            // If any task fails, handle this
            vm.processing = false;
            $log.error('Upload failed:', error);
          });
        } else {
          save();
        }
      };
      /////////////////////// *Submit operation
    });

  }

  function ShowProductController(firebase, $firebaseObject, $stateParams){
    var ref = firebase.database().ref();
    var vm = this;
    var id = $stateParams.id;

    vm.product = $firebaseObject(ref.child('products').child(id));
    vm.productsObject = $firebaseObject(ref.child('products'));
  }

})();
