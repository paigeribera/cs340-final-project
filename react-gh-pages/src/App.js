import React, { Component } from "react";
import shortid from "shortid";
import axios from "axios";
import { Button, Grid, Cell, Card, TextField, DialogContainer, SelectField } from "react-md";

import UpdateProduct from "./UpdateProduct";
import Users from "./Users";
import Lists from "./Lists";
import Products from "./Products";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersLoading: true,
            listsLoading: true,
            productsLoading: true,
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
            name: "",
            category: "",
            price: "",
            rating: "",
            showUserForm: false,
            showProductForm: false,
            showListForm: false,
            error: false,
            errorMsg: "",
            apiUrl: "https://calm-ridge-35445.herokuapp.com/",
            selectedUser: { first_name: "", last_name: "", email: "", list: [] },
            selectedList: { name: "", description: "", products: [] },
            selectedProduct: { name: "", category: "", price: "", rating: "" },
        };

        this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
        this.handleListFormSubmit = this.handleListFormSubmit.bind(this);

        this.handleProductFormSubmit = this.handleProductFormSubmit.bind(this);
        this.getUserList = this.getUserList.bind(this);
        this.addListToUser = this.addListToUser.bind(this);
        this.addProductToList = this.addProductToList.bind(this);
        this.addUser = this.addUser.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProductFromList = this.deleteProductFromList.bind(this);
        this.searchUsername = this.searchUsername.bind(this);
    }

    componentDidMount() {
        axios.get(this.state.apiUrl + "users").then(response => {
            const users = response.data;
            for (let user of users) {
                axios.get(this.state.apiUrl + "users/" + user.id + "/lists").then(results => {
                    let newUsers = this.state.users.slice();

                    const newUser = {
                        ...user,
                        lists: results.data || [{ id: -1, name: "Add a list!", description: "" }],
                    };
                    newUsers.push(newUser);
                    this.setState({ users: newUsers, usersLoading: false });
                });
            }
        });
        axios.get(this.state.apiUrl + "products").then(response => {
            this.setState({ products: response.data, productsLoading: false });
        });
        axios.get(this.state.apiUrl + "lists").then(response => {
            const lists = response.data;
            for (let list of lists) {
                axios.get(this.state.apiUrl + "lists/" + list.id + "/products").then(results => {
                    let newLists = this.state.lists.slice();

                    const newList = {
                        ...list,
                        products: results.data || [
                            {
                                id: "",
                                name: "",
                                category: "",
                                price: "",
                                rating: "",
                            },
                        ],
                    };
                    newLists.push(newList);
                    this.setState({ lists: newLists, listsLoading: false });
                });
            }
        });
    }

    deleteProductFromList(listId, productId) {
        axios
            .delete(this.state.apiUrl + "lists/" + listId + "/products/" + productId)
            .then(results => {
                const lists = this.state.lists.slice();
                const ourList = lists.find(list => list.id === listId);
                const ourProducts = ourList.products.slice();
                const updatedLists = lists.map(list => {
                    if (list.id === listId) {
                        const newList = {
                            ...list,
                            products: ourProducts.filter(product => product.id !== productId),
                        };
                        return newList;
                    }
                    return {
                        ...list,
                    };
                });
                this.setState({ lists: updatedLists });
            });
    }

    getUserList(user) {
        let data = {};
        axios.get(this.state.apiUrl + "users/" + user.id + "/lists").then(res => {
            const updatedUser = { ...user, list: res.data };
            console.log("udpated user", updatedUser);
            this.setState({ selectedUser: updatedUser });
        });
        return data;
    }

    handleUserFormSubmit(first_name, last_name, email) {
        axios
            .post(this.state.apiUrl + "users/", {
                first_name,
                last_name,
                email,
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
        const { name, category, price, rating } = this.state;
        axios
            .post(this.state.apiUrl + "products/", {
                name,
                category,
                price,
                rating,
            })
            .then(response => {
                const newProduct = {
                    name,
                    category,
                    price,
                    rating,
                    id: response.data.id,
                };
                console.log("newproduct", newProduct);
                const products = this.state.products.slice();
                console.log("products", products);
                this.setState({ products: [...products, newProduct] });
            });
        return;
    }

    handleListFormSubmit(name, description) {
        axios
            .post(this.state.apiUrl + "lists/", {
                name,
                description,
            })
            .then(response => {
                const newList = { name, description, id: response.data.id };
                console.log("newlist", newList);
                const lists = this.state.lists.slice();
                console.log("lists", lists);
                this.setState({ lists: [...lists, newList] });
            });
        return;
    }
    // update to get info from api
    getUser(id) {
        axios
            .get(this.state.apiUrl + "users/" + id)
            .then(response => this.setState({ selectedUser: response.data[0] }));
    }

    getList(id) {
        axios
            .get(this.state.apiUrl + "lists/" + id)
            .then(response => this.setState({ selectedList: response.data[0] }));
    }

    getProduct(id) {
        axios
            .get(this.state.apiUrl + "products/" + id)
            .then(response => this.setState({ selectedProduct: response.data[0] }));
    }

    addListToUser(value) {
        // updates local state
        if (
            this.state.users
                .find(user => user.id === value.user.id)
                .lists.find(list => list.id === value.list.id)
        ) {
            console.log("already contained");
            this.setState({ error: true, errorMsg: "user already has this list" });
        }
        axios
            .post(this.state.apiUrl + "users/" + value.user.id + "/lists/" + value.list.id)
            .then(res => {
                const users = this.state.users.slice();
                for (const user of users) {
                    if (user.id === value.user.id) {
                        user.lists = [...user.lists, value.list];
                    }
                }
                this.setState({ users });
            });
    }

    addProductToList(value) {
        console.log("args", value.list, value.product);
        if (
            this.state.lists
                .find(list => list.id === value.list.id)
                .products.find(product => product.id === value.product.id)
        ) {
            this.setState({
                error: true,
                errorMsg: "Error user already has this product on this list",
            });
            return;
        }
        axios
            .post(
                this.state.apiUrl + "lists/" + value.list.id + "/" + "products/" + value.product.id,
            )
            .then(res => {
                //updates local setState
                const lists = this.state.lists.slice();
                for (const list of lists) {
                    if (list.id === value.list.id) {
                        list.products = [...list.products, value.product];
                    }
                }
                this.setState({ lists });
            });
    }
    addUser(first_name, last_name, email) {
        axios.post(this.state.apiUrl + "/users").then(results => {
            const users = this.state.users.slice();
            users.push(results.data);
            this.setState({ users });
        });
    }
    searchUsername(first_name) {
        axios.get(this.state.apiUrl + "users" + "?first_name=" + first_name).then(response => {
            const users = response.data.slice();
            this.setState({ users: [] });
            for (let user of users) {
                axios.get(this.state.apiUrl + "users/" + user.id + "/lists").then(results => {
                    let newUsers = this.state.users.slice();
                    const newUser = {
                        ...user,
                        lists: results.data || [{ id: -1, name: "Add a list!", description: "" }],
                    };
                    newUsers.push(newUser);
                    this.setState({ users: newUsers, usersLoading: false });
                });
            }
        });
    }
    updateProduct() {
        const { selectedProduct } = this.state;
        axios
            .put(this.state.apiUrl + "/products/" + selectedProduct.id, { ...selectedProduct })
            .then(results => {
                const products = this.state.products.slice();
                const myProduct = products.findIndex(product => product.id === selectedProduct.id);
                const newProducts = [];
                for (let product of products) {
                    if (product.id === selectedProduct.id) {
                        newProducts.push({ ...selectedProduct });
                    } else {
                        newProducts.push(product);
                    }
                }
                const lists = this.state.lists.slice();
                const updatedList = [];
                for (let list of lists) {
                    const listProduct = list.products.find(p => p.id === selectedProduct.id);
                    if (listProduct) {
                        const updatedProducts = list.products.filter(
                            p => p.id !== selectedProduct.id,
                        );

                        updatedProducts.push(selectedProduct);

                        const newList = { ...list, products: updatedProducts };

                        updatedList.push(newList);
                    } else {
                        updatedList.push(list);
                    }
                }
                this.setState({
                    products: newProducts,
                    lists: updatedList,
                    selectedProduct: { name: "", category: "", price: "", rating: "" },
                });
            });
    }
    render() {
        const {
            usersLoading,
            listsLoading,
            productsLoading,
            name,
            price,
            category,
            rating,
            selectedProduct,
        } = this.state;
        if (usersLoading || listsLoading || productsLoading) {
            return <span>loading</span>;
        }
        return (
            <Grid className="App">
                <Cell size={4}>
                    <Users
                        users={this.state.users}
                        onAdd={this.handleUserFormSubmit}
                        lists={this.state.lists}
                        addList={this.addListToUser}
                        onSearch={this.searchUsername}
                    />
                </Cell>
                <Cell size={4}>
                    <Lists
                        onAdd={this.handleListFormSubmit}
                        lists={this.state.lists}
                        products={this.state.products}
                        addProduct={this.addProductToList}
                        deleteProduct={this.deleteProductFromList}
                    />
                </Cell>
                <Cell size={4}>
                    <Card>
                        <h5>Add a New Product</h5>
                        <TextField
                            onChange={e => this.setState({ name: e })}
                            value={name}
                            id="floating-center-title"
                            label=" Name"
                            lineDirection="center"
                            placeholder="Enter first name"
                            className="md-cell md-cell--12"
                        />
                        <TextField
                            value={category}
                            onChange={e => this.setState({ category: e })}
                            id="floating-center-title"
                            label="Category"
                            lineDirection="center"
                            placeholder="Enter category"
                            className="md-cell md-cell--12"
                        />
                        <TextField
                            value={price}
                            onChange={e => this.setState({ price: e })}
                            id="floating-center-title"
                            label="Price"
                            lineDirection="center"
                            placeholder="Enter price"
                            className="md-cell md-cell--12"
                        />
                        <TextField
                            value={rating}
                            onChange={e => this.setState({ rating: e })}
                            id="floating-center-title"
                            label="Rating"
                            lineDirection="center"
                            placeholder="Enter rating"
                            className="md-cell md-cell--12"
                        />
                        <Button onClick={this.handleProductFormSubmit} raised primary swapTheming>
                            Submit Product
                        </Button>
                    </Card>
                    <Card>
                        <h5>Update Product</h5>
                        <SelectField
                            id="select-field-2"
                            label="Select Product"
                            placeholder="Select Product"
                            className="md-cell md-cell--12"
                            onChange={val => this.setState({ selectedProduct: val })}
                            menuItems={
                                this.state.products &&
                                this.state.products.map(product => {
                                    return {
                                        value: product,
                                        label: product.name,
                                    };
                                })
                            }
                        />
                        <TextField
                            onChange={e =>
                                this.setState({
                                    selectedProduct: {
                                        ...this.state.selectedProduct,
                                        name: e,
                                    },
                                })
                            }
                            value={selectedProduct.name}
                            id="floating-center-title"
                            label=" Name"
                            lineDirection="center"
                            placeholder="Enter first name"
                            className="md-cell md-cell--12"
                        />
                        <TextField
                            value={selectedProduct.category}
                            onChange={e =>
                                this.setState({
                                    selectedProduct: {
                                        ...this.state.selectedProduct,
                                        category: e,
                                    },
                                })
                            }
                            id="floating-center-title"
                            label="Category"
                            lineDirection="center"
                            placeholder="Enter category"
                            className="md-cell md-cell--12"
                        />
                        <TextField
                            value={selectedProduct.price}
                            onChange={e =>
                                this.setState({
                                    selectedProduct: {
                                        ...this.state.selectedProduct,
                                        price: e,
                                    },
                                })
                            }
                            id="floating-center-title"
                            label="Price"
                            lineDirection="center"
                            placeholder="Enter price"
                            className="md-cell md-cell--12"
                        />
                        <TextField
                            value={selectedProduct.rating}
                            onChange={e =>
                                this.setState({
                                    selectedProduct: {
                                        ...this.state.selectedProduct,
                                        rating: e,
                                    },
                                })
                            }
                            id="floating-center-title"
                            label="Rating"
                            lineDirection="center"
                            placeholder="Enter rating"
                            className="md-cell md-cell--12"
                        />
                        <Button onClick={this.updateProduct} raised primary swapTheming>
                            Update Product
                        </Button>
                    </Card>
                </Cell>
                <DialogContainer
                    focusOnMount={false}
                    onHide={() => this.setState({ error: false, errorMsg: "" })}
                    visible={this.state.error}
                >
                    {this.state.errorMsg}
                </DialogContainer>
            </Grid>
        );
    }
}

export default App;
