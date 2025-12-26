# Dockerfile
Dockerfile gives you the power to create custom image that perfectly match your requirements.
Below are some advantages from docker file:
- **Reproducibility**: By defining all the steps necessary to build your Docker images, you ensure that the same image can be built consistently across different environments.
- **Automation**: Dockerfiles can be used to automate the build process, making it easier to create and manage images.
- **Transparency and Documentation**: Dockerfiles serve as a clear and concise documentation of the steps required to build your images.

> NOTE:
  Each and every instruction in a Dockerfile is executed in a new layer. This means that if you have multiple instructions in a Dockerfile, each instruction will create a new layer. 

## Steps to build image from docker file
- Create a Dockerfile in the root directory of your project.
- Write the commands in the Dockerfile.
- Build the image using the following command.
  ```bash
  $ docker build -t <image_name> <path_to_dockerfile or .>
  ```
  - `-t`: flag is used to tag the image.
  - `<image_name>`: is the name of the image.
  - `<path_to_dockerfile or .>`: is the path to the Dockerfile.

- Let's say you have an image with some tag name and Dockerfile configuration. With this Image you have created a container. Now you have madified the Dockerfile but used the same tag name to build the image. In this case, the new image will be created with the same tag name but the container will not be updated. To update the container, you need to remove the container and create a new container with the new image.


## Difference between CMD and ENTRYPOINT
- CMD is used to provide default command to run when container starts. But,
  - CMD can be overriden at runtime.
    - Create a Dockerfile, let's name it `Dockerfile.cmd`
      ```dockerfile
      FROM alpine
      CMD ["echo", "Hello World"]
      ```
    - Building an image, "." required to tell build command about context:
      ```bash
      $  docker build -t with_cmd:v0.0.1 -f "Dockerfile.cmd" .
      ```
    - Run the image:
      ```bash
      $ docker run with_cmd:v0.0.1
      ```
    - Overriding CMD message at runtime, it will print "Hello Docker" instead of "Hello Madhu":
      ```bash
      $ docker run with_cmd:v0.0.1 echo "Hello Madhu"
      ```
  
- ENTRYPOINT is used to provide default command to run when container starts. But,
  - With ENTRYPOINT, you can't override the command at runtime but it will append the data.
    - Creating a `Dockerfile` and name it `Dockerfile.entrypoint`
      ```dockerfile
      FROM alpine
      ENTRYPOINT ["echo", "Hello World"]
      ```
    - Build docker image:
      ```bash
      $ docker build -t with_entrypoint:v0.0.1 -f Dockerfile.entrypoint .
      ```
    - Run the image:
      ```bash
      $ docker run with_entrypoint:v0.0.1
      ```
    - Instead of overriding it will append the data, you will get output as "Hello World echo Hello Docker":
      ```bash
      $ docker run with_entrypoint:v0.0.1 echo "Hello Docker"
      ```
    - To override the entrypoint, you can use --entrypoint flag:
      ```bash
      $ docker run --entrypoint "echo" with_entrypoint:v0.0.1 "Hello Madhu"
      ```

