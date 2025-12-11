# Syntax Highlighting Quick Start

## What's New

✨ Enhanced syntax highlighting for JavaScript and Python with real-time code validation.

## Features at a Glance

### JavaScript Highlighting
```javascript
// Keywords are highlighted
const greeting = "Hello";
function greet(name) {
  console.log(`${greeting}, ${name}!`);
}

// Arrow functions
const add = (a, b) => a + b;

// Async/await
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}
```

### Python Highlighting
```python
# Keywords are highlighted
def fibonacci(n):
    """Calculate fibonacci number"""
    if n <= 1:
        return n
    
    # List comprehension
    numbers = [i for i in range(n)]
    
    # F-string
    result = f"Result: {numbers}"
    return result

# Async functions
async def async_task():
    return await some_async_call()
```

## How to Use

### 1. Select Language
- Open the code editor
- Click the language dropdown
- Choose: Python, JavaScript, Java, C++, or C

### 2. Start Coding
- Editor auto-highlights keywords
- Bracket pairs are color-coded
- Suggestions appear as you type

### 3. Validate Code (Optional)
- Click "Validate" button
- See syntax errors with line numbers
- Fix issues and validate again

### 4. Run Code
- Click "Run Code" button
- See output in real-time
- Check execution time

## Syntax Highlighting Colors

### Dark Theme (Default)
| Element | Color |
|---------|-------|
| Keywords | Blue |
| Strings | Orange |
| Comments | Green |
| Numbers | Cyan |
| Functions | Yellow |
| Brackets | Highlighted pairs |

### Light Theme
| Element | Color |
|---------|-------|
| Keywords | Blue |
| Strings | Red |
| Comments | Green |
| Numbers | Blue |
| Functions | Purple |
| Brackets | Highlighted pairs |

## Python Features

### Keywords Highlighted
- Control flow: `if`, `elif`, `else`, `for`, `while`
- Functions: `def`, `class`, `return`, `yield`
- Async: `async`, `await`
- Exceptions: `try`, `except`, `finally`, `raise`
- Operators: `and`, `or`, `not`, `in`, `is`

### Built-in Functions Highlighted
- IO: `print`, `input`, `open`
- Data types: `list`, `dict`, `set`, `tuple`
- Utilities: `len`, `range`, `enumerate`, `zip`, `map`
- Type conversion: `int`, `str`, `float`, `bool`

### Validation Features
✅ Indentation checking
✅ Bracket matching
✅ Unclosed block detection

## JavaScript Features

### Keywords Highlighted
- Variables: `const`, `let`, `var`
- Functions: `function`, `async`, `await`, `yield`
- Control: `if`, `else`, `for`, `while`, `switch`
- Objects: `class`, `extends`, `super`, `this`
- Operators: `typeof`, `instanceof`, `in`, `of`

### Built-in Objects Highlighted
- Core: `Array`, `Object`, `String`, `Number`, `Boolean`
- Functions: `Function`, `Promise`, `Symbol`
- Collections: `Map`, `Set`, `WeakMap`, `WeakSet`
- Utilities: `console`, `Math`, `JSON`, `Date`, `RegExp`

### Validation Features
✅ Bracket/brace matching
✅ Parenthesis validation
✅ String literal handling

## Tips & Tricks

### Quick Shortcuts
- `Ctrl+/` - Toggle comment
- `Ctrl+Shift+K` - Delete line
- `Alt+Up/Down` - Move line
- `Ctrl+H` - Find and replace
- `Ctrl+D` - Select word

### Editor Features
- Minimap hidden (for cleaner view)
- Word wrap enabled (no horizontal scroll)
- Auto-save (Zustand store)
- Line folding for large blocks
- Bracket guides

### Smart Formatting
- Auto-indent on new line
- Format on paste
- Format on type
- Auto-close brackets/quotes

## Troubleshooting

### Highlighting Not Showing?
1. Verify language is set correctly
2. Check code contains recognizable keywords
3. Try switching languages

### Validation Errors Not Appearing?
1. Click the "Validate" button
2. Check the "Validation" tab
3. Look for error details

### Code Not Running?
1. Check syntax (click Validate)
2. Ensure backend is running
3. Check browser console for errors

## Keyboard Shortcuts Reference

| Action | Shortcut |
|--------|----------|
| Comment/Uncomment | Ctrl+/ |
| Delete Line | Ctrl+Shift+K |
| Move Line Up | Alt+Up |
| Move Line Down | Alt+Down |
| Copy Line | Ctrl+C (with no selection) |
| Find | Ctrl+F |
| Replace | Ctrl+H |
| Format | Ctrl+Shift+F |
| Select Word | Ctrl+D |
| Expand Selection | Ctrl+Shift+Right |
| Collapse Selection | Ctrl+Shift+Left |

## Examples

### Python: Function with Docstring
```python
def calculate_average(numbers):
    """
    Calculate the average of a list of numbers.
    
    Args:
        numbers: List of integers or floats
        
    Returns:
        The average as a float
    """
    if not numbers:
        return 0
    
    total = sum(numbers)
    return total / len(numbers)

# Test
data = [1, 2, 3, 4, 5]
result = calculate_average(data)
print(f"Average: {result}")
```

### JavaScript: Async Function with Error Handling
```javascript
// Fetch user data with error handling
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Usage with .then()
getUserData(123)
  .then(user => console.log(user))
  .catch(error => console.error(error));
```

### Java: Class with Methods
```java
public class Calculator {
    
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static int subtract(int a, int b) {
        return a - b;
    }
    
    public static void main(String[] args) {
        int result = add(5, 3);
        System.out.println("Result: " + result);
    }
}
```

## Learning Resources

- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
- [Python Syntax Guide](https://docs.python.org/3/reference/lexical_analysis.html)
- [JavaScript Syntax](https://tc39.es/ecma262/)
- [Online Regex Tester](https://regex101.com/)

## Feedback

Found an issue or have suggestions for improvements?
- Check the [Syntax Highlighting Documentation](./SYNTAX_HIGHLIGHTING.md)
- Review the [Implementation Details](./SYNTAX_HIGHLIGHTING_IMPLEMENTATION.md)
- Submit feedback via the platform

---

**Happy Coding!** 🚀
