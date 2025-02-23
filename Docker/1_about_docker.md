* Without docker you might face following problems:
    - Your code might work in your computer, might fail in others computers
    - It works today, might not work tomorrow due to hardward dependencies changes time to time

* Docker is a software that is used for deploying and running containerized applications
* Containers are isolated group of process, each container has it's own file system and has everything to run like a computer. Because of which you no need to
  depend on your host machine software packages.
* Container itself isolated from one another using kernel isolation process
* Actual Virtual Machine architecture looks like: Hardware -> Hypervisor -> Guest OS(kernel) -> FS/Apps/Libs -> Direct Deps -> App Runtime
* Container Architecture looks like: Hardware -> OS (Kernel) -> Docker -> FS/Apps/Libs -> Direct Deps -> App Runtime
* Actual virtual images sizes has larger than docker docker images. Due to which virtual machines take good amound of time to load
* If you are planning to use docker desktop, it uses hypervisor to run light weight linux distribution
