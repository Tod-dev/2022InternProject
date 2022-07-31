FROM node:14-alpine
#By default create-react-app sets port to 3000 when you start react app, but I configured to run ui on 8080 (just personal preference) instead of 3000.
EXPOSE 8080 
RUN mkdir -p /app/public /app/src
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
## install only the packages defined in the package-lock.json (faster than the normal npm install)
RUN yarn install
# Run 'npm run dev' when the container starts.
CMD ["yarn", "start"] 