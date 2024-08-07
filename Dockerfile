# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=21.6.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

#Add deps
RUN apk add --no-cache python3
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache 7zip
#RUN apk add  --no-cache bento4 

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Make tasks dir
RUN mkdir -p /usr/src/app/tasks/process-mpeg-dash

# Make storage dir
RUN mkdir -p /usr/src/app/storage

#extract zip file
COPY tools/Bento4-Docker.zip /usr/src/app/tools/Bento4-Docker.zip
RUN 7z x /usr/src/app/tools/Bento4-Docker.zip -o/usr/src/app/tools
RUN rm /usr/src/app/tools/Bento4-Docker.zip

#Add variables
ENV PATH=$PATH:/usr/src/app/tools/Bento4-Docker/bin

#Make mp4dash executable

RUN chmod +x -R /usr/src/app/tools/Bento4-Docker/bin

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

## allow node to read write ./dist
RUN chown -R node:node ./dist
RUN chown -R node:node ./tasks/process-mpeg-dash
RUN chown -R node:node ./storage

# Run the application as a non-root user.
USER node
 
# Expose the port that the application listens on.
EXPOSE 3002

# Run the application.
CMD npm run start:prod