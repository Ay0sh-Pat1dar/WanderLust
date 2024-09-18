# WanderLust 

WanderLust is a full-stack web application that allows users to view hotels. The application provides features for users to view and review hotel listings. 
It is built using HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Users can register and log in using Passport.js for local authentication.
- **User Authorization**: Certain actions, like deleting, edit listings or leaving reviews, require users to be logged in. Unauthorized access to these actions is restricted.
- **Hotel Listings**: Users can view various hotel listings, with details such as pricing, location, and availability.
- **Reviews**: Users can leave reviews on hotel listings.
- **Flash Messages**: Users receive feedback messages for actions like booking, reviews, and errors.
- **Session Management**: User sessions are managed using `express-session` and stored in MongoDB using `connect-mongo`.
- **MVC**: Models, Views, Controllers.
- **Deployed on Render**

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript, EJS (Embedded JavaScript templates)
- **Database**: MongoDB(Atlas for listings, reviews and user's data), Cloudinary(for listing's images)
- **Authentication**: Passport.js (Local Strategy)
- **Session Storage**: `express-session`, `connect-mongo`
- **Environment Variables**: `dotenv` for managing sensitive data like database URLs and secrets.

## Usage
Homepage: View all available hotel listings.
User Authentication: Register or log in.
View a Hotel: Select a hotel from the list.
Review a Hotel: Leave a review for a booked hotel.
See Exact Location of hotel.
