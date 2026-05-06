const textbox = document.getElementById("display");
const numeric = Array.from(document.getElementsByClassName("numbers"));
const clean = document.getElementById("reset");
const inverse = document.getElementById("sign");
//for each operation in stack, its going to be a tuple where the 
//0th index contains type of button, and 1st index contains textContent 
//of the button
let stack = [];
inverse.addEventListener("click", signChange);
clean.addEventListener("click", clear);
numeric.forEach((number) => {
  number.addEventListener("click", () => inputNum(number));
});
// handles input using the buttons
function inputNum(number) {
  const last = stack.pop();
  if (last != null){
    if (last[0] == "result"){
    clear();
    };
    stack.push(last);
  };
  changeDisplay(textbox.value + " " + number.textContent);
  stack.push(["number", Number(number.textContent)]);
};
const operations = Array.from(document.getElementsByClassName("operation"));
operations.forEach((operation) => {
  operation.addEventListener("click", () => operatorProcess(operation));
});

// handles the operation and how the calculator reacts for arithmetic processes
function operatorProcess(operation){
  if (stack.length == 0){
    return;
  };
  const last = stack.pop();
  if (last[0] == "operation"){
    stack.push(["operation", operation.textContent]);
    changeDisplay(textbox.value.slice(0, -1) + operation.textContent);
    return;
  }
  else {
    stack.push(last)
  };
  if (checkSolve()){
    let result = exprCalculation();
    if (result != "error") {
      if (operation.textContent != "=") {
        changeDisplay(result + " " + operation.textContent);
      }
      else {
        changeDisplay(result)
      }
      stack.push(["result", result])
    };
  }
  else {
    changeDisplay(textbox.value + " " + operation.textContent);
  };
  if (operation.textContent != "="){
    stack.push(["operation", operation.textContent])
  }
}

function checkSolve(){
  let copy = stack.slice();
  let last = copy.pop();
  while (copy.length != 0){
    if (last[0] == "operation") {
      return true;
    };
    last = copy.pop();
  };
  return false;
}

// precondition: this is a valid stack, all necessary checks done before this part
function exprCalculation(){
  let expression = {}
  setVariable(expression);
  setVariable(expression);
  result =  arithmetic(expression.a, expression.b, expression.operator);
  return result;
}

function setVariable(expression){
  let last = stack.pop();
  let i = 0;
  let num = 0;
  while (last[0] != "operation") {
    if(last[0] == "decimal") {
      num = num/10**i;
    }
    else {
      num = num + last[1]*10**i;
    };
    last = stack.pop();
    if (last == null){
      break;
    }
    i += 1;
  }
  if (Object.keys(expression).length === 0 && 
    expression.constructor === Object) {
      expression.b = num;
      expression.operator = last[1];
    }
  else{
    expression.a = num;
  }
}

//takes care of all the arithmetic process
function arithmetic(a, b, type){
  switch (type){
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "÷":
      if (b == 0){
        clear;
        alert("Cannot divide by zero");
        return "error";
      }
      else{
        return a/b;
      };
    case "x":
      return a*b;
  };
};

function clear(){
  changeDisplay("")
  stack = [];
};

function changeDisplay(text){
  textbox.value = text;
}

function signChange(){
  let copy = [];
  let change = false;
  let display = textbox.value.split(" ");
  if (stack.length != 0){
    last = stack.pop();
    copy.push(last);
    while (last[0] != "arithmetic") {
      if (last[0] == "sign"){
        change = last != null;
        break;
      };
      last = stack.pop();
      copy.push(last);
      if (last == null){
        break;
      }
    }
    if (!change) {
      stack.push(["sign", "-"])
      display[display.length - 1] = `(-${display})`
    }
    else {
      display[display.length - 1].replace("/[^0-9]/g", "")
    };
    while (copy.length != 0){
      stack.push(copy.pop());
    };
    console.log(display.join(" "))
  }
  changeDisplay(display.join(" "))
}
