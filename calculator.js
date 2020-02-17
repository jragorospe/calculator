class Calculator {
	EMPTY_ANS = '';
	
	constructor() {
		this.screenAns = document.querySelector(['[previous-operand]']);
		this.screenCur = document.querySelector('[current-operand]');
		
		this.clearAll();
	}
	
	clearAll() {
		this.curAns = this.EMPTY_ANS;
		this.curText = "";
		this.bracketCount = 0;
		this.lastAns = 0;
		this.updateScreen();
	}
	
	updateScreen() {
		this.screenAns.innerText = this.curAns;
		this.screenCur.innerText = this.curText;
	}
	
	clearEntry() {
		if (this.curText !== "") {
			this.curText = this.curText.toString().slice(0, -1);
			this.updateScreen();
		}
	}
	
	pushNum(numbers) {
		// handle brackets
		if (numbers === '(')
			this.bracketCount++;
		if (numbers === ')' && this.bracketCount === 0) return;
		if (numbers === ')')
			this.bracketCount--;
		
		// dont add more than one decimal
		if (numbers === "." && this.curText.includes('.'))
			return;
		
		this.curText = this.curText + "" + numbers;
		
		this.updateScreen();
	}
	
	pushOper(oper) {
		if (this.curText !== "") {
			let lastChar = this.curText.charAt(this.curText.length-1);
			if (lastChar === '/' || lastChar === '*' || lastChar === '-' || lastChar === '+')
				this.del();
    }
    else if (this.lastAns !== "") {
      this.curText = this.lastAns;
    }

		if (oper == '÷')
			this.pushNum('/');
		else
			this.pushNum(oper);
	}
	
	calculate() {
		if (this.curText !== "") {
			// close open brackets
			while (this.bracketCount > 0) {
				this.curText = this.curText + ")";
				this.bracketCount--;
			}
			// imply that )( means multiply
			this.curText = this.curText.split(")(").join(")*(");
			
			// check if we need to incorporate the last answer
			let startChar = this.curText.charAt(0);
			if (startChar === '/' || startChar === '*' || startChar === '-' || startChar === '+')
				this.curText = this.lastAns + "" + this.curText;
			
			try {
				let answer = eval(this.curText);
				this.curAns = this.curText + " = " + answer;
				this.curText = "";
				this.lastAns = answer;
				this.updateScreen();
			}
			catch (err) {
				this.curAns = "ERROR: " + err.message;
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
		calculator.pushNum(numbers.innerText);
	});
});

operators.forEach(operators => {
	operators.addEventListener('click', () => {
		calculator.pushOper(operators.innerText);
	});
});