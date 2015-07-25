var app = angular.module('blogs', []);

app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);

app.controller('MainCtrl', ['$scope','posts',function($scope, posts){
    
  $scope.posts = posts.posts;
    
    $scope.addPost = function(){
        if(!$scope.title || $scope.title === '') { return; }
        
        $scope.posts.push({
                title: $scope.title,
                desc : $scope.desc,
                likes: 0});
        
        $scope.title = '';
        $scope.desc = '';
    };
    
    $scope.incrementLikes = function(post) {
      post.likes += 1;
    };
    
}]);