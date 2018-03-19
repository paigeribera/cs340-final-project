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
    FontIcon,
} from "react-md";
import shortid from "shortid";

class Lists extends Component {
    constructor() {
        super();
        this.state = {
            name: "test",
            description: "test description name",
        };
        this.addToList = this.addToList.bind(this);
    }
    addToList() {
        const { name, description } = this.state;
        this.props.onAdd(name, description);
    }
    getList(list) {
        return (
            <Grid>
                <Cell size={12}>
                    <ExpansionPanel label={list.name}>
                        <div className="md-title"> Products </div>
                        <caption>{list.description || ""}</caption>

                        {list.products &&
                            list.products.map(productOnList => (
                                <Cell key={shortid()} size={12}>
                                    <h4>
                                        {productOnList.name || ""}
                                        {productOnList.name ? (
                                            <span
                                                onClick={() =>
                                                    this.props.deleteProduct(
                                                        list.id,
                                                        productOnList.id,
                                                    )
                                                }
                                            >
                                                <FontIcon>close</FontIcon>
                                            </span>
                                        ) : null}
                                    </h4>
                                </Cell>
                            ))}
                        <SelectField
                            id="select-field-2"
                            label="Add Product"
                            placeholder="Add Product"
                            className="md-cell md-cell--12"
                            onChange={this.props.addProduct}
                            menuItems={
                                this.props.products &&
                                this.props.products.map(product => {
                                    return {
                                        value: { list, product },
                                        label: product.name,
                                    };
                                })
                            }
                        />
                    </ExpansionPanel>
                </Cell>
            </Grid>
        );
    }
    render() {
        const { name, description } = this.state;
        return (
            <Cell size={12} tablet={6}>
                <Grid>
                    <Cell size={12}>
                        <Card>
                            <h5>Add a New List</h5>
                            <TextField
                                onChange={e => this.setState({ name: e })}
                                value={name}
                                id="floating-center-title"
                                label=" Name"
                                lineDirection="center"
                                placeholder="Enter name"
                                className="md-cell md-cell--12"
                            />
                            <TextField
                                value={description}
                                onChange={e => this.setState({ description: e })}
                                id="floating-center-title"
                                label="Description"
                                lineDirection="center"
                                placeholder="Enter description"
                                className="md-cell md-cell--12"
                            />

                            <Button onClick={this.addToList} raised primary swapTheming>
                                Submit list
                            </Button>
                        </Card>
                    </Cell>
                    <Cell size={12}>
                        <ExpansionList>
                            <h2> Lists </h2>
                            {this.props.lists.map(list => this.getList(list))}
                        </ExpansionList>
                    </Cell>
                </Grid>
            </Cell>
        );
    }
}

export default Lists;
