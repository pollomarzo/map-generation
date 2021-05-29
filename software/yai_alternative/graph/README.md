# What is this
This is a way to test user's understanding for the explanations given by a (credit approval system)[https://github.com/Francesco-Sovrano/From-Philosophy-to-Interfaces-an-Explanatory-Method-and-a-Tool-Inspired-by-Achinstein-s-Theory-of-E].
The basic interaction revolves around completing a graph built from what the user viewed during the explanation. Its grading capabilities are limited to say the least. It uses, react, react-flow for the graph, and a couple material ui icons.

## How do I use this
The interface isn't quite as clean as I would have liked, so I left a video with some basic usage information.

## How do I use this NOW
It's not really meant to be used on its own, but if you want I left a file called `setup.sh` that curls a couple requests to the server so that you can try it out. You may need to change the port to the one you used.

### Production
In production, the port I chose is 8080. Generate the build files from inside `/graph` with `yarn build`, then run the server from `/graph/server` with `yarn start`.

### Development
In development, backend and frontend will be running on different ports. From `/graph/server`, run `yarn start` to get the backend up and running. Then, from `/graph`, run `yarn start` to get the front-end running. Remember, there won't be anything to see unless you make some requests to the graph. An easy way is to use the `setup.sh` file for some mock requests. 

### The layout of the testing nodes moves!
I know. Sorry, that's how far my front-end development skills took me in the time allotted for this project. 