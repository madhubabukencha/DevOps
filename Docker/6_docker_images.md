# Docker Images
Images are self-contained, read-only templates that encapsulate everything needed to run an application.
- **The base layer**: Often minimal distribution like Alphine or full-fledged one like Ubuntu.
- **Runtime Environment**: Specific software like Node.js, Python, etc. required by your application.
- **Libraries and Dependencies**: Any libraries or dependencies your application needs.
- **Application Code**: Your application code and banary files.
- **Configuration Files**: Any configuration files needed to run the application.

> NOTE:
  We can create an image from a container but it is not recommended. We should use Dockerfile to create an image. It will help us to create a consistent and repeatable environment.

## How to create an image?
- Dockerhub: It is a public registry where we can find many images.
- Private Registry: It is a private registry where we can store our images. Eg. Azure Container Registry, Google Container Registry, etc.
- Build from a Dockerfile: It is a Dockerfile that we can use to build an image.
  ```bash
  $ docker build -t <image_name> <path_to_dockerfile>
  ```

## To remove an image
- To remove an image, use the following command:
  ```bash
  $ docker rmi <image_name>
  ```
- To remove all images, use the following command:
  ```bash
  $ docker rmi $(docker images -q)
  ```
- If any image associated with a container, you can remove it using the following command:
  ```bash
  $ docker rmi -f <image_name>
  ```
  (or)
  First stop the container and then remove the image.
  ```bash
  $ docker stop <container_name>
  $ docker rmi <image_name>
  ```

## Container Registry
Container registry is a service that stores and manages container images. Container registries offers following benefits.
- **Collaboration**: Share your images with teammates, clients or the wider community.
- **Versioning**: Track changes to your images and roll back to previous versions if needed.
- **Security**: Private registries provide a secure way to store and manage your sensitive docker images.
- **Automation**: Automate image building and deployment as part of CI/CD pipelines.

## Dockerhub login
Dockerhub login is important if you want to push images to Dockerhub. Here are the steps to login to dockerhub through command line.
- Open https://hub.docker.com/ and create an account.
- Once create an account, get personal access token from "my profile" >  "Edit Profile" > "Personal Access Tokens" > "Create New Token".
- Run the following command to login to dockerhub.
  ```bash
  $ docker login -u <username> -p <personal_access_token>
  ```

## Deeper dive into docker images
-  The docker history (or docker image history) command is a diagnostic tool used to peer
   inside a Docker image to see exactly how it was built. Because Docker images are built
   using a layered file system, every instruction in a Dockerfile (like RUN, COPY, or EXPOSE)
   creates a new layer. This command reveals those layers in the order they were created.
   ```bash
   $ docker history <image_name>
   ```
   
   Example output:
   ```bash
   IMAGE ID       CREATED        CREATED BY                                      SIZE      COMMENT
   1234567890ab   2 weeks ago    /bin/sh -c #(nop)  CMD ["python" "app.py"]      0B
   ```

## Distroless Images
Distroless images are minimal docker images that contains only the necessary runtime dependencies of
applications. Unlike traditional images that include an operating system, shell utilities, and other
binaries, distroless images are stripped down to the absolute minimum. But it harder to work with distroless images as they do not include any shell utilities or other binaries.

**Advantages of Distroless Images**
-  **Enhanced Security**: Distroless images are less vulnerable to security breaches as they do not include any shell utilities or other binaries.
-  **Smaller Size**: Faster image pulls and reduced storage requirements.
- **Improved Performance**: The smaller size and fewer components make distroless images faster to start and run.
