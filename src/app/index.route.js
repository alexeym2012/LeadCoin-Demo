(function() {
  'use strict';

  angular
    .module('minotaur')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    //dashboard
      .state('dashboard', {
        url: '/app/dashboard',
        templateUrl: 'app/pages/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })

      //categories
      .state('categories', {
        url: '/categories',
        template: '<div ui-view></div>',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('categories.list', {
        url: '/list',
        templateUrl: 'app/pages/categories/list.html',
        controller: 'CategoriesController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('categories.new', {
        url: '/new',
        templateUrl: 'app/pages/categories/new.html',
        controller: 'CategoriesController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('categories.edit', {
        url: '/edit/:id',
        templateUrl: 'app/pages/categories/edit.html',
        controller: 'CategoriesController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('categories.show', {
        url: '/show/:id',
        templateUrl: 'app/pages/categories/show.html',
        controller: 'CategoriesController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })

      //products
      .state('products', {
        abstract: true,
        url: '/products',
        template: '<div ui-view></div>',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('products.list', {
        url: '/list',
        templateUrl: 'app/pages/products/list.html',
        controller: 'ProductsController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('products.new', {
        url: '/new',
        templateUrl: 'app/pages/products/new.html',
        controller: 'ProductsController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('products.edit', {
        url: '/edit/:id',
        templateUrl: 'app/pages/products/edit.html',
        controller: 'ProductsController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('products.show', {
        url: '/show/:id',
        templateUrl: 'app/pages/products/show.html',
        controller: 'ProductsController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })

      //orders
      .state('orders', {
        abstract: true,
        url: '/orders',
        template: '<div ui-view></div>',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('orders.list', {
        url: '/list',
        templateUrl: 'app/pages/orders/list.html',
        controller: 'OrdersController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('orders.show', {
        url: '/show/:id',
        templateUrl: 'app/pages/orders/show.html',
        controller: 'OrdersController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })

      //users
      .state('users', {
        abstract: true,
        url: '/users',
        template: '<div ui-view></div>',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('users.list', {
        url: '/list',
        templateUrl: 'app/pages/users/list.html',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('users.new', {
        url: '/new',
        templateUrl: 'app/pages/users/new.html',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('users.edit', {
        url: '/edit/:id',
        templateUrl: 'app/pages/users/edit.html',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('users.show', {
        url: '/show/:id',
        templateUrl: 'app/pages/users/show.html',
        controller: 'UsersController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'app/pages/profile/profile.html',
        controller: 'ProfileController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/pages/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'ctrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      })

      .state('core', {
        abstract: true,
        url: '/core',
        template: '<div ui-view></div>',
        specialClass: 'core',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$waitForSignIn();
          }]
        }
      })
      .state('core.login', {
        url: '/login',
        templateUrl: 'app/pages/login/login.html',
        controller: 'LoginController',
        controllerAs: 'ctrl',
        specialClass: 'core',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$waitForSignIn();
          }]
        }
      })
      .state('core.signup', {
        url: '/signup',
        templateUrl: 'app/pages/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'ctrl',
        specialClass: 'core',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$waitForSignIn();
          }]
        }
      })
      .state('core.forgotpass', {
        url: '/forgotpass',
        templateUrl: 'app/pages/forgotpass/forgotpass.html',
        controller: 'ForgotpassController',
        controllerAs: 'ctrl',
        specialClass: 'core',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          'currentAuth': ['Auth', function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$waitForSignIn();
          }]
        }
      });

    $urlRouterProvider.otherwise('/app/dashboard');
  }

})();
