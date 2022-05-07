import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import Posts from "./Posts";
import axios from "axios";
import { useState, useEffect } from "react";

export default function BottomNav() {
  const [recipes, setRecipes] = useState([
    [
      {
        recipe: {
          images: {
            THUMBNAIL: { url: null },
          },
          yield: null,
          calories: null,
          label: null,
          ingredients: ["milk"],
          url: null,
        },
      },
    ],
  ]);
  const [weight, setWeight] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  // console.log(weight)
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/"),
      axios.get(`http://localhost:8080/api/weights/`),
      axios.get("http://localhost:8080/api/posts"),
      axios.get("http://localhost:8080/api/comments"),
    ])
      .then((all) => {
        // console.log([all[0].data["hits"]]);
        setRecipes([all[0].data["hits"]]);
        setWeight(all[1].data["weights"]);
        setPosts(all[2].data);
        setComments(all[3].data.posts);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const newPost = (event) => {
    event.preventDefault();
    console.log(event.target[0].value)
    const data = {
      message: event.target[0].value
    }
    axios.post('http://localhost:8080/api/posts', data)
      // .then(response => console.log(response))
      .then(response => axios.get("http://localhost:8080/api/posts"))
      .then(posts => setPosts(posts.data))
      .catch(error => console.log(error))
  }

  const newComment = (event) => {
    event.preventDefault();
    console.log(event.target[0].attributes.post_id.value)
    const data = {
      message: event.target[0].value,
      post_id: event.target[0].attributes.post_id.value
    }
    axios.post('http://localhost:8080/api/comments', data)
      .then(response => axios.get("http://localhost:8080/api/comments"))
      .then(comments => setComments(comments.data.posts))
      // .then(comments => console.log(comments.data.posts))
      .catch(error => console.log(error))
    // console.log(data)
  }

  return (
    <>
      BottomNav
      <Router>
        <nav>
          <Link to="/posts">Community</Link>
          <Link to="/homepage">Your Profile</Link>
        </nav>

        <Routes>
          <Route
            path={`/homepage`}
            element={
              <Homepage
                userWeight={weight}
                recipes={recipes}
              />
            }
          />
          <Route
            path="/posts"
            element={
              posts.length === 0 ? (
                "Loading"
              ) : (
                <Posts posts={posts} comments={comments} newPost={newPost} newComment={newComment}/>
                // <Posts posts={posts} comments={comments} onClick={createPost}/>
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}
