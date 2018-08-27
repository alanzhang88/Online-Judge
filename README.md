# Online Judge
This web application is similar to an integration of LeetCode and Google Doc where people can edit code and evaluate the code together in real time.

## Front End
The front end of the project uses Angular to create a signle page web app. The following are the details of the front end implementation.

### User
- There are two types of users. One kind is host which needs to register an account at the web app. The other kind is tourist which do not need an account.
- The host can add and edit a question. The tourist needs the invitation code from the host in order to join the session to code together with the host. The invitation code can be found on the home page after the host login.

### Editor
- The editor in the front end uses the Ace Editor. 
- Each user can see the position of other users' caret. This is done through adding a fake caret for each joined user. 
- Uses socketIO to update the content in the editor to each user in real time. Thus, users can see the update immediately if anyone make an edition.
- The users can load and save their code so that they do not need to start over next time

### Evaluator
- The users can submit their code to the evaluator and the running result of the code will be returned back and displayed under the editor.

## Back End
The backend uses NodeJs and Express for the web server. For the code evaluator, it is a simple web server behind a docker container. The web server will receive the code and send back the result. The code will be directly run in the container.

### Web Server
- Create REST API for the front end to save code and evaluate code. 
- Use MongoDB to save the code and question a user has created.
- Use socketIO to receive real time edition from one user and send the edition to the rest of users that are in the same session

### Evaluator
- A simple server using Flask to create a REST API to receive code to evaluate.
- Create a subprocess to run the code and return the running result.
- Using docker container because it can scale horizontally

## Live Deployment
Live deployment on Heroku: https://infinite-brook-22446.herokuapp.com/

Might Take a little long to start up the first time for web server and evaluator due to limitation of Heroku
