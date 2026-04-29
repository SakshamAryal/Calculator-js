const textbox = document.getElementById("display"); //works
const num = document.getElementsByClassName("numbers");
const numeric = Array.from(num);
let currOperation;
numeric.forEach((number) => {
  number.addEventListener("click", () => inputnum(number));
});
function inputnum(number) {
  let newvalue = String(textbox.value);
  newvalue += String(number.textContent);
  textbox.value = Number(newvalue);
}
let operations = document.getElementsByClassName("operation");
const operations = Array.from(operations);
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
  }
}
