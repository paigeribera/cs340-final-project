import React, { Component } from "react";
import shortid from "shortid";
import axios from "axios";
import { Button, Grid, Cell } from "react-md";

import UpdateProduct from "./UpdateProduct";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      lists: [],
      products: [],
      userList: [],
      productList: [],
      // user form state
      first_name: "",
      last_name: "",
      email: "",
      // list form state
      list_name: "",
      description: "",
      // product form state
      product_name: "",
      category: "",
      price: "",
      rating: "",
      showUserForm: false,
      showProductForm: false,
      showListForm: false,
      apiUrl: "https://calm-ridge-35445.herokuapp.com/",
      selectedUser: { first_name: "", last_name: "", email: "" },
      selectedList: { name: "", description: "" },
      selectedProduct: { name: "", category: "", price: "", rating: "" }
    };

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleProductFormSubmit = this.handleProductFormSubmit.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.handleUpdateProduct = this.handleUpdateProduct.bind(this);
    this.displayInput = this.displayInput.bind(this);
  }

  componentDidMount() {
    axios
      .get(this.state.apiUrl + "users")
      .then(response => this.setState({ users: response.data }));
    axios
      .get(this.state.apiUrl + "users/" + "id")
      .then(response => this.setState({ selectedUser: response.data }));
    axios
      .get(this.state.apiUrl + "products")
      .then(response => this.setState({ products: response.data }));
    axios
      .get(this.state.apiUrl + "lists/" + "id")
      .then(response => this.setState({ selectedList: response.data }));
    axios
      .get(this.state.apiUrl + "users/" + "id/" + "lists")
      .then(response => this.setState({ userList: response.data }));
    axios
      .get(this.state.apiUrl + "lists/" + "id/" + "products")
      .then(response => this.setState({ productList: response.data }));
    //put user
  }

  handleUpdateProduct(id) {
    // show add product form w/ selected product info
    this.setState({ showProductForm: true });
    // above isn't making form show up....why?
    return (
      <div>
        {this.displayInput("name", "Name")}
        <br />
        {this.renderInput("category", "Category")}
        <br />
        {this.renderInput("price", "Price")}
        <br />
        {this.renderInput("rating", "Rating")}
        <br />
        <button onClick={e => this.handleProductFormSubmit()}>
          Submit Update
        </button>
      </div>
    );
  }

  handleDeleteList(id) {
    //this.state.lists.map(list =>
  }

  handleUserFormSubmit() {
    // get user info from state
    // this.state.things
    // or you can do const { items, from, state } = this.state;
    const { first_name, last_name, email } = this.state;

    axios
      .post(this.state.apiUrl + "users/", {
        first_name,
        last_name,
        email
      })
      .then(response => {
        const newUser = { first_name, last_name, email, id: response.data.id };
        console.log("newuser", newUser);
        const users = this.state.users.slice();
        console.log("users", users);
        this.setState({ users: [...users, newUser] });
      });
    return;
  }

  handleProductFormSubmit() {
    const { product_name, category, price, rating } = this.state;

    axios
      .post(this.state.apiUrl + "products/", {
        product_name,
        category,
        price,
        rating
      })
      .then(response => {
        const newProduct = {
          product_name,
          category,
          price,
          rating,
          id: response.data.id
        };
        console.log("newproduct", newProduct);
        const products = this.state.products.slice();
        console.log("products", products);
        this.setState({ products: [...products, newProduct] });
      });
    return;
  }

  handleListFormSubmit() {
    const { list_name, description } = this.state;

    axios
      .post(this.state.apiUrl + "lists/", {
        list_name,
        description
      })
      .then(response => {
        const newList = { list_name, description, id: response.data.id };
        console.log("newlist", newList);
        const lists = this.state.lists.slice();
        console.log("lists", lists);
        this.setState({ lists: [...lists, newList] });
      });
    return;
  }

  renderInput(key, label) {
    return (
      <div>
        <label>{label}: </label>
        <input
          type="text"
          value={this.state[key]}
          onChange={e => this.setState({ [key]: e.target.value })}
        />
      </div>
    );
  }

  displayInput(key, label) {
    console.log(key);
    console.log(label);
    console.log(this.state.selectedProduct[key]);
    return (
      <div>
        <label>{label}: </label>
        <input
          type="text"
          value={this.state.selectedProduct[key]}
          onChange={e => this.setState({ [key]: e.target.value })}
          defaultText={this.state.selectedProduct[key]}
        />
      </div>
    );
  }

  // update to get info from api
  getUser(id) {
    axios
      .get(this.state.apiUrl + "users/" + id)
      .then(response => this.setState({ selectedUser: response.data[0] }));
    // let user = this.state.users.find(user => user.id === id);
    // this.setState({ selectedUser: user });
  }

  getList(id) {
    axios
      .get(this.state.apiUrl + "lists/" + id)
      .then(response => this.setState({ selectedList: response.data[0] }));
    // let list = this.state.lists.find(list => list.id === id);
    // this.setState({ selectedList: list });
  }

  getProduct(id) {
    axios
      .get(this.state.apiUrl + "products/" + id)
      .then(response => this.setState({ selectedProduct: response.data[0] }));
    //
    // let product = this.state.products.find(product => product.id === id);
    // console.log(product);
    // this.setState({ selectedProduct: product });
  }

  render() {
    console.log(this.state.first_name);
    return (
      <Grid className="App">
        <Button
          primary
          flat
          onClick={e => this.setState({ showUserForm: true })}
        >
          add user
        </Button>
        <Button
          raised
          secondary
          onClick={e => this.setState({ showUserForm: false })}
        >
          hide add users
        </Button>
        {this.state.showUserForm ? (
          <div>
            {this.renderInput("first_name", "First Name")}
            <br />
            {this.renderInput("last_name", "Last Name")}
            <br />
            {this.renderInput("email", "Email")}
            <br />
            <button onClick={e => this.handleUserFormSubmit()}>
              Submit user
            </button>
          </div>
        ) : null}
        <Cell size={4}>
          {this.state.users.map(user => (
            <div onClick={() => this.getUser(user.id)}> {user.first_name} </div>
          ))}
        </Cell>
        <div>
          {this.state.selectedUser.last_name} {this.state.selectedUser.email}
        </div>
        <div> add list here + </div>
        <div>
          <button onClick={e => this.setState({ showListForm: true })}>
            add list
          </button>
          <button onClick={e => this.setState({ showListForm: false })}>
            hide add list
          </button>
          {this.state.showListForm ? (
            <div>
              {this.renderInput("name", "List Name")}
              <br />
              {this.renderInput("description", "List Description")}
              <br />
              <button onClick={e => this.handleListFormSubmit()}>
                Submit list
              </button>
            </div>
          ) : null}
        </div>
        <Cell size={4}>
          show list here
          {this.state.lists.map(list => (
            <div onClick={() => this.getList(list.id)}>{list.name}</div>
          ))}
        </Cell>
        <div>{this.state.selectedList.description}</div>
        <div> add product here + </div>
        <div>
          <button onClick={e => this.setState({ showProductForm: true })}>
            add product
          </button>
          <button onClick={e => this.setState({ showProductForm: false })}>
            hide add product
          </button>
          {this.state.showProductForm ? (
            <div>
              {this.renderInput("name", "Name")}
              <br />
              {this.renderInput("category", "Category")}
              <br />
              {this.renderInput("price", "Price")}
              <br />
              {this.renderInput("rating", "Rating")}
              <br />
              <button onClick={e => this.handleProductFormSubmit()}>
                Submit product
              </button>
            </div>
          ) : null}
        </div>
        <div>
          <div>
            {this.displayInput("name", "Name")}
            <br />
            {this.displayInput("category", "Category")}
            <br />
            {this.displayInput("price", "Price")}
            <br />
            {this.displayInput("rating", "Rating")}
            <br />
            <button onClick={e => this.handleProductFormSubmit()}>
              Submit Update
            </button>
          </div>
          {this.state.products.map(product => (
            <div key={shortid()} onClick={() => this.getProduct(product.id)}>
              {product.name}
            </div>
          ))}
        </div>
        <div>
          {this.state.selectedProduct.category}{" "}
          {this.state.selectedProduct.price} {this.state.selectedProduct.rating}
          <br />
        </div>
      </Grid>
    );
  }
}

export default App;
