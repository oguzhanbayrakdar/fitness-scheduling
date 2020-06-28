# fitness-scheduling-mobile-app
A mobile application for fitness/gym centers to schedule their customers' training time.

# How app works?
The app has both side:
  -Business Side:
    Business side is for fitness/gym center owners who wants to see their customers' requested training time.
  -User Side:
    The user side is for fitness/gym center users who want to see the basic occupancy rate of the gym.

# Contents
  Business: 
    -See how many customer at what time is in the fitness/gym center.
    -Confirm/Reject customers' appointment requests.
  
  User:
    -See how many customer at what time is in the fitness/gym center.
    -Make an appointment to the time periods you choose.
    
# Setting Up
  1.Open the Mobile App folder with VSCode.
  2.Open the services folder that situated in src/app folder.
  3.Change the url variable in appointment, scheduling, user services with your backend API.
  4.Open the Web API folder with VSCode or Visual Studio.
  5.If you want dummy data, remove the *DataExchange* comment line in the SeedData.cs folder. 
  6.Open AppSettings.json file and change DefaultConnection with your SQL Connection.
  7.Open PMC(Package Manager Console) and write respectively *add-migration Initial* and *update-database*.
  8.Set your server and run program.
  9.Open a terminal and write 'tns run' and press Enter.
