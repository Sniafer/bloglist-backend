const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (a, b) => {
    return a.likes > b.likes ? a : b;
  };

  return blogs.reduce(reducer);
};

const mostBlogs = (blogsArray) => {
  const allAuthors = blogsArray.map((blog) => blog.author);
  const result = _.head(_(allAuthors).countBy().entries().maxBy(_.last));
  const blogs = blogsArray.filter((blog) => blog.author === result);

  return {
    author: result,
    blogs: blogs.length,
  };
};

const mostLikes = (blogs) => {
  const reducer = (a, b) => {
    return a.likes > b.likes ? a : b;
  };
  const mostFavorite = blogs.reduce(reducer);
  return {
    author: mostFavorite.author,
    likes: mostFavorite.likes,
  };
};

const initialBlogs = [
  {
    user: "615eb643e147772864db26fe",
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const initialUsers = [
  {
    _id: "615eacf5f32a67c94d732b0e",
    blogs: [],
    username: "wik",
    passwordHash: "123",
    name: "Czerni Sniafi",
    __v: 0,
  },
  {
    _id: "615eacf5f32a67c94d732b0f",
    blogs: [],
    username: "Snif",
    passwordHash: "123",
    name: "Snifi Sniafi",
    __v: 0,
  },
];

module.exports = {
  initialUsers,
  initialBlogs,
  mostLikes,
  favoriteBlog,
  dummy,
  totalLikes,
  mostBlogs,
};
