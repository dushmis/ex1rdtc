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
    return (React.DOM.div({className: "date"}, React.DOM.a({href: this.props.url}, this.props.dt)));
  }
});

//







var PostLi = React.createClass({displayName: 'PostLi',
  render: function(){
    var bata=this.props.rowsall;
    if(bata.data.media_embed){
      console.log(bata.data.media);
    }else{
      console.log("0---");
    }
    var mydate=new Date(bata.data.created*1000).toDateString();
    return (
      React.DOM.li({className: "post", id: bata.data.id}, 
        React.DOM.div({className: "regular content"}, 
          React.DOM.h3(null, bata.data.title), 
            React.DOM.div({className: "content regular_body"}, 
              React.DOM.p(null, React.DOM.span(null, bata.data.selftext))
            )
        ), 
        PostFoot({dt: mydate, url: bata.data.url})
      )
    );
  }
});



var MainUL = React.createClass({displayName: 'MainUL',
  
  render: function(){
    console.log(this.props.products);
    var rows = [];
    this.props.products.forEach(function(product) {
      rows.push(PostLi({rowsall: product, key: product.data.created}));
    });
    return (
      React.DOM.ul({id: "posts"}, rows)
    );
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

var rj=new Rj();
rj.makeRequest("GET","http://www.reddit.com/r/pics/.json?limit=50",function(x,y){
  var chil=x.data.children;
  console.log(chil);
  React.renderComponent(MainUL({products: chil}), document.body);
});

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];
