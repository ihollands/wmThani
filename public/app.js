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

  app.controller("UserGymCtrl", [
    "$state",
    "$stateParams",
    "User",
    UserGymControllerFunction
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
      url: "/users/:_id",
      templateUrl: "/assets/ng-views/users/user-show.html",
      controller: "UserShowCtrl",
      controllerAs: "vm"
    })
    .state("edit", {
      url: "/users/:_id/edit",
      templateUrl: "/assets/ng-views/users/user-edit.html",
      controller: "UserEditCtrl",
      controllerAs: "vm"
    })
    .state("gym", {
      url: "/users/:_id/gym",
      templateUrl: "/assets/ng-views/users/user-gym.html",
      controller: "UserGymCtrl",
      controllerAs: "vm"
    })

  $locationProvider.html5Mode(true)
  $urlRouterProvider.otherwise("/")
}

function UserFactoryFunction ($resource) {
    return $resource("/api/users/:_id", {}, {
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
      User.query().$promise.then(response => {
        vm.users = response;
        var extantUser = vm.users.find(x => x.username === vm.credentials.username)
        if (extantUser) {
          if (vm.credentials.password === extantUser.hash) {
            $state.go("show", {_id: extantUser._id})
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
      $state.go("show", {_id: vm.user._id})
    })

  }

}

//Route Functions
function UserShowControllerFunction($state, $stateParams, User) {
  var vm = this

  vm.user = User.get({_id: $stateParams._id})

  vm.onSubmit = function() {
    $state.go("edit", {_id: $stateParams._id})
  }
}

function UserEditControllerFunction($state, $stateParams, User) {
  var vm = this

  User.get({_id: $stateParams._id}).$promise.then(response => {
    vm.user = response
  })

  vm.update = function(){
    vm.user.$update({_id: $stateParams._id}).then(function(){
      $state.go("show", {_id: $stateParams._id})
    })

  }

  vm.destroy = function() {
    vm.user.$delete({_id: $stateParams._id}).then(function(){
        $state.go("welcome")
      })
  }

}

function UserGymControllerFunction($state, $stateParams, User) {
  var vm = this

  vm.user = {}

  vm.gymFilter = function(gymuser) {
    return (gymuser.gym === vm.user.gym) && (gymuser._id !== vm.user._id)
  }

  User.get({_id: $stateParams._id}).$promise.then(response => {
    vm.user = response;
    User.query({gym: vm.user.gym}).$promise.then(response => {
      vm.gymusers = response;
    })
  })

  vm.createConnection = function(user) {
    vm.connection = new Connection({})

    vm.create = function() {
      vm.user.$save().then(() => {
        $state.go("show", {_id: vm.user._id})
      })

    }

  }
}


})();
