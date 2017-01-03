(function(){
  var app = angular.module("WeightMate", ["ui.router", "ngResource"]);

  app.config([
    "$stateProvider",
    "$locationProvider",
    "$urlRouterProvider",
    RouterFunction
  ]);

  app.factory("User", [
    "$resource",
    UserFactoryFunction
  ])

  app.controller("LoginCtrl",[
    "$state",
    "User",
    LoginControllerFunction
  ]);

  app.controller("RegisterCtrl", [
    "$state",
    "User",
    RegisterControllerFunction
  ])

  app.controller("UserShowCtrl", [
    "$state",
    "$stateParams",
    "User",
    UserShowControllerFunction
  ])

  app.controller("UserEditCtrl", [
    "$state",
    "$stateParams",
    "User",
    UserEditControllerFunction
  ])

//Config Functions
function RouterFunction ($stateProvider, $locationProvider, $urlRouterProvider) {
  $stateProvider
    .state("welcome", {
      url: "/",
      templateUrl: "/assets/ng-views/welcome.html",
    })
    .state("login", {
      url: "/login",
      templateUrl: "/assets/ng-views/logreg/login.html",
      controller: "LoginCtrl",
      controllerAs: "vm"
    })
    .state("register", {
      url: "/register",
      templateUrl: "/assets/ng-views/logreg/register.html",
      controller: "RegisterCtrl",
      controllerAs: "vm"
    })
    .state("show", {
      url: "/users/:username",
      templateUrl: "/assets/ng-views/users/user-show.html",
      controller: "UserShowCtrl",
      controllerAs: "vm"
    })
    .state("edit", {
      url: "/users/:username/edit",
      templateUrl: "/assets/ng-views/users/user-edit.html",
      controller: "UserEditCtrl",
      controllerAs: "vm"
    })

  $locationProvider.html5Mode(true)
  $urlRouterProvider.otherwise("/")
}

function UserFactoryFunction ($resource) {
    return $resource("/api/users/:username", {}, {
      update: {method: "PUT"}
    })
  }

// Login and Registration Controller Functions
function LoginControllerFunction ($state, User) {
    var vm = this

    vm.credentials = {
      username : "",
      password : ""
    }

    vm.onSubmit = function () {
      User.get({username: vm.credentials.username}).$promise.then(function(response) {
          vm.user = response;
          if(vm.credentials.username == vm.user.username) {
          if (vm.credentials.password == vm.user.hash) {
            $state.go("show", {username: vm.credentials.username})
            }
            else alert("The password you entered does not match out records for that user. Please try again.")

        } else alert("Account not found. If you do not have an account, please register.")
      })
    }
}


function RegisterControllerFunction ($state, User) {
  var vm = this

  vm.user = new User()

  vm.create = function() {
    vm.user.$save().then(() => {
      $state.go("show", {username: vm.user.username})
    })

  }

}

//Route Functions
function UserShowControllerFunction($state, $stateParams, User) {
  var vm = this

  vm.user = User.get({username: $stateParams.username})

  vm.onSubmit = function() {
    $state.go("edit", {username: $stateParams.username})
  }
}

function UserEditControllerFunction($state, $stateParams, User) {
  var vm = this

  User.get({username: $stateParams.username}).$promise.then(response => {
    vm.user = response
  })

  vm.update = function(){
    vm.user.$update({username: $stateParams.username}).then(function(){
      $state.go("show", {username: $stateParams.username})
    })

  }

  vm.destroy = function() {
    vm.user.$delete({name: $stateParams.name}).then(function(){
        $state.go("welcome")
      })
  }

}


})();
