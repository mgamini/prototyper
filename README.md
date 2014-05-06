prototyper
==========

#what is it?
prototyper is an angularJS single-page application designed for rapid prototyping of web and mobile apps. Each slide exists in its own .html file in the `slides` folder. Add per-slide routing logic within those html files. 

#get it running
*note: since all app logic is in the front-end, you don't actually have to be running node for this app to work. Drop the `app` folder on any static ftp server, and it'll work. Node is merely included here as a convenience, since angular routing gets a little wonky if it's not on some kind of server.*

##deps
- Node
- NPM
- Bower (if you don't have bower, run `npm install -g bower`)

##install
- clone
- `npm install`
- `bower install`
- `npm start`
- browse to `localhost:3000`

#see it in action
http://static.garrettamini.com/prototyper/