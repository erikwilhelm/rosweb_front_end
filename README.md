## Configure environment

* Install [nodejs](https://nodejs.org/en/download/)
* Install gulp (open cmd) and

```
npm install -g gulp
```

* Go to a project folder (open cmd) install dependencies

```
npm install
```

## Local development

Use this command to run code locally in a project folder

```
gulp
```

the built code, you can find in the dist folder

## Server updates

Update the server version you can via

* Build a new code version (dist folder)
* Go to the server via putty
* Clear the folder with current code version

```
sudo rm -rf /home/ubuntu/kyburz_autonomy/rosweb-front-end
```

* Copy all files from the dist folder to the /home/ubuntu/kyburz_autonomy/rosweb-front-end on the server via putty

## Note:

## Nginx
The template of your nginx config file you can find in a config/nginx/
You can edit a config file of nginx on the server:

* go to the server via putty

```
sudo nano /etc/nginx/sites-enabled/rosweb
```

## Latest prod code version

You can find latest in a prod folder.
