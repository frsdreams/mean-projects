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
    
     // Retrieve single post
      o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
          return res.data;
        });
      };
    
    // Create post call
    o.create = function(post) {
      return $http.post('/posts', post).success(function(data){
        o.posts.push(data);
      });
    };
    
    //add a comment
    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
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
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
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

app.controller('PostsCtrl', ['$scope','$stateParams','posts','post', function($scope, $stateParams, posts, post){
    
   $scope.post = post;
    
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
        approvestat: 0 // approvestat = 1 for displaying the comments
      }).success(function(comment) {
         $scope.post.comments.push(comment);
       });
        
      $scope.body = '';
    };
    
}]);