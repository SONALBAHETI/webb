# Scholarnetics

## Description

This project is a Node.js Express server designed to power the Scholarnetics platform.


## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston)
- **Error handling**: centralized error handling mechanism
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- More coming soon...


## Installation

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd <project_directory>`
3. Install dependencies: `npm install`


## Usage

1. Set the necessary environment variables in a `.env` file.
2. Start the server: `npm run dev`
3. Access the APIs at `http://localhost:8000`


## Environment Variables

These environment variables must be set in a .env file in the local root directory.

```bash
# Port number
PORT=8000

# URL of the Mongo DB
MONGODB_URL=<MongoDB connect URL>

# JWT secret key
JWT_SECRET=samplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30
```


## API Endpoints

-  `/api/v1/auth/register`: Sign up a new user with name, email, and password
-  `/api/v1/auth/login/email-password`: Login a user with email and password
- More endpoints coming soon...


## Collaboration

For collaborating on this project, please follow these steps:

1. **Clone the Repository**: Start by cloning the project repository to your local machine. Use the following command in your terminal:
   ```
   git clone <repository_url>
   ```

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies. Use the following command:
   ```
   cd <project_directory>
   npm install
   ```

3. **Create a Branch**: Create a new branch to work on your changes separately. Use a descriptive branch name that reflects the nature of your work such as a feature name. Include JIRA Issue number if applicable. Use the following command:
   ```
   git branch <branch_name>
   ```

4. **Switch to Your Branch**: Switch to the branch you created to start making your changes. Use the following command:
   ```
   git checkout <branch_name>
   ```

5. **Work on Your Changes**: Make the necessary modifications, additions, or bug fixes to the project codebase using your preferred code editor.

6. **Commit Your Changes**: After making your desired changes, commit them to your branch. Review all the new code/file changes before committing. Use the following command:
   ```
   git add .
   git commit -m "Your commit message"
   ```

7. **Push Your Changes**: Push your committed changes to the remote repository. Use the following command:
   ```
   git push origin <branch_name>
   ```

8. **Create a Pull Request**: Go to the GitHub repository page and create a pull request for your branch. Provide a clear description of the changes you made.

9. **Review and Merge**: The person you report to will review your pull request. They may suggest changes or discuss the modifications. After it has been reviewed, they will merge your code into the main branch.

10. **Sync with the Main Branch**: Regularly sync your branch with the main branch to incorporate any new changes. Use the following commands:
    ```
    git checkout main
    git pull origin main
    git checkout <branch_name>
    git merge main
    ```
