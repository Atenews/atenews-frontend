# Use an official Node.js runtime as the base image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install application dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the application's port (if it's using a custom port, change it)
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
