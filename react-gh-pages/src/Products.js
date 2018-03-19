import React, { Component } from "react";
import {
  Grid,
  Cell,
  ExpansionList,
  ExpansionPanel,
  Card,
  SelectField,
  TextField,
  Button
} from "react-md";
import shortid from "shortid";

class Products extends Component {
  getProduct(product) {
    // let list = [
    //   {
    //     description: "Stuff Haley wants for her birthday on 6/12",
    //     id: 1,
    //     name: ""
    //   }
    // ];
    console.log("product", product);
    //   return (
    //     <Grid>
    //       <Cell size={12}>
    //         <ExpansionPanel label={product.name}>
    //           <h2> Products </h2>
    //           {list.products &&
    //             list.products.map(list => (
    //               <Cell key={shortid()} size={12}>
    //                 <h4>{list.name || ""} </h4>
    //                 <p>{list.description || ""} </p>
    //               </Cell>
    //             ))}
    //           <SelectField
    //             id="select-field-2"
    //             label="Add Product"
    //             placeholder="Add Product"
    //             className="md-cell"
    //             onChange={this.props.addProduct}
    //             menuItems={
    //               this.props.products &&
    //               this.props.products.map(product => {
    //                 return { value: { list, product }, label: product.name };
    //               })
    //             }
    //           />
    //         </ExpansionPanel>
    //       </Cell>
    //     </Grid>
    //   );
  }
  render() {
    return (
      <Cell size={12} tablet={6}>
        <Grid>
          <Cell size={12}>
            <ExpansionList>
              {this.props.lists.map(list => this.getList(list))}
            </ExpansionList>
            <Card>
              <h5>Add a New List</h5>
              <TextField
                id="floating-center-title"
                label="List Name"
                lineDirection="center"
                placeholder="Give the list a name"
                className="md-cell md-cell--bottom"
              />
              <TextField
                id="floating-center-title"
                label="List Description"
                lineDirection="center"
                placeholder="Explain what the list is about"
                className="md-cell md-cell--bottom"
              />
              <Button raised primary swapTheming>
                Submit List
              </Button>
            </Card>
          </Cell>
        </Grid>
      </Cell>
    );
  }
}

export default Products;
