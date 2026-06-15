we have decided to use typescipt 
-> it provides type safety whihc is good and it defines a contract for the user to use any particular function in a particular way whearas javascript allows anything to pass and break the prod 
-> it converts the runtime errors into compile time , it is better to solve the issue in dev rather than breaking in the production 

cons
-> it adds compilation time obviously 


We have decided to use the feature first architecture 
->this type of architecture targets the business rather than the technical implementation that is all the business related to for eg tranaction will be inside the transaction folder itself 


-> we are making the env.ts for managaing the env variables so that if something changes in fur=ture we will not be needing to  change in all the possible files 

-> app,ts assembles the application 
-> server.ts runs the application 

