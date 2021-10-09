/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, {Component} from "react";
import "./Posts.css";
import gql from "graphql-tag";
import Post from "../Post";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
    this.offline = !navigator.onLine;
  }
  componentDidMount() {
    

    
      // fetch the initial posts
      this.props.apollo_client
        .query({
          query: gql`
            {
              posts(user_id: "a") {
                id
                user {
                  nickname
                  avatar
                }
                image
                caption
              }
            }
          `
        })
        .then(response => {
          this.setState({ posts: response.data.posts });
          localStorage.setItem("posts", JSON.stringify(response.data.posts));
        });
    
    //  subscribe to posts channel
    this.posts_channel = this.props.pusher.subscribe("posts-channel");

    // listen for a new post
    this.posts_channel.bind(
      "new-post",
      data => {
        this.setState({ posts: this.state.posts.concat(data.post) });

      },
      this
    );
  }

  
}

export default Posts;