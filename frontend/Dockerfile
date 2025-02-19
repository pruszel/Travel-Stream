FROM node:20-alpine
WORKDIR /app

# TODO: install npm packages after bind mount is created
# Currently, if npm packages are installed here,
# they will be overwritten by the bind mount configured in docker-compose.yml.
# The following line will install npm packages every time the container is started which is not ideal.
# Another option is to create an entrypoint script that only installs npm packages if they are not already installed.
#ENTRYPOINT ["sh", "-c", "npm ci && exec \"$@\""]

CMD ["npm", "run", "dev", "--", "--host"]

# Vite dev server default port
EXPOSE 5173
