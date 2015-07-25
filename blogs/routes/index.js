var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// Retrieve Posts data
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

// Send and save Posts data
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
 
  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


// Preload post objects on routes with ':post'
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});


// Retrieve Posts and comments by ID
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }
      res.json(post);
  });
});


// Increment Likes for a post
router.put('/posts/:post/like', function(req, res, next) {
  req.post.like(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

// create a new comment for post
router.post('/posts/:post/comments', function(req, res, next) {
  
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});


module.exports = router;
