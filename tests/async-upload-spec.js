ngDescribe({
  name: 'Async upload directive',
  modules: 'platanus.upload',
  inject: ['Upload'],
  parentScope: {
    setUploadData: function(_uploadData) {
      return _uploadData;
    }
  },
  element: '<async-upload upload-callback="setUploadData($uploadData)" upload-url="uploads" ng-model="user.uploadIdentifier"></async-upload>',

  tests: function (deps) {
    var successfullyReponse = null;

    describe('loading a file', function(){
      beforeEach(function() {
        successfullyReponse = {
          upload: {
            identifier: 'OjynOLMx2h',
            id: '84'
          }
        };

        var callback = {
          success: function(callbackSuccess) {
            callbackSuccess(successfullyReponse);
            return callback;
          },
          progress: function(callbackProgress) {
            callbackProgress();
            return callback;
          }
        };

        deps.Upload.upload = jasmine.createSpy('upload').and.returnValue(callback);
        deps.parentScope.setUploadData = jasmine.createSpy('setUploadData');
        deps.element.isolateScope().upload(['my-file.txt']);
      });

      it('updates DOM using binding', function () {
        var element = deps.element.find('div');

        expect(element.attr('ngf-select') !== undefined).toBe(true);
        expect(element.attr('ng-model') !== undefined).toBe(true);
        expect(element.attr('ngf-change') !== undefined).toBe(true);
      });

      it('uploads a file with ngUploadFile service', function() {
        var params = { url: 'uploads', file: 'my-file.txt' };
        expect(deps.Upload.upload).toHaveBeenCalledWith(params);
      });

      it('calls defined callback on parent scope with upload data', function() {
        expect(deps.parentScope.setUploadData).toHaveBeenCalledWith(successfullyReponse);
      });

      it('sets upload identifier from response', function() {
        var scope = deps.element.scope();
        deps.element.isolateScope().upload(['my-file.txt']);
        expect(scope.user.uploadIdentifier).toEqual('OjynOLMx2h');
      });
    });
  }
});
