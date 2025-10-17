var ScientificCalculator = /** @class */ (function () {
    function ScientificCalculator(displayId) {
        this.displayElement = document.getElementById(displayId);
        this.currentExpression = '0';
        this.updateDisplay();
    }
    ScientificCalculator.prototype.updateDisplay = function () {
        this.displayElement.value = this.currentExpression;
    };
    ScientificCalculator.prototype.appendToDisplay = function (value) {
        if (this.currentExpression === '0' && !['.', '+', '-', '*', '/', '^', 'sqrt('].includes(value)) {
            this.currentExpression = value;
        }
        else {
            this.currentExpression += value;
        }
        this.updateDisplay();
    };
    ScientificCalculator.prototype.clearDisplay = function () {
        this.currentExpression = '0';
        this.updateDisplay();
    };
    ScientificCalculator.prototype.calculateResult = function () {
        var _this = this;
        try {
            var expressionToEvaluate_1 = this.currentExpression;
            // Handle square root
            expressionToEvaluate_1 = expressionToEvaluate_1.replace(/sqrt\(([^)]*)\)/g, function (match, p1) {
                var val = parseFloat(p1);
                if (isNaN(val) || val < 0) {
                    throw new Error("Invalid sqrt input");
                }
                return Math.sqrt(val).toString();
            });
            // Handle powers (x^y)
            // Need to parse from right to left for correct associativity (e.g., 2^3^2 = 2^(3^2) = 2^9)
            expressionToEvaluate_1 = this.evaluatePowerExpressions(expressionToEvaluate_1);
            // Use Function constructor for evaluation, but be careful with untrusted input
            // For this simple calculator, it's generally safe with controlled inputs.
            var result = new Function('return ' + expressionToEvaluate_1)();
            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Invalid expression");
            }
            this.currentExpression = result.toString();
        }
        catch (error) {
            this.currentExpression = 'Error';
            console.error('Calculation error:', error);
        }
        this.updateDisplay();
    };
    ScientificCalculator.prototype.evaluatePowerExpressions = function (expression) {
        // Regex to find power expressions (number or parenthesized expression ^ number or parenthesized expression)
        // This is a simplified approach and might not handle all complex cases, e.g., nested powers without parentheses well.
        // For a full-featured parser, a Shunting-yard algorithm or similar would be needed.
        var powerRegex = /(?:(\d+\.?\d*)|(\(.*?\)))(\^)(?:(\d+\.?\d*)|(\(.*?\)))/g;
        // Loop to handle multiple power operations in one pass
        var match;
        while ((match = powerRegex.exec(expression)) !== null) {
            var fullMatch = match[0]; // e.g., '2^3', '(2+1)^4'
            var baseStr = match[1] || match[2]; // Captures number or parenthesized base
            var exponentStr = match[4] || match[5]; // Captures number or parenthesized exponent
            var base = void 0;
            var exponent = void 0;
            try {
                base = new Function('return ' + baseStr)();
                exponent = new Function('return ' + exponentStr)();
            }
            catch (e) {
                throw new Error("Invalid power base or exponent");
            }
            if (isNaN(base) || isNaN(exponent)) {
                throw new Error("Invalid power operation");
            }
            var powerResult = Math.pow(base, exponent);
            expression = expression.replace(fullMatch, powerResult.toString());
            powerRegex.lastIndex = 0; // Reset regex index to re-scan the modified string
        }
        return expression;
    };
    return ScientificCalculator;
}());
// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.calculate = new ScientificCalculator('display');
});
