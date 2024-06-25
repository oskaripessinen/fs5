const dummy = (blogs) => {
    return 1;
  }


  const totalLikes = (blogs) => {
    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
    return totalLikes;
  }

  const favoriteBlog = (blogs) => {
    const favoriteBlog = blogs.reduce((mostLiked, blog) => {
        return (blog.likes > mostLiked.likes) ? blog : mostLiked;
      }, blogs[0]);
      return favoriteBlog;
  }
  
  module.exports = {
    dummy, totalLikes, favoriteBlog
  }