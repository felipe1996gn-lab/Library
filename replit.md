# Personal Library Project

## Overview
This is a Personal Library project from FreeCodeCamp's Quality Assurance curriculum. It's a full-stack Node.js application that allows users to manage a collection of books with comments.

## Project Architecture
- **Backend**: Express.js server serving both API endpoints and static files
- **Frontend**: HTML/JavaScript client with jQuery for DOM manipulation
- **Database**: None implemented (API endpoints are stubs for now)
- **Testing**: Mocha/Chai setup included for functional testing

## Current Setup for Replit
- Server configured to run on `0.0.0.0:5000` for Replit compatibility
- Workflow configured to run `npm start` 
- Dependencies installed successfully
- CORS enabled for development

## Recent Changes (September 23, 2025)
- Updated server.js to bind to 0.0.0.0:5000 instead of default 3000
- Installed project dependencies via npm
- Configured Replit workflow for the server
- **COMPLETED**: Implemented FreeCodeCamp points 3, 4, and 5
- Fixed API endpoints to work properly with both MongoDB and in-memory storage fallback
- Improved error handling for database operations vs validation errors
- All functional tests passing (11/11)

## API Endpoints (COMPLETED)
- ✅ GET /api/books - Returns array with _id, title, commentcount
- ✅ POST /api/books - Add a new book (returns _id and title)
- ✅ DELETE /api/books - Delete all books
- ✅ GET /api/books/:id - Get specific book with _id, title, comments array
- ✅ POST /api/books/:id - Add comment to book (returns updated book object)
- ✅ DELETE /api/books/:id - Delete specific book

## FreeCodeCamp Verification Status
- Point 3: ✅ GET /api/books returns array with commentcount
- Point 4: ✅ GET /api/books/{id} returns book object with comments array  
- Point 5: ✅ POST /api/books/{id} adds comments successfully
- All error cases working: "no book exists", "missing required field comment"

## Files Structure
- `server.js` - Main server file
- `routes/api.js` - API route definitions (stub implementation)
- `views/index.html` - Frontend HTML
- `public/client.js` - Frontend JavaScript
- `public/style.css` - Styles
- `tests/` - Test files