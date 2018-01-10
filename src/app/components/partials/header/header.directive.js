(function() {
  'use strict';

  angular
    .module('minotaur')
    .directive('minotaurHeader', minotaurHeader);

  /** @ngInject */
  function minotaurHeader($window, $timeout) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/partials/header/header.html',
      controller: HeaderController,
      controllerAs: 'header',
      bindToController: true,
      link: function (scope, element) {
        var app = angular.element('.appWrap'),
            $el = angular.element(element),
            w = angular.element($window);

        function toggleStickyHeader(){
          if (!$el.hasClass('force-header-sm') && !$el.hasClass('header-aside')){
            if(!$el.hasClass('header-sm') && $window.pageYOffset > 10){
              $el.addClass('header-sm');
              app.addClass('header-sm animate');
              $timeout(function(){
                app.removeClass('animate');
              }, 400);
            } else if($el.hasClass('header-sm') && $window.pageYOffset <= 10){
              $el.removeClass('header-sm');
              app.addClass('animate');
              app.removeClass('header-sm');
              $timeout(function(){
                app.removeClass('animate');
              }, 400);
            }
          }
        }

        w.bind('scroll', toggleStickyHeader);

        function setViewport(){
          if($window.innerWidth < 768){
            $el.addClass('viewport-sm');
            app.addClass('viewport-sm');
          } else {
            $el.removeClass('viewport-sm');
            app.removeClass('viewport-sm');
          }
        }

        setViewport();

        w.bind('resize', setViewport);
      }
    };

    return directive;

    /** @ngInject */
    function HeaderController(Auth, $state, $window) {
      var vm = this;

      vm.logout = function() {
        Auth.$signOut().then(function(){
          $state.go('core.login', {}, {reload: true});
        });
        // destroy all firebase refs
        angular.forEach($window.openFirebaseConnections, function (item) {
          item.$destroy();
        });
      };

      vm.notifications = [{
        content: 'User Imrich cancelled account',
        time: '6 minutes ago',
        icon: 'fa fa-ban',
        color: 'bg-danger'
      },{
        content: 'New user registered',
        time: '12 minutes ago',
        icon: 'fa fa-bolt',
        color: 'bg-primary'
      },{
        content: 'User Robert locked account',
        time: '18 minutes ago',
        icon: 'fa fa-lock',
        color: 'bg-greensea'
      },{
        content: 'User Jon cancelled account',
        time: '36 minutes ago',
        icon: 'fa fa-ban',
        color: 'bg-danger'
      },{
        content: 'User Joffrey has been muted',
        time: '42 minutes ago',
        icon: 'fa fa-bullseye',
        color: 'bg-warning'
      },{
        content: 'User Sam locked account',
        time: '58 minutes ago',
        icon: 'fa fa-lock',
        color: 'bg-greensea'
      }]

    }
  }

})();
