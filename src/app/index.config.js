(function() {
  'use strict';

  angular
    .module('minotaur')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $translateProvider, $locationProvider, $provide) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 8000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    // angular-language
    $translateProvider.useStaticFilesLoader({
      prefix: 'assets/languages/',
      suffix: '.json'
    });
    $translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);

    // remove ! hash prefix
    $locationProvider.hashPrefix('');

    // inject the $delegate dependency into our decorator method
    firebaseDecorator.$inject = ['$delegate'];

    // Whenever $firebaseArray's and $firebaseObjects are created,
    // they'll now be tracked by window.openFirebaseConnections
    $provide.decorator("$firebaseArray", firebaseDecorator);
    $provide.decorator("$firebaseObject", firebaseDecorator);

    function firebaseDecorator ($delegate) {
      return function (ref) {
        var list = $delegate(ref);
        /* eslint-disable */
        window.openFirebaseConnections.push(list);
        /* eslint-enable */
        return list;
      };
    }

  }

})();
