FROM nginx:latest

RUN apt-get update
RUN apt-get -y install vim

# Copy the index.html file to the /usr/share/nginx/html directory
COPY index.html /usr/share/nginx/html/index.html
RUN chown nginx:nginx /usr/share/nginx/html/index.html