import React, { Component } from "react";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {

    return (
      <section class="forms">
        <div class="form-wrapper">
          <h2 class="form-title">Sign In</h2>
          <form id="login" action="/login" method="POST">
            <label for="username">Username</label>
            <input id="username" type="text" name="username" />
            <label for="password">Password</label>
            <input id="password" type="password" name="password" />
            <button>Sign In</button>
          </form>
        </div>
        <div class="form-wrapper">
          <h2 class="form-title">New Account</h2>
          <form id="register" action="/register" method="POST">
            <label for="newUsername">Username</label>
            <input id="newUsername" type="text" name="username" />
            <label for="newPassword">Password</label>
            <input id="newPassword" type="password" name="password" />
            <button>Create an account</button>
          </form>
        </div>
      </section>
    );
  }
}
