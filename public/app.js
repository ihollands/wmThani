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

  app.factory("Connection", [
    "$resource",
    ConnectionFactoryFunction
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

  app.controller("UserConnectionsIndexCtrl", [
    "$state",
    "$stateParams",
    "User",
    UserConnectionsIndexControllerFunction
  ])

  app.controller("UserMessageCtrl", [
    "$state",
    "$stateParams",
    "User",
    "Connection",
    UserMessageControllerFunction
  ])

  app.service ("connectionService", function() {
    var selectedUser = {}

    var setUser = function(user) {
      selectedUser = user
    }

    var getUser = function() {
      return selectedUser
    }

    return {
      setUser,
      getUser
    }
  })


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
    .state("delete", {
      url: "/users/delete",
      templateUrl: "/assets/ng-views/users/user-delete.html"
    })
    .state("connections", {
      url: "/users/:_id/connections",
      templateUrl: "/assets/ng-views/users/user-connections.html",
      controller: "UserConnectionsIndexCtrl",
      controllerAs: "vm"
    })
    .state("message", {
      url: "/users/:_id/connections/:conn_id",
      templateUrl: "/assets/ng-views/users/user-message.html",
      controller: "UserMessageCtrl",
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

function ConnectionFactoryFunction ($resource) {
    return $resource("/api/connections/:_id", {}, {
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

  vm.user = User.get({_id: $stateParams._id})

  vm.update = function(){
    vm.user.$update({_id: $stateParams._id}).then(function(){
      $state.go("show", {_id: $stateParams._id})
    })

  }

  vm.destroy = function() {
    if(confirm("Are you sure you want to delete your profile? Once done, you will be unable to retrieve your account.")) {
      vm.user.$delete({_id: $stateParams._id}).then(function(){
          $state.go("welcome")
        })
    }
    else console.log("deletion cancelled")

  }

}

function UserConnectionsIndexControllerFunction($state, $stateParams, User) {
  var vm = this

  var connectedUserIds = []

  User.get({_id: $stateParams._id}).$promise.then(response => {
    vm.user = response
    vm.connectedUsers = []

    for (var i = 0; i < vm.user.connections.length; i++) {
      vm.user.connections[i].users.find(x => {
        if (x !== vm.user._id) {
          connectedUserIds.push(x)
        }
      })
    }
    connectedUserIds.forEach(function(id) {
      User.get({_id: id}).$promise.then(response => {
        vm.connectedUsers.push(response)
      })
    })

    User.query().$promise.then(response => {
      var allUsers = response
      vm.gymusers = allUsers.filter(x => {
        return ((x.gym === vm.user.gym) && (x._id !== vm.user._id))
      })
    })
  })

  vm.gymFilter = function(gymuser) {
    if (connectedUserIds.indexOf(gymuser._id) === -1) {
      return gymuser
    } else console.log("filtered")
  }

  vm.viewConnection = function(user2) {
    var connection = vm.user.connections.find(x => {
      return x.users.indexOf(user2._id) !== -1
    })
    $state.go("message", {_id: vm.user._id, conn_id: connection._id})
  }

}

function UserMessageControllerFunction ($state, $stateParams, User, Connection) {
  vm = this


  vm.connection = {}
  vm.user1 = {}
  vm.user2 = {}

  Connection.get({_id: $stateParams.conn_id}).$promise.then(response => {
    vm.connection = response

    User.get({_id: $stateParams._id}).$promise.then(response => {
      vm.user1 = response;

      var secondUserId = vm.connection.users.find(x => {
        return x !== vm.user1._id
      })

      User.get({_id: secondUserId}).$promise.then(response => {
        vm.user2 = response
      })
    })
  })


  vm.createConnection = function() {
    vm.connection = new Connection({
      users:[vm.user1._id, vm.user2._id],
      messages: []
    })
    console.log(vm.connection)
    vm.connection.$save().then(() =>{
    vm.user1.connections.push(vm.connection)
    vm.user2.connections.push(vm.connection)
    vm.user1.$update({_id: vm.user1._id}).then(() => {
      vm.user2.$update({_id: vm.user2._id}).then(() => {
        $state.reload()
      })
    })
  })
}





}







})();
