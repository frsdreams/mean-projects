var app = angular.module('blogs',  ['ui.router']);

app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]);

app.controller('MainCtrl', ['$scope','posts',function($scope, posts){
    
  $scope.posts = posts.posts;
    
    $scope.addPost = function(){
        if(!$scope.title || $scope.title === '') { return; }
        
        $scope.posts.push({
                title: $scope.title,
                desc : $scope.desc,
                likes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', approvestat: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', approvestat: 0}
                  ]
        });
        
        $scope.title = '';
        $scope.desc = '';
    };
    
    $scope.incrementLikes = function(post) {
      post.likes += 1;
    };
    
}]);

app.controller('PostsCtrl', ['$scope','$stateParams','posts',function($scope, $stateParams, posts){
    
    $scope.post = posts.posts[$stateParams.id];
    
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        approvestat: 0
      });
        
      $scope.body = '';
    };
    
}]);