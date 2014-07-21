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

var ProductCategoryRow = React.createClass({displayName: 'ProductCategoryRow',
    render: function() {
        return (React.DOM.tr(null, React.DOM.th({colSpan: "2"}, this.props.category)));
    }
});

var ProductRow = React.createClass({displayName: 'ProductRow',
    render: function() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            React.DOM.span({style: {color: 'red'}}, 
                this.props.product.name
            );
        return (
            React.DOM.tr(null, 
                React.DOM.td(null, name), 
                React.DOM.td(null, this.props.product.price)
            )
        );
    }
});

var PostFoot=React.createClass({displayName: 'PostFoot',
  render:function(){
    return (React.DOM.div({className: "date"}, React.DOM.a({href: "#"}, "2 seconds ago")));
  }
});

//
var PostDivBody = React.createClass({displayName: 'PostDivBody',
  render : function(){
    return (React.DOM.div({className: "regular_body"}, React.DOM.p(null, "body...")));
  }
});

var Posth3=React.createClass({displayName: 'Posth3',
  render:function(){
    return (React.DOM.h3(null, "HEADDDD", PostDivBody(null)));
  }
});


var PostDiv = React.createClass({displayName: 'PostDiv',
  render : function(){
    return (React.DOM.div({className: "regular content"}, Posth3(null)));
  }
});

var PostLi = React.createClass({displayName: 'PostLi',
  render: function(){
    return (React.DOM.li({className: "post", id: "post_92453599242"}, PostDiv(null), PostFoot(null)));
  }
});



var MainUL = React.createClass({displayName: 'MainUL',
  render: function(){
    return (React.DOM.ul({id: "posts"}, PostLi(null)));
  }
});



var ProductTable = React.createClass({displayName: 'ProductTable',
    render: function() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(ProductCategoryRow({category: product.category, key: product.category}));
            }
            rows.push(ProductRow({product: product, key: product.name}));
            lastCategory = product.category;
        }.bind(this));
        return (
            React.DOM.table(null, 
                React.DOM.thead(null, 
                    React.DOM.tr(null, 
                        React.DOM.th(null, "Name"), 
                        React.DOM.th(null, "Price")
                    )
                ), 
                React.DOM.tbody(null, rows)
            )
        );
    }
});

var SearchBar = React.createClass({displayName: 'SearchBar',
    render: function() {
        return (
            React.DOM.form({onSubmit: this.handleSubmit}, 
                React.DOM.input({type: "text", placeholder: "Search...", value: this.props.filterText}), 
                React.DOM.p(null, 
                    React.DOM.input({type: "checkbox", value: this.props.inStockOnly}), 
                    "Only show products in stock"
                )
            )
        );
    }
});

var FilterableProductTable = React.createClass({displayName: 'FilterableProductTable',
    getInitialState: function() {
        return {
            filterText: '',
            inStockOnly: false
        };
    },

    render: function() {
        return (
            React.DOM.div(null, 
                SearchBar({
                    filterText: this.state.filterText, 
                    inStockOnly: this.state.inStockOnly}
                ), 
                ProductTable({
                    products: this.props.products, 
                    filterText: this.state.filterText, 
                    inStockOnly: this.state.inStockOnly}
                )
            )
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

React.renderComponent(MainUL(null), document.body);
