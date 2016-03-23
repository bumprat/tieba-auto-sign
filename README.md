# ionic-starter
[**Ionic/Cordova**](ionic) is adapted from the auto generated project by official [ionic-cli](ionic-cli) command, ```$ ionic start```. Following modifications are applied:
 * several **new gulp tasks** are added in gulpfile.js to perform js/css assets concatenation and minification.
 * **Bower_components** folder is moved back to project root directory, **src** folder to place source files, **www** folder to place built files.
 * **[wiredep](wiredep), [useref](useref), [uglify](uglify), [minify-css](minify-css)** in one gulp build task, the debug task uses the original assets.

## Prerequisities
1. global dependencies:  
 ```$ npm install -g --save-dev ionic cordova gulp bower```  
2. clone the repositry:  
 ```$ git clone https://github.com/bumprat/ionic-starter.git```
3. local gulp:  
 ```$ npm install gulp```
4. install dependendies:  
```$ bower install && npm install```


## Getting Started
* debug your project  
```$ gulp debug```
* add [platforms](ionic_platforms)  
```$ ionic platform add android```
* test  
```$ ionic serve --lab```

### Building Environment
[node-sass](node-sass) without [Microsoft Visual Studio](MVS):  
1. ```$ npm install node-sass --ignore-scripts```
2. set a new environment viriable **SASS_BINARY_NAME**
3. copy the **node.build** file to your **%SASS_BINARY_NAME%** folder

## Deployment
* release  
```$ gulp build```  
```$ ionic build android```  

note: **android version control** in config.xml
```
  <preference name="android-minSdkVersion" value="16"/>
  <preference name="android-targetSdkVersion" value="17"/>
```
## Authors

* **Bumprat**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

[ionic]: http://ionicframework.com/

