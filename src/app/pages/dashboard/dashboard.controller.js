(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('DashboardController', DashboardController)
    .controller('OrdersChartController', OrdersChartController)
    .controller('ProductsChartController', ProductsChartController);

  /** @ngInject */
  function DashboardController(toastr, $firebaseArray, firebase, $filter) {
    var vm = this;

    toastr.success('All crud operations are disabled for demo purposes on firebase db level, but will be functional on your own firebase database', 'CRUD Operations Disabled!', {progressBar: true, timeOut: '30000'});

    // General database variable
    var ref = firebase.database().ref();
    vm.products = $firebaseArray(ref.child('products'));
    vm.orders = $firebaseArray(ref.child('orders'));
    vm.users = $firebaseArray(ref.child('users'));
    vm.categories = $firebaseArray(ref.child('categories'));
    //////////////////////////// *General database variable

    vm.users.$loaded(function(){
      vm.activeUsers = $filter('filter')(vm.users, {blocked: false});
    });

    vm.ordersValue = 0;

    vm.orders.$loaded(function(){
      angular.forEach(vm.orders, function(val) {
        vm.ordersValue += val.subTotal;
      });
    });

  }

  function OrdersChartController($scope, $filter, $firebaseArray, firebase, $log, moment){
    var vm = this;

    var ref = firebase.database().ref();
    vm.orders = $firebaseArray(ref.child('orders'));

    vm.range = '7d';

    vm.labels = [];
    vm.series = ['Orders'];
    vm.data = [[]];
    vm.options = {
      tooltips: {
        titleSpacing: 10,
        titleMarginBottom: 10,
        bodySpacing: 8,
        cornerRadius: 3,
        xPadding: 15,
        yPadding: 15,
        callbacks: {
          label: function(tooltipItem){
            return '$' + tooltipItem.yLabel
          }
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontFamily: '"Raleway", "Arial", sans-serif',
            fontSize: 13,
            fontStyle: 'bold',
            fontColor: '#333'
          }
        }],
        yAxes: [{
          gridLines: {
            color: '#eaeaea'
          },
          ticks: {
            fontFamily: '"Raleway", "Arial", sans-serif',
            fontSize: 13,
            fontStyle: 'bold',
            fontColor: '#333'
          }
        }]
      }
    };
    vm.datasetOverride = [{
      backgroundColor: '#45ccce',
      hoverBackgroundColor: '#25aeb0',
      borderWidth: 0
    }];

    function fetchOrders(){
      vm.data = [[]];
      vm.labels = [];

      vm.orders.$ref()
        .orderByChild('created_at')
        .limitToLast(1)
        .once('value', function(snapshot){
          snapshot.forEach(function(data) {

            var lastOrder = data.val();
            var lastDate = moment(lastOrder.created_at).startOf('day').format('x');
            var x;
            var dayDuration = 86400000;

            if (vm.range === '7d') {
              x = 7;
              lastDate -= 6*dayDuration;
            } else if (vm.range === '31d') {
              x = 31;
              lastDate -= 30*dayDuration;
            }

            for(var i = 0; i < x; i++) {
              vm.labels.push($filter('date')(lastDate, 'dd MMM yyyy'));
              lastDate += dayDuration;
            }

            vm.orders.$loaded(function(){
              angular.forEach(vm.labels, function(date){
                var dayValue = 0;
                angular.forEach(vm.orders, function(order){
                  var orderDate = $filter('date')(order.created_at, 'dd MMM yyyy');
                  if (orderDate === date) {
                    dayValue += order.subTotal;
                  }
                });
                vm.data[0].push(dayValue);
              });
            });

          });
        });
    }
    fetchOrders();

    $scope.$watch(function() {
      return vm.range;
    }, function(newVal, oldVal) {
      if (newVal !== oldVal){
        fetchOrders();
      }
    });

  }

  function ProductsChartController(firebase, $firebaseArray, $log, $filter) {
    var vm = this;

    var ref = firebase.database().ref();
    vm.categories = $firebaseArray(ref.child('categories'));
    vm.products = $firebaseArray(ref.child('products'));

    vm.labels = [];
    vm.data = [];

    vm.categories.$loaded(function(){
      vm.products.$loaded(function(){

        var parentCategories = $filter('filter')(vm.categories, {parent: true});
        var childCategories = $filter('filter')(vm.categories, {parent: false});

        angular.forEach(parentCategories, function(val){
          var quantity = 0;

          angular.forEach(childCategories, function(category){
            var x = 0;
            angular.forEach(vm.products, function(product){
              if (product.categoryId === category.$id) {
                x++;
              }
            });
            if (category.parentId === val.$id && x > 0) {
              quantity++;
            }
          });

          vm.labels.push(val.name);
          vm.data.push(quantity);
        });
      });
    });
  }

})();
