# Dockerfile
Dockerfile gives you the power to create custom image that perfectly match your requirements.
Below are some advantages from docker file:
- **Reproducibility**: By defining all the steps necessary to build your Docker images, you ensure that the same image can be built consistently across different environments.
- **Automation**: Dockerfiles can be used to automate the build process, making it easier to create and manage images.
- **Transparency and Documentation**: Dockerfiles serve as a clear and concise documentation of the steps required to build your images.

Each and every instruction in a Dockerfile is executed in a new layer. This means that if you have multiple instructions in a Dockerfile, each instruction will create a new layer. 

## Steps to build image from docker file
- Create a Dockerfile in the root directory of your project.
- Write the commands in the Dockerfile.
- Build the image using the following command.
```bash
$ docker build -t <image_name> <path_to_dockerfile/.>
```
-t: flag is used to tag the image.
<image_name>: is the name of the image.
<path_to_dockerfile/.>: is the path to the Dockerfile.