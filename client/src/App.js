import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialUserFormState = {
  name: "",
}
const initialPostFormState = {
  text: "",
}
function App() {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState(initialUserFormState);
  const [isEditingUser, setEditingUser] = useState(0);

  const [postForm, setPostForm] = useState(initialPostFormState);
  const [isEditingPost, setEditingPost] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:4000/api/users').then(response => {
      setUsers(response.data);
    }).catch(err => console.log(err));
  }, []);

  const onUserInputChange = e => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  const onUserSubmit = e => {
    e.preventDefault();
    if (isEditingUser === 0) {
      axios.post('http://localhost:4000/api/users', userForm).then(response => {
        setUsers([...users, { ...userForm, id: response.data.id }]);
      }).catch(err => console.log(err));
    } else {
      axios.put('http://localhost:4000/api/users/' + isEditingUser, userForm).then(response => {
        setUsers(users.map(user => {
          if (Number(user.id) === isEditingUser) return { ...user, ...userForm }
          return user;
        }));
      }).catch(err => console.log(err));
    }
    setUserForm(initialUserFormState);
    setEditingUser(0);
  }

  const onPostInputChange = e => {
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
  }

  const onPostSubmit = e => {
    /*e.preventDefault();
    if (isEditingPost === 0) {
      axios.post('http://localhost:4000/api/users', postForm).then(response => {
        setPosts([...posts, { ...postForm, id: response.data.id }]);
      }).catch(err => console.log(err));
    } else {
      axios.put('http://localhost:4000/api/posts/' + isEditingPost, postForm).then(response => {
        setPosts(posts.map(post => {
          if (Number(post.id) === isEditingPost) return { ...post, ...postForm }
          return post;
        }));
      }).catch(err => console.log(err));
    }
    setPostForm(initialPostFormState);
    setEditingPost(0);*/
  }

  const editUser = id => e => {
    setEditingUser(id);
    setUserForm(users.find(user => Number(user.id) === Number(id)))
  }

  const removeUser = id => e => {
    axios.delete('http://localhost:4000/api/users/' + id).then(response => {
      setUsers(users.filter(user => Number(user.id) !== Number(id)));
    }).catch(err => console.log(err));
  }

  const editPost = (id, userid) => e => {
    setEditingPost(id);
    //setPostForm(posts.find(user => Number(user.id) === Number(id)))
  }

  const removePost = (id, userid) => e => {
    /*axios.delete('http://localhost:4000/api/posts/' + id).then(response => {
      setPosts(posts.filter(post => Number(post.id) !== Number(id)));
    }).catch(err => console.log(err));*/
  }

  return (
    <div className="App">
      <h2>Users form</h2>
      <form onSubmit={onUserSubmit}>
        <input
          type="text"
          name="name"
          placeholder="User name here"
          required
          value={userForm.name}
          onChange={onUserInputChange}
        />
        <button className="submitUser">Submit</button>
      </form>
      <br />
      <h2>Posts form</h2>
      <form onSubmit={onPostSubmit}>
        <input
          type="text"
          name="text"
          placeholder="Post text here"
          required
          value={postForm.text}
          onChange={onPostInputChange}
        />
        <button className="submitUser">Submit</button>
      </form>
      <br />
      <h1>Users list</h1>
      <div className="users">
        {
          users ? users.map(user => (
            <div key={user.id} className="user">
              <p>ID: {user.id}</p>
              <p>Name: {user.name}</p>
              <button className="editUser" onClick={editUser(user.id)}>Edit</button>
              <button className="removeUser" onClick={removeUser(user.id)}>Remove</button>
              <h2>Posts</h2>
              <div className="posts">
                {
                  user.posts ? user.posts.map(post => (
                    <div className="post">
                      <p>ID: {post.id}</p>
                      <p>Text: {post.text}</p>
                      <button className="editPost" onClick={editPost(post.id, user.id)}>Edit</button>
                      <button className="removePost" onClick={removePost(post.id, user.id)}>Remove</button>
                    </div>
                  )) : null
                }

              </div>
            </div>
          )) : null
        }
      </div>
    </div>
  );
}

export default App;
