/** @jsx React.DOM */

function Rj() {};

var Util = Util || {};

Util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

Rj.prototype.makeRequest = function(method, url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var resp = JSON.parse(xhr.responseText);
      callback(resp,this);
    }
  }
  xhr.send(null);
};



/** @jsx React.DOM */

var ProductCategoryRow = React.createClass({
    render: function() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
    }
});

var ProductRow = React.createClass({
    render: function() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>
                {this.props.product.name}
            </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
});

var PostFoot=React.createClass({
  render:function(){
    return (<div className="date"><a href="#">2 seconds ago</a></div>);
  }
});

//
var PostDivBody = React.createClass({
  render : function(){
    return (<div className="regular_body"><p>body...</p></div>);
  }
});

var Posth3=React.createClass({
  render:function(){
    return (<h3>HEADDDD<PostDivBody/></h3>);
  }
});


var PostDiv = React.createClass({
  render : function(){
    return (<div className="regular content"><Posth3/></div>);
  }
});

var PostLi = React.createClass({
  render: function(){
    return (<li className="post" id="post_92453599242"><PostDiv/><PostFoot/></li>);
  }
});



var MainUL = React.createClass({
  render: function(){
    return (<ul id="posts"><PostLi/></ul>);
  }
});



var ProductTable = React.createClass({
    render: function() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        }.bind(this));
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var SearchBar = React.createClass({
    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Search..." value={this.props.filterText} />
                <p>
                    <input type="checkbox" value={this.props.inStockOnly} />
                    Only show products in stock
                </p>
            </form>
        );
    }
});

var FilterableProductTable = React.createClass({
    getInitialState: function() {
        return {
            filterText: '',
            inStockOnly: false
        };
    },

    render: function() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
});


var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

React.renderComponent(<MainUL/>, document.body);
