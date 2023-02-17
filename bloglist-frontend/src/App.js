import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import loginService from "./services/login";

const App = () => {
  const noteFormRef = useRef();

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ message: null, type: null });

  // const [title, setTitle] = useState("");
  // const [author, setAuthor] = useState("");
  // const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  console.log(blogs, "blogs of data");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      console.log(user, "user of app");
      blogService.setToken(user.token);
      setUser(user);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage({ message: exception.response.data.error, type: "error" });
      setTimeout(() => {
        setMessage({ message: null, type: null });
        setMessage(null);
      }, 5000);
    }
  };

  const raisedLike = async (id) => {
    const updatedBlog = blogs.find((blogs) => blogs.id === id);
    // const newBlog = {
    //   likes: newLike,
    //   author: updatedBlog.author,
    //   title: updatedBlog.title,
    //   url: updatedBlog.url,
    // };
    // console.log(newBlog, "newBLog");

    const newBlog = { ...updatedBlog, likes: updatedBlog.likes + 1 };
    const response = await blogService.update(id, newBlog);

    setBlogs(blogs.map((blogs) => (blogs.id === id ? response : blogs)));
  };

  const loginForm = () => (
    <Togglable buttonLabel="show me login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  const logOut = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const handleBlogCreate = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(returnedBlog));
    //console.dir(noteFormRef.current(), "noteform");
    noteFormRef.current();
    //console.log(noteFormRef.current(), "returnedblog");
  };
  // const handleBlogcreate = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const newBlog = {
  //       title,
  //       author,
  //       url,
  //     };

  //     const createdBlog = await blogService.create(newBlog);
  //     setBlogs(blogs.concat(createdBlog));
  //     setTitle("");
  //     setAuthor("");
  //     setUrl("");
  //     setMessage({
  //       message: `a new blog ${createdBlog.title} added by ${createdBlog.author}`,
  //       type: "update",
  //     });
  //     console.log("message");
  //     console.log(blogs, "i am blog");
  //     setTimeout(() => {
  //       setMessage({ message: null, type: null });
  //       setMessage(null);
  //     }, 5000);
  //   } catch (exception) {
  //     setMessage({ message: exception.response.data.error, type: "error" });
  //   }
  //   setTimeout(() => {
  //     setMessage({ message: null, type: null });
  //     setMessage(null);
  //   }, 5000);
  // };

  const blogForm = () => {
    return (
      <Togglable buttonLabel="create new blog" ref={noteFormRef}>
        <BlogForm createBlog={handleBlogCreate} setMessage={setMessage} />
      </Togglable>
    );
  };

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message?.message} type={message?.type} />
      {user === null ? (
        <>
          <h2>log into application</h2>
          {loginForm()}
        </>
      ) : (
        <>
          <span>{user.name} logged-in </span>
          <button onClick={logOut}>log out</button>

          <h2>new blog</h2>
          {blogForm()}
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              setBlogs={setBlogs}
              blogs={blogs}
              user={user}
              setMessage={setMessage}
              updateLikes={raisedLike}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
