const textbox = document.getElementById("display"); //works
const numeric = Array.from(document.getElementsByClassName("numbers"));
let prevOperation = NaN;
let a, b;
const clean = document.getElementById("reset");
let reset = false, equals = false;
lastAction = NaN;
clean.addEventListener("click", clear);
numeric.forEach((number) => {
  number.addEventListener("click", () => inputnum(number));
});
// handles input using the buttons
function inputnum(number) {
  if (equals){
    clear
  };
  if (reset == true){
    textbox.value = Number(number.textContent);
    reset = false;
    return;
  };
  let newvalue = String(textbox.value);
  newvalue += String(number.textContent);
  textbox.value = Number(newvalue);
  lastAction = 'num';
};
const operations = Array.from(document.getElementsByClassName("operation"));
operations.forEach((operation) => {
  operation.addEventListener("click", () => process(operation));
});
// handles the operation and how the calculator reacts for arithmetic processes
function process(operation) {
  reset = true;
  if (prevOperation !== prevOperation){
    a = Number(textbox.value);
    if (operation.textContent == "="){
      equals = true;
    }
    else{
      prevOperation = operation.textContent;
    }
    return;
  }
  else if (!isNaN(a) & lastAction == 'num'){
      b = Number(textbox.value);
  };
  lastAction = 'arith'
  tempOperation = prevOperation;
  if (operation.textContent == "="){
    solve(operation.textContent);
    equals = true;
  }
  else {
    solve(operation.textContent);
    equals = false;
    prevOperation = operation.textContent;
  };
};
//takes care of all the arithmetic process
function arithmetic(type){
  switch (type){
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "÷":
      if (b == 0){
        clear
        alert("Cannot divide by zero")
      }
      else{
        return a/b;
      };
    case "x":
      return a*b;
  };
};
function solve(type){
  if (equals & type != "="){
    return
  }
  result = arithmetic(prevOperation)
  textbox.value = Number(result);
  a = result;
};
function clear(){
  a = NaN;
  b = NaN;
  prevOperation = NaN;
  equals = false;
  textbox.value = "";
  lastAction = NaN;
};
function update_history(type, result){
  
};
