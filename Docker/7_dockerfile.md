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
