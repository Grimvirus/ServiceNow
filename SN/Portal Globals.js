function globals() { return this; }
function varsList() {
  return Object.getOwnPropertyNames(globals());
}
console.log(varsList()); 
