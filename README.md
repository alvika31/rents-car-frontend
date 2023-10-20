# Rents-car-frontend

### How to use the Rent Car Frontend:
1. Clone This Directory
2. inside the base folder open the terminal, then type npm install
3. after completion, in the base folder open the terminal then type npm start
4. then the server will run at http://localhost:3000
5. After the application runs, configure the .env file REACT_APP_API_ENDPOINT to match the url of your backend server.

### How to Book a Car on the System:
1. first register on the registration page http://localhost:3000/register, then enter the data, in the email section please enter an active email because later a token code will be sent to activate your account.
2. After successful registration, enter the login page http://localhost:3000/login, then enter the username and password that was registered earlier.
3. Ordering a car can already be done.

### Implementation of car booking validation by date:
1. Log in first at the url http://localhost:3000/login
2. Book a car that is available on the main page http://localhost:3000/, then it will be directed to the example url: http://localhost:3000/sewa-mobil/daihatsu-xenia.
3. After that, in the Length of Lease section, if the person has booked on the specified date and the person books again on the same date or within the period of time the person booked the car, the car booking fails.

### Account:
1. Admin: http://localhost:3000/login/admin
Username: alvika
Password: alvika123
2. Customer: http://localhost:3000/login
Username: alvika
Password: alvika123

### Note:
1. For car rental data, it has been entered into the sewa table according to the given date case study, to be able to start from scratch, please delete all data in the sewa table first.
2. The application of react query is not applied to some files, because there are some that do not work such as edit profile and your oder menu.
