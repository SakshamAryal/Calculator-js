const textbox = document.getElementById("display");
const numeric = Array.from(document.getElementsByClassName("numbers"));
const clean = document.getElementById("reset");
const inverse = document.getElementById("sign");
const operations = Array.from(document.getElementsByClassName("operation"));
const precedence = {"+": 1, "-": 1, "÷": 2, "x": 2};
const decimal = document.getElementById("decimal");
const backspace = document.getElementById("backspace");
const equals = document.getElementById("equals");
const percent = document.getElementById("percentage");
const historyCont = document.querySelector(".history");
percent.addEventListener("click", percentage);
const previousStyle = {
  display: "flex",
  alignItems: "end",
  backgroundColor: "#91C8E4",
  flexDirection: "column",
  height : "70px",
  width : "280px",
  flex: "0 1 auto",
  gap: "10px",
  justifyContent: "space-between",
  border: "1px solid black",
  borderRadius: "20px",
  padding: "10px",
  boxSizing: "border-box",
};
//for each operation in stack, its going to be a tuple where the 
//0th index contains type of button, and 1st index contains textContent 
//of the button
let stack = [];
let inputbuffer = "";

backspace.addEventListener("click", undo);
inverse.addEventListener("click", signChange);
clean.addEventListener("click", clear);
decimal.addEventListener("click", addDecimal);
equals.addEventListener("click", equalsProcess);
numeric.forEach((number) => {
  number.addEventListener("click", () => inputNum(number.textContent));
});

operations.forEach((operation) => {
  operation.addEventListener("click", () => operatorProcess(operation.textContent));
});
// handles input using the buttons
function inputNum(number) {
  const last = stack.pop();
  if (last != null || inputbuffer != ""){
    if (last != null && last[0] == "result"){
      clear();
      changeDisplay(number);
    }
    else if (last != null && (last[0] == "percent" || last[0] == "operation")){
      if(inputbuffer == ""){
        changeDisplay(textbox.value + " " + number);
      }
      stack.push(last);
    }
    else {
      changeDisplay(textbox.value + number);
    };
  }
  else {
    changeDisplay(number);
  };
  inputbuffer += number;
};

// handles the operation and how the calculator reacts for arithmetic processes
function operatorProcess(operator){
  if (!fixInput() && stack.length == 0){
    return;
  }
  const last = stack.pop();
  if (last[0] == "operation"){
    stack.push(["operation", operator]);
    changeDisplay(textbox.value.slice(0, -1) + operator);
  }
  else {
    stack.push(last);
    stack.push(["operation", operator]);
    changeDisplay(textbox.value + " " + operator);
  };

}

function equalsProcess(){
  if (stack.length == 0){
    return;
  };
  if (fixInput() || checkSolve()){
    historyDisplay = textbox.value;
    result = calculate();
    addHistory(historyDisplay, result)
    stack.push(["result", result]);
    changeDisplay(result);
  }
}

function fixInput(){
  if (inputbuffer == ""){
    return false;
  }
  else{
    stack.push(["number", parseFloat(inputbuffer)])
    inputbuffer = ""
    return true
  };
};
function checkSolve(){
  let copy = stack.slice();
  let numcount = 0;
  let operatorcount = 0;
  while (copy.length >= 1){
    last = copy.pop()
    if (last[0] == "operation" || last[0] == "percent"){
      operatorcount += 1
    }
    else {
      numcount += 1
    }
  }
  return (numcount == operatorcount + 1);
}

function addDecimal(){
  if (!inputbuffer.includes(".")){
    inputbuffer += ".";
    if (inputbuffer == "."){
      changeDisplay(textbox.value + " " + inputbuffer)
    }
    else {
      changeDisplay(textbox.value + ".")
    }
  };
}
// precondition: this is a valid stack, all necessary checks done before this part

function calculate(){
  let exprStack = [];
  let numStack = [];
  let last = stack.pop();
  while (last != null){
    if (last[0] == "number" || last[0] == "result"){
      numStack.push(last[1]);
    }
    else if (numStack.length >= 2 & exprStack.length > 0){
      precedenceCheck(numStack, exprStack, last[1]);
    }
    else {
      exprStack.push(last[1]);
    };
    last = stack.pop()
  }
  while (numStack.length != 1 && exprStack.length != 0){
    numStack.push(arithmetic(numStack.pop(), numStack.pop(), exprStack.pop()))
  }
  return numStack.pop()
}
function precedenceCheck(numStack, exprStack, last){
  while(exprStack.length > 0){
    let current = exprStack.pop()
    if (precedence[last] < precedence[current]){
      a = numStack.pop();
      b = numStack.pop();
      numStack.push(arithmetic(a, b, current));
    }
    else {
      exprStack.push(current);
      break;
    }
  }
  exprStack.push(last)
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
  inputbuffer = "";
};

function changeDisplay(text){
  textbox.value = text;
}

function signChange(){
  if (!fixInput() && !checkSolve()){
    return
  }
  let last = stack.pop()
  let display = textbox.value.split(" ");
  if (last[1] > 0){
    display[display.length - 1] = `(-${display[display.length - 1]})`
  }
  else if (last[1] < 0) {
    display[display.length - 1] = display[display.length - 1].replace(/[^0-9]/g, "")
  }
  stack.push([last[0], last[1]*(-1)])
  changeDisplay(display.join(" "))
}

function undo(){
  changeDisplay(textbox.value.slice(0, -1))
  if (inputbuffer != ""){
      inputbuffer = inputbuffer.slice(0, -1);
  }
  else {
    stack.pop();
  }
}

function percentage(){
  const add = [0.01 , "x"]
  if (fixInput()){
    last = stack.pop()
    last[1] /= 100;
    changeDisplay(textbox.value.slice(0, -1) + last[1]);
    stack.push(last);
  }
  else{
    stack.push(['number', 0.01]);
    stack.push(['percent', "x"]);
      changeDisplay(textbox.value + " " + add.join(" "));
  };
}

function addHistory(expression, result){
  const newhistory = document.createElement("div");
  Object.assign(newhistory.style, previousStyle);
  const expressionPara = document.createElement("p");
  expressionPara.textContent = expression;
  const resultPara = document.createElement('p');
  resultPara.textContent = result;
  expressionPara.style.margin = "0";
  resultPara.style.margin = "0";
  newhistory.appendChild(expressionPara);
  newhistory.appendChild(resultPara);
  historyCont.appendChild(newhistory)
}
