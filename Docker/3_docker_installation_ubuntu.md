# Docker Installation on Ubuntu
I am writing commands directly to install docker engine and docker desktop on Ubuntu machine. These commands might change over the period of time. Refer official docker documention for updated information.

## Docker Engine Installation
**Doc**: https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

Before you install Docker Engine for the first time on a new host machine, you need to set up the Docker apt repository. Afterward, you can install and update Docker from the repository.

1. Set up Docker's apt repository.
   ```bash
   # Add Docker's official GPG key:
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc

   # Add the repository to Apt sources:
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   ```
2. Install the Docker packages.
   ```bash
   $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```
3. Verify that the installation is successful by running the `hello-world` image:
   ```bash
   $ sudo docker run hello-world
   ```
This command downloads a test image and runs it in a container. When the container runs, it prints a confirmation message and exits.

## Manage Docker as a non-root user
**DOC**: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user

The Docker daemon binds to a Unix socket, not a TCP port. By default it's the root user that owns the Unix socket, and other users can only access it using sudo. The Docker daemon always runs as the root user. If you don't want to preface the docker command with sudo, create a Unix group called docker and add users to it.

- Create the docker group
  ```bash
  $ sudo groupadd docker
  ```
- Add your user to the docker group.
  ```bash
  $ sudo usermod -aG docker $USER
  ```
- Log out and log back in so that your group membership is re-evaluated. If you're running Linux in a virtual machine, it may be necessary to restart the virtual machine for changes to take effect. You can also run the following command to activate the changes to groups:
  ```bash
  $ newgrp docker
  ```
- The Docker service starts automatically after installation. To verify that Docker is running, use:
  ```bash
  $ sudo systemctl status docker
  ```
- Some systems may have this behavior disabled and will require a manual start:
  ```bash
  $ sudo systemctl start docker
  ```
- Verify that you can run docker commands without sudo.
  ```bash
  $ docker run hello-world
  ```


## Installing Docker Desktop
**NOTE**: If Kernel-based Virtual Machine(KVM) not available in your system then Docker Desktop wouldn't work. Use below command to `egrep -c '(vcm|svm)' /proc/cpuinfo` check kVM. If it returns zero them your kernel does not support KVM. So, installation of Docker Desktop does not work. 

**To install docker deskop**: https://docs.docker.com/desktop/setup/install/linux/ubuntu/#install-docker-desktop

