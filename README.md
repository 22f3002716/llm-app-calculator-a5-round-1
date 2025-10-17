# Scientific Calculator

This is a simple single-page web application implementing a scientific calculator. The calculator handles basic arithmetic operations (+, -, *, /) along with square root (√) and exponentiation (xʸ).

## Features

*   **Basic Arithmetic:** Addition, subtraction, multiplication, and division.
*   **Scientific Functions:** Square root and exponentiation.
*   **Clear functionality:** 'AC' button to clear the display.
*   **Responsive Design:** Basic styling for usability on different screen sizes.
*   **TypeScript Logic:** The calculator's core logic is written in TypeScript, providing type safety and better maintainability.

## How to Run

To run this calculator, simply follow these steps:

1.  **Save the files:** Save all the provided files (`index.html`, `logic.ts`, `logic.js`, `README.md`, `LICENSE`) into a single directory on your computer.

2.  **Open `index.html`:** Navigate to the directory where you saved the files and open the `index.html` file in your web browser. Most browsers will allow you to do this by double-clicking the file.

    *Alternatively, you can use a local web server (e.g., Live Server VS Code extension, `python3 -m http.server`) to serve the files, which is good practice but not strictly necessary for this simple application.*

3.  **Interact with the calculator:** Use the on-screen buttons to perform calculations. The display will show your input and the result.

## Usage Examples

*   **Addition:** `1 + 2 = 3`
*   **Multiplication:** `5 * 4 = 20`
*   **Square Root:** `sqrt(9) = 3` (Click '√', then '9', then '=')
*   **Exponentiation:** `2 ^ 3 = 8` (Click '2', then 'xʸ', then '3', then '=')
*   **Combined Operations:** `(2 + 3) * 4 = 20` (Note: Parentheses are not explicitly implemented as buttons but can be typed if the input field were editable. The current implementation evaluates left-to-right with operator precedence handled by `new Function()`, but specific button for `(` and `)` are not provided.)

## Development Notes

*   The TypeScript file `logic.ts` is compiled into `logic.js`, which is then included in `index.html`.
*   The `calculateResult` function uses `new Function()` for evaluating expressions. While convenient for this scoped task, be aware of XSS risks if integrating untrusted user input directly in a production environment.
*   The power function evaluator (`evaluatePowerExpressions`) attempts to parse `x^y` constructs. For complex expressions with multiple power operations or nested parentheses around bases/exponents, a more robust parsing algorithm (like Shunting-yard) would be required.

## License

This project is open-source and available under the MIT License. See the `LICENSE` file for more details.
