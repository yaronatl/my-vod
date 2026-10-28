# My Vod

A small movie browser built with React. You can search movies by title, browse the results and open a page with the details of a movie (poster, runtime, rating, genre, actors, plot). The data comes from the OMDb API.

## Tech
- React (create-react-app), React Router
- axios for the API calls
- Bootstrap 5 (CDN) plus some custom CSS

## Run it
```
npm install
npm start
npm run build
```
The app opens on http://localhost:3000. OMDb keys can be overridden with a `.env` file, see `.env.example`.

## Routes
- `/` list of movies, search with `/?s=batman` (default search is "black")
- `/info/:id` details of one movie (the OMDb imdbID)
- anything else shows a 404 page

Deployed on Netlify: https://unique-entremet-c0dc50.netlify.app/
