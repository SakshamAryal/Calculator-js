const textbox = document.getElementById("display"); //works
const numeric = Array.from(document.getElementsByClassName("numbers"));
let currOperation;
numeric.forEach((number) => {
  number.addEventListener("click", () => inputnum(number));
});
function inputnum(number) {
  let newvalue = String(textbox.value);
  newvalue += String(number.textContent);
  textbox.value = Number(newvalue);
}
const operations = Array.from(document.getElementsByClassName("operation"));
let a;
operations.forEach((operation) => {
  operation.addEventListener("click", () => arithmetic(operation));
});
function arithmetic(operation) {
  if (currOperation == NaN) {
    a = textbox.value;
    currOperation = operation.textContent;
    return;
  }
  if (currOperation === "x") {
    b = textbox.value
    a = product(a,b)
  }
}
function product(a, b){
  return a*b
}
