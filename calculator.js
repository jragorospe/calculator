class Calculator {
	EMPTY_ANSWER = '';
	
	constructor() {
		this.screenAns = document.querySelector(['[previous-operand]']);
		this.screenCur = document.querySelector('[current-operand]');
		this.clearAll();
	}
	
	clearAll() {
		this.currentAnswer = this.EMPTY_ANSWER;
		this.currentText = "";
		this.bracketCount = 0;
		this.lastAnswer = 0;
		this.updateScreen();
	}
	
	updateScreen() {
		this.screenAns.innerText = this.currentAnswer;
		this.screenCur.innerText = this.currentText;
	}
	
	clearEntry() {
		if (this.currentText !== "") {
			this.currentText = this.currentText.toString().slice(0, -1);
			this.updateScreen();
		}
	}
	
	pushNumber(numbers) {
		this.bracketHandler(numbers);
		
		// Check if decimal exists, makes sure maximum # of decimals = 1. 
		if (numbers === "." && this.currentText.includes('.')) return;
		
		this.currentText = this.currentText + "" + numbers;
		this.updateScreen();
	}

	bracketHandler(numbers) {
		// Counts brackets, restrict right bracket input iff bracketCount > 0.
		if (numbers === '(')
			this.bracketCount++;
		if (numbers === ')' && this.bracketCount === 0) return;
		if (numbers === ')')
			this.bracketCount--;
	}
	
	pushOperator(operator) {
		if (this.currentText !== "") {
			// Handles multiple operators being inputed. Max # of consecutive operators = 1.
			let lastChar = this.currentText.charAt(this.currentText.length-1);
			if (lastChar === '/' || lastChar === '*' || lastChar === '-' || lastChar === '+')
				this.clearEntry();
	}
	// If operand input on empty currentText display, currentText = previousAnswer.
    else if (this.lastAnswer !== "") {
      this.currentText = this.lastAnswer;
    }
		// Handles division symbol.
		if (operator == '÷')
			this.pushNumber('/');
		else
			this.pushNumber(operator);
	}
	
	calculate() {
		if (this.currentText !== "") {
			// Handles ')(' which implies multiplication
			this.currentText = this.currentText.split(")(").join(")*(");
			
			// check if we need to incorporate the last answer
			let startChar = this.currentText.charAt(0);
			if (startChar === '/' || startChar === '*' || startChar === '-' || startChar === '+')
				this.currentText = this.lastAnswer + "" + this.currentText;
			
			try {
				let answer = eval(this.currentText);
				this.currentAnswer = this.currentText + " = " + answer;
				this.currentText = "";
				this.lastAnswer = answer;
				this.updateScreen();
			}
			catch (err) {
				this.currentAnswer = "ERROR: " + err.message;
				this.updateScreen();
			}
		}
	}
}

const numbers = document.querySelectorAll('[number]')
const operators = document.querySelectorAll('[operator]')
const equals = document.querySelector('[equals]')
const clearEntry = document.querySelector('[delete]')
const clearAll = document.querySelector('[clear]')

let calculator = new Calculator();

clearEntry.addEventListener('click', () => {
	calculator.clearEntry();
});

clearAll.addEventListener('click', () => {
	calculator.clearAll();
});

equals.addEventListener('click', () => {
	calculator.calculate();
});

numbers.forEach(numbers => {
	numbers.addEventListener('click', () => {
		calculator.pushNumber(numbers.innerText);
	});
});

operators.forEach(operators => {
	operators.addEventListener('click', () => {
		calculator.pushOperator(operators.innerText);
	});
});
