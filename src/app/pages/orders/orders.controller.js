(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('OrdersController', OrdersController)
    .controller('ShowOrderController', ShowOrderController);

  /** @ngInject */
  function OrdersController($scope, $filter, NgTableParams, toastr, $log, firebase, $firebaseArray, $firebaseObject) {
    var vm = this;

    // General database variable
    var ref = firebase.database().ref();
    vm.orders = $firebaseArray(ref.child('orders'));

    vm.categories = $firebaseArray(ref.child('categories'));
    vm.categoriesObject = $firebaseObject(ref.child('categories'));

    vm.products = $firebaseArray(ref.child('products'));
    vm.productsObject = $firebaseObject(ref.child('products'));
    //////////////////////////// *General database variable

    //////////////////////////////////////////
    //************ Table Settings **********//
    //////////////////////////////////////////

    // Delete CRUD operation
    vm.delete = function (order) {
      if (confirm('Are you sure?')) {
        vm.orders.$remove(order).then(function () {
          $log.log('order deleted');
          toastr.success('Order Removed!', 'Order has been removed');
        });
      }
    };
    //////////////////////////// *Delete CRUD operation

    vm.changeStatus = function (order, status) {
      order.status = status;
      vm.orders.$save(order).then(function () {
        $log.log('status changed');
      });
    };


    // Initialize table
    vm.orders.$loaded().then(function() {


      // watch data in scope, if change reload table
      $scope.$watchCollection(function() {
        return vm.orders;
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
          id: 'asc'
        }
      }, {
        dataset: vm.orders
      });


    });
    ////////////////////////////////////////// *Initialize table

  }

  function ShowOrderController(firebase, $firebaseObject, $stateParams){
    var ref = firebase.database().ref();
    var vm = this;
    var id = $stateParams.id;

    vm.order = $firebaseObject(ref.child('orders').child(id));
  }

})();
