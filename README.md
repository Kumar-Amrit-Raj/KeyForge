# KeyForge

KeyForge is a privacy-first password generator built with HTML5, CSS3 and vanilla JavaScript.

It creates customizable passwords entirely in the browser and uses the Web Crypto API for secure random values instead of `Math.random()`.

## Live Demo

[View KeyForge Live](https://kumar-amrit-raj.github.io/KeyForge/)

## Features

- Adjustable password length from 8 to 64 characters
- Uppercase, lowercase, number and symbol controls
- Optional removal of ambiguous characters
- Guaranteed inclusion from every selected character set
- Password-strength and estimated-entropy feedback
- One-click clipboard copy with fallback support
- Responsive and accessible interface
- No accounts, backend, tracking or password storage

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Web Crypto API

## Security Approach

KeyForge generates passwords locally in the browser. Passwords are never sent to a server or saved by the app.

Random characters are selected with `crypto.getRandomValues()`, and the generated characters are securely shuffled before the password is displayed.

## Run Locally

No dependencies or build tools are required.

1. Clone the repository.
2. Open `index.html` in a browser.

For the best local experience, you can also run it with VS Code Live Server.

## Project Structure

```text
KeyForge/
├── index.html
├── styles.css
├── script.js
├── favicon.svg
├── .nojekyll
└── README.md
```

## Browser Support

KeyForge is designed for modern browsers with support for the Web Crypto API and Clipboard API.

## Purpose

KeyForge was built as a frontend portfolio project to demonstrate responsive UI design, DOM interaction, browser APIs, validation, accessibility and client-side password generation with vanilla JavaScript.
