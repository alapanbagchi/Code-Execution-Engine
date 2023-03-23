# Remote Code Execution Engine

To run this code run docker compose up --build

1. Server contains the api
2. Workers run the code
3. Rabbitmq helps in communication between the server and workers
4. Ubuntu is used in the workers
5. TODO: Strict memory allocation
6. TODO: Strict timeout functionality with proper errors
7. TODO: Add java to ubuntu
8. TODO: Autoscaling workers with kubernetes 
9. TODO: Not important but make sure that theres a size limit for the output file