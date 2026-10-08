# NASA Space Explorer

A responsive Astronomy Picture of the Day website built with HTML, CSS and JavaScript.

## Features

- Today's NASA APOD
- Search APOD by date
- Random historical APOD
- Image and video support
- Responsive design
- Loading and error handling
- Direct link to original media

## Run locally

Open `index.html` in a browser.

If the browser blocks local API requests, run a simple local server:

```bash
python -m http.server 5500
```

Then open:

http://localhost:5500

## API key

The local API key is stored in `config.js`.

Do NOT upload `config.js` to a public GitHub repository. It is already included in `.gitignore`.

For a public deployment, use a backend/serverless function to keep the API key private.
