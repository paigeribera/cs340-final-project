import React, { Component } from "react";
class UpdateProduct extends Component {
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Product Name:
            <input type="text"/>
        </label>
        <label>
          Product Category:
            <input type="text"/>
        </label>
        <label>
          Product Price:
            <input type="text"/>
        </label>
        <label>
          Product Rating:
            <input type="text"/>
        </label>
        </form>
    );
  }
}

export default UpdateProduct
