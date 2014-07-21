function g() {
    console.info("derping herps...")
}
g.prototype.a = function() {
  // document.write("xx");
  console.log("j,,,");
};
var k = new g;
setInterval(k.a, 2000);
