interface CalculatorOperations {
    appendToDisplay(value: string): void;
    clearDisplay(): void;
    calculateResult(): void;
}

declare global {
    interface Window {
        calculate: CalculatorOperations;
    }
}

class ScientificCalculator implements CalculatorOperations {
    private displayElement: HTMLInputElement;
    private currentExpression: string;

    constructor(displayId: string) {
        this.displayElement = document.getElementById(displayId) as HTMLInputElement;
        this.currentExpression = '0';
        this.updateDisplay();
    }

    private updateDisplay(): void {
        this.displayElement.value = this.currentExpression;
    }

    public appendToDisplay(value: string): void {
        if (this.currentExpression === '0' && !['.', '+', '-', '*', '/', '^', 'sqrt('].includes(value)) {
            this.currentExpression = value;
        } else {
            this.currentExpression += value;
        }
        this.updateDisplay();
    }

    public clearDisplay(): void {
        this.currentExpression = '0';
        this.updateDisplay();
    }

    public calculateResult(): void {
        try {
            let expressionToEvaluate = this.currentExpression;

            // Handle square root
            expressionToEvaluate = expressionToEvaluate.replace(/sqrt\(([^)]*)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                if (isNaN(val) || val < 0) {
                    throw new Error("Invalid sqrt input");
                }
                return Math.sqrt(val).toString();
            });

            // Handle powers (x^y)
            // Need to parse from right to left for correct associativity (e.g., 2^3^2 = 2^(3^2) = 2^9)
            expressionToEvaluate = this.evaluatePowerExpressions(expressionToEvaluate);

            // Use Function constructor for evaluation, but be careful with untrusted input
            // For this simple calculator, it's generally safe with controlled inputs.
            let result = new Function('return ' + expressionToEvaluate)();

            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Invalid expression");
            }
            this.currentExpression = result.toString();
        } catch (error) {
            this.currentExpression = 'Error';
            console.error('Calculation error:', error);
        }
        this.updateDisplay();
    }

    private evaluatePowerExpressions(expression: string): string {
        // Regex to find power expressions (number or parenthesized expression ^ number or parenthesized expression)
        // This is a simplified approach and might not handle all complex cases, e.g., nested powers without parentheses well.
        // For a full-featured parser, a Shunting-yard algorithm or similar would be needed.
        const powerRegex = /(?:(\d+\.?\d*)|(\(.*?\)))(\^)(?:(\d+\.?\d*)|(\(.*?\)))/g;

        // Loop to handle multiple power operations in one pass
        let match;
        while ((match = powerRegex.exec(expression)) !== null) {
            const fullMatch = match[0]; // e.g., '2^3', '(2+1)^4'
            const baseStr = match[1] || match[2]; // Captures number or parenthesized base
            const exponentStr = match[4] || match[5]; // Captures number or parenthesized exponent

            let base: number;
            let exponent: number;
            try {
                base = new Function('return ' + baseStr)();
                exponent = new Function('return ' + exponentStr)();
            } catch (e) {
                throw new Error("Invalid power base or exponent");
            }
            
            if (isNaN(base) || isNaN(exponent)) {
                throw new Error("Invalid power operation");
            }

            const powerResult = Math.pow(base, exponent);
            expression = expression.replace(fullMatch, powerResult.toString());
            powerRegex.lastIndex = 0; // Reset regex index to re-scan the modified string
        }
        return expression;
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculate = new ScientificCalculator('display');
});
