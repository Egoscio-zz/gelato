## The Gelato vanilla server manager for Minecraft

[![Join the chat at https://gitter.im/Egoscio/gelato](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Egoscio/gelato?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### What's Gelato?
  Gelato is a straightforward server manager written in Node.js and built specifically for vanilla servers. Its modular design allows for separate aspects of the server to run independently.

### What comes out of the box?
  - Votifier (WIP)
  - Complete extendable API
  - ...and more features to come!

### Why Gelato?
  If you're looking for a simple yet complete vanilla server manager without any compromises, you've come to the right place. Gelato was made with simplicity in mind, yet it's powerful enough to be extended for any use case. The sky's the limit!

### Requirements / Compatibility:
  - Node:
    Requires a fairly recent version of io.js or node.js. Tested on Node.JS v7.2.0 (Latest stable version at the time of writing)
  - Minecraft:
    Requires any recent version of Minecraft. Tested on 1.11.

### Installation:
  1. Either clone this repository or [download it as a ZIP](https://github.com/Egoscio/gelato/archive/master.zip).
  2. Run `npm install` inside the repository directory to install dependencies.
  3. Place a copy of `example/start.sh` in your minecraft server directory. Tweak if necessary.
  4. Create a javascript file somewhere in this repository directory modeled after `example/index.js`. Change the string variable named `startPath` to the path to the your `start.sh`.
  5. Execute the file created in Step 4 with `node {path to .js file}`.
  #### NOTE: Gelato starts your Minecraft server for you. Please do *NOT* run Gelato while the server is already running.

### Todo:
  - Create API documentation.
  - Create an NPM module for ease of use.
  - Add more built-in features.
  - Complete Votifier.
  - Do more thorough testing / optimization.
