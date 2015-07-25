var app = angular.module('blogs',  ['ui.router']);

app.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };
    
    // Retrieve all the posts
    o.getAll = function() {
        return $http.get('/posts').success(function(data){
          angular.copy(data, o.posts);
        });
      };
    
    // Create post call
    o.create = function(post) {
      return $http.post('/posts', post).success(function(data){
        o.posts.push(data);
      });
    };
    
     // Increment Likes
    o.like = function(post) {
      return $http.put('/posts/' + post._id + '/like')
        .success(function(data){
          post.likes += 1;
        });
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
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
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
        
        posts.create({
                title: $scope.title,
                desc : $scope.desc,
         });
        
        $scope.title = '';
        $scope.desc = '';
    };
    
    $scope.incrementLikes = function(post) {
       posts.like(post);
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