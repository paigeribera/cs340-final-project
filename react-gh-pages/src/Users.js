import React, { Component } from "react";
import {
    Grid,
    Cell,
    ExpansionList,
    ExpansionPanel,
    Card,
    SelectField,
    TextField,
    Button,
} from "react-md";
import shortid from "shortid";
import axios from "axios";
class Users extends Component {
    constructor() {
        super();
        this.state = {
            first_name: "test",
            last_name: "test last name",
            email: "",
            searchText: "",
        };
        this.addUser = this.addUser.bind(this);
        this.searchUser = this.searchUser.bind(this);
    }

    addUser() {
        const { first_name, last_name, email } = this.state;
        console.log("adding a user");
        console.log(first_name, last_name, email);
        this.props.onAdd(first_name, last_name, email);
    }
    searchUser() {
        const { searchText } = this.state;
        this.props.onSearch(searchText);
    }
    getUser(user) {
        return (
            <Grid>
                <Cell size={12}>
                    <ExpansionPanel label={user.first_name + " " + user.last_name}>
                        <h2> Lists </h2>
                        {user.lists &&
                            user.lists.map(list => (
                                <Cell key={shortid()} size={12}>
                                    <h4>{list.name || ""} </h4>
                                    <p>{list.description || ""} </p>
                                </Cell>
                            ))}
                        <SelectField
                            id="select-field-1"
                            label="Add List"
                            placeholder="Add list"
                            className="md-cell md-cell--12"
                            onChange={this.props.addList}
                            menuItems={
                                this.props.lists &&
                                this.props.lists.map(list => {
                                    return { value: { user, list }, label: list.name };
                                })
                            }
                        />
                    </ExpansionPanel>
                </Cell>
            </Grid>
        );
    }
    render() {
        const { first_name, last_name, email, searchText } = this.state;

        return (
            <Cell size={12} tablet={6}>
                <Grid>
                    <Cell size={12}>
                        <Card>
                            <h5>Add a New User</h5>
                            <TextField
                                onChange={e => this.setState({ first_name: e })}
                                value={first_name}
                                id="floating-center-title"
                                label="First Name"
                                lineDirection="center"
                                placeholder="Enter first name"
                                className="md-cell md-cell--12"
                            />
                            <TextField
                                value={last_name}
                                onChange={e => this.setState({ last_name: e })}
                                id="floating-center-title"
                                label="Last Name"
                                lineDirection="center"
                                placeholder="Enter last name"
                                className="md-cell md-cell--12"
                            />
                            <TextField
                                value={email}
                                onChange={e => this.setState({ email: e })}
                                id="floating-center-title"
                                label="Email"
                                lineDirection="center"
                                placeholder="Enter email"
                                className="md-cell md-cell--12"
                            />
                            <Button onClick={this.addUser} raised primary swapTheming>
                                Submit User
                            </Button>
                        </Card>
                    </Cell>
                    <Cell size={12}>
                        <h2> Users </h2>

                        <Cell size={8}>
                            <TextField
                                value={searchText}
                                onChange={e => this.setState({ searchText: e })}
                                label="Search User's first name"
                            />
                        </Cell>
                        <Cell size={4}>
                            <Button raised primary onClick={this.searchUser}>
                                Search
                            </Button>
                        </Cell>

                        <ExpansionList>
                            {this.props.users.map(user => this.getUser(user))}
                        </ExpansionList>
                    </Cell>
                </Grid>
            </Cell>
        );
    }
}

export default Users;
