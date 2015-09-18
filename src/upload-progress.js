(function(){

angular
  .module('platanus.upload')
  .directive('uploadProgress', uploadProgress);

function uploadProgress() {
  var directive = {
    template:
      '<div ng-hide="shouldHide()" ' +
        'ng-class="{ ' +
          '\'bar\': barType(), ' +
          '\'indicator\': !barType(), ' +
          '\'in-progress\': inProgress(), ' +
          '\'completed\': isCompleted(), ' +
          '\'error\': hasErrors() }" ' +
        'class="upload-progress">' +
        '<div ng-if="!barType()">{{ getPercentage() }}</div>' +
        '<div ng-if="barType()" style="width:{{getPercentage()}}" class="inner-bar"></div>' +
      '</div>',
    restrict: 'E',
    replace: true,
    scope: {
      progressData: '=',
      hideOnZero: '@',
      hideOnComplete: '@',
      type: '@'
    },
    link: link
  };

  return directive;

  function link(_scope) {
    if(!_scope.progressData) _scope.progressData = { loaded: 0, total: 1, error: false };

    _scope.getPercentage = getPercentage;
    _scope.getRawProgress = getRawProgress;
    _scope.inProgress = inProgress;
    _scope.isCompleted = isCompleted;
    _scope.hasErrors = hasErrors;
    _scope.barType = barType;
    _scope.shouldHide = shouldHide;

    function getRawProgress() {
      return parseInt(100 * (_scope.progressData.loaded / _scope.progressData.total));
    }

    function inProgress() {
      var progress = getRawProgress();
      return (!_scope.progressData.error && (progress > 0 && progress < 100));
    }

    function isCompleted() {
      return (!_scope.progressData.error && getRawProgress() === 100);
    }

    function hasErrors() {
      return !!_scope.progressData.error;
    }

    function getPercentage() {
      return getRawProgress() + '%';
    }

    function barType() {
      return _scope.type === 'bar';
    }

    function shouldHide() {
      return ((getRawProgress() === 0 && _scope.hideOnZero) ||
        (isCompleted() && _scope.hideOnComplete));
    }
  }
}

})();
