# Bind Mounts

## What is a Bind Mount?
A **bind mount** is a way to link an exact file or folder from your computer (the host) directly into a Docker container.

In simple terms:
- It creates a direct, two-way bridge between your local computer and the container.
- Any change you make to that folder on your computer immediately shows up inside the container.
- Any change the container makes is saved directly to your computer.

**Below is the example from our demo project:**
- We are going to use `DevOps\Docker\demo-apps\react-app\containerize-react-app\Dockerfile.dev` file to demonstrate this example.
- We bind volumes from local machine to container using `-v`.

    ```bash
    $ docker run -d -p <host_port>:<container_port> -v <directory_on_the_host_machine>:<directory_on_container_filesystem> --name <container_name> <image_name>
    ```
- Now we run demo project with bind volumes. These helps to automatically reflect changes.
    - Build an docker image first
      ```bash
      $ cd D:\DevOps\Docker\demo-apps\react-app\containerize-react-app
      $ docker build -t react-app: dev -f Dockerfile.dev .
    - Now run the image with bind volumes. Webpack/Watchpack polls for file changes by passing `-e WATCHPACK_POLLING=true` especially on windows.
      ```bash
      $ docker run --rm -d -p 3000:3000 -e WATCHPACK_POLLING=true -v ./public:/app/public -v ./src:/app/src react-app:dev
      ```

## Trouble Shooting
- On Windows, Docker runs Linux containers via WSL2 / Hyper-V.
- File system events (inotify) are not propagated across the Windows host to the Linux container filesystem when files are modified on the Windows drive (D:\...).
- Because Create React App (react-scripts 5.0.1 / Webpack) relies on inotify by default to detect file changes, it never gets notified that you saved `App.tsx`.
- Workaround is to set `WATCHPACK_POLLING=true` to force Webpack to poll the file system for changes instead of waiting for events.