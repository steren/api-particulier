import admin from './index';

describe('Controller: Admin', function() {
  let $controller;
  let UserService;

  beforeEach(angular.mock.module(admin));

  beforeEach(angular.mock.inject(function(_UserService_, _$controller_) {
    UserService = _UserService_;
    $controller = _$controller_;
  }));

  it('initialise with users', function() {
    spyOn(UserService, 'loadUsers').and.returnValue({
    then: function(callback) {
      callback(["toto"])
    }});
    let ctrl = $controller("AdminController");
    expect(ctrl.users).toEqual(["toto"])
  });


});