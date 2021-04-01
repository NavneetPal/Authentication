const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const apis = fs.readdirSync(path.join(__dirname, '..', 'api'), { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name);
let allRoutes = [];

for (let api of apis) {
	if (fs.existsSync(path.join(__dirname,`../api/${api}/routes.json`))){
		const routes = require(`../api/${api}/routes`);
		//if routes.json file contains an array
		if (routes.length) {
			for (let route of routes) {
				let singleRoute = {};

				//checking wheteher all the fields (exist or not)
				if (!route.method || !route.action) {
					console.log(
						chalk.black.bgYellowBright('WARN:') +
							`Some attributes are missing(method,path,action) of ${api} routes.json file `
					);
					continue;
				}

				//First we are checking that '/ is there in the path specified in routes.json'
				//Then we store it in singleRoutePath
                /********* path assignemnet here ****************/
                if(route.pathFromRoot){
                    let path = route.path[0] === '/' ? route.path : `/${route.path}`;
                    singleRoute.path = `/${api}${path}`;   
                }else{
                    singleRoute.path = route.path[0] === '/' ? route.path : `/${route.path}`;
                }
				/************** Method assignment here*****************/
                singleRoute.method = route.method;


				//We will check whether the action is in "file.method" format if not warning will be displayed
				let controllerArray = route.action.split('.');
				if (controllerArray.length != 2) {
					console.log(
						chalk.black.bgYellowBright('WARN:') +
							`The action is not properly defined of the ${api} routes.json file of path` +
							chalk.green(`'${singleRoute.path}'`)
					);
					continue;
				}

				let [ controllerName, functionName ] = controllerArray;
				let func = require(`../api/${api}/controller/${controllerName}`)[functionName];
				//Checking whether the function exist in the controller or not if exist add otherwise throw a warning message
                /************* ACTION METHOD ASSIGNMENT HERE************/
				if (func) {
					singleRoute.action = func;
				} else {
					console.log(
						chalk.black.bgYellowBright('WARN:') +
							`Function '${functionName}' doesn't exist in ${api} controller of ${controllerName}.js file`
					);
					continue;
				}

		    /********************************* Middleware Assignment here****************************/		
                let middle=[];
                let totalMiddleware=0;
                if(route.globalMiddlewares){
                    totalMiddleware+=route.globalMiddlewares.length;
                    let middlewares=route.globalMiddlewares;
                    for(let middleware of middlewares){
                        let middleArray=middleware.split('.');
                        if(middleArray.length!=2){
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `The global middleware is not properly defined of the ${api} routes.json file of path: '${route.path} hence the routes will not be added coorect it to add it'`
                            );
                            break;
                        }
                        let [fileName,middlewareFunction]=middleArray;
                        let func=require(`../Middleware/${fileName}`)[middlewareFunction];
                        if(func){
                            middle.push(func);
                        }else{
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `Middleware '${middlewareFunction}' doesn't exist in globalMiddleware of ${fileName}.js file`
                            );
                            break;
                        }
                    }
                }
				//Checking first if middlewares exist for that route or not if exist we gonna add it otherwise we will not add it
				if (route.middlewares) {
                    totalMiddleware+=route.middlewares.length;
					//if middleware exidt then only we will add it otherwise we will not add it
					let middlewares = route.middlewares;
					for (let middleware of middlewares) {
						let middlewareArray = middleware.split('.');
                        if (middlewareArray.length != 2) {
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `The middleware is not properly defined of the ${api} routes.json file of path: '${route.path}'`
                            );
                            break;
                        }
						let [ fileName, middlewareName ] = middlewareArray;
						let middleName=require(`../api/${api}/middleware/${fileName}`)[middlewareName];
                        if(middleName){
                            middle.push(middleName);
                        }else{
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `Middleware '${middlewareName}' doesn't exist in ${api} middleware of ${fileName}.js file`
                            );
                            break;
                        }
					}
				}

                if(route.globalMiddlewares || route.middleware){
                    if(middle.length===totalMiddleware){
                        singleRoute.middlewares = middle;
                    }else{
                        continue;
                    }
                }else{
                    singleRoute.middlewares=middle;
                }

				//Adding a single routes to allRoutes array
				allRoutes.push(singleRoute);
			}
		} 
        //if routes.json contains a single object
        else {
				let singleRoute = {};

				//checking wheteher all the fields (exist or not)
				if (!routes.method || !routes.action ) {
					console.log(
						chalk.black.bgYellowBright('WARN:') +
							`Some attributes are missing(method,action) of ${api} routes.json file `
					);
					continue;
				}
				//First we are checking that '/ is there in the path specified in routes.json'
				//Then we store it in singleRoutePath
                /****************Assignment of path here (like '/path')***********/
                if(routes.pathFromRoot){
                    let path = routes.path[0] === '/' ? routes.path : `/${routes.path}`;
                    singleRoute.path = `/${api}${path}`;
                }else{
                    singleRoute.path = routes.path[0] === '/' ? routes.path : `/${routes.path}`;
                }
				
                /**************Assignmnet of method here(get,post,put,delete) */
                singleRoute.method = routes.method;

               
				//We will check whether the action is in "file.method" format if not warning will be displayed
				let controllerArray = routes.action.split('.');
				if (controllerArray.length != 2) {
					console.log(
						chalk.black.bgYellowBright('WARN:') +
							`The action is not properly defined of the ${api} routes.json file of path` +
							chalk.green(`'${singleRoute.path}'`)
					);
					continue;
				}

                /************************Assignment of action here*******************************/
				let [ controllerName, functionName ] = controllerArray;
				let func = require(`../api/${api}/controller/${controllerName}`)[functionName];
				//Checking whether the function exist in the controller or not if exist add otherwise throw a warning message
				if (func) {
					singleRoute.action = func;
				} else {
					console.log(
						chalk.black.bgYellowBright('WARN:') +
							`Function '${functionName}' doesn't exist in ${api} controller of ${controllerName}.js file`
					);
					continue;
				}

                /**********************Assignment of middleware here*******************************/
                let middle=[];
                let totalMiddleware=0;
                if(routes.globalMiddlewares){
                    totalMiddleware+=routes.globalMiddlewares.length;
                    let middlewares=routes.globalMiddlewares;
                    for(let middleware of middlewares){
                        let middleArray=middleware.split('.');
                        if(middleArray.length!=2){
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `The global middleware is not properly defined of the ${api} routes.json file of path: '${routes.path} hence the routes will not be added coorect it to add it'`
                            );
                            break;
                        }
                        let [fileName,middlewareFunction]=middleArray;
                        let func=require(`../Middleware/${fileName}`)[middlewareFunction];
                        if(func){
                            middle.push(func);
                        }else{
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `Middleware '${middlewareFunction}' doesn't exist in globalMiddleware of ${fileName}.js file`
                            );
                            break;
                        }
                    }
                }
				//Checking first if middlewares exist for that route or not if exist we gonna add it otherwise we will not add it
				if (routes.middlewares) {
                    totalMiddleware+=routes.middlewares.length;
					//if middleware exidt then only we will add it otherwise we will not add it
					let middlewares = routes.middlewares;
					for (let middleware of middlewares) {
						let middlewareArray = middleware.split('.');
                        if (middlewareArray.length != 2) {
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `The middleware is not properly defined of the ${api} routes.json file of path: '${routes.path}'`
                            );
                            break;
                        }
						let [ fileName, middlewareName ] = middlewareArray;
						let middleName=require(`../api/${api}/middleware/${fileName}`)[middlewareName];
                        if(middleName){
                            middle.push(middleName);
                        }else{
                            console.log(
                                chalk.black.bgYellowBright('WARN:') +
                                    `Middleware '${middlewareName}' doesn't exist in ${api} middleware of ${fileName}.js file`
                            );
                            break;
                        }
					}
				}

                if(routes.globalMiddlewares || routes.middleware){
                    if(middle.length===totalMiddleware){
                        singleRoute.middlewares = middle;
                    }else{
                        continue;
                    }
                }else{
                    singleRoute.middlewares=middle;
                }
                
				//Adding a single routes to allRoutes array
				allRoutes.push(singleRoute);
		}
	}else{
		console.log(
			chalk.black.bgYellowBright('WARN:') + `Your ${api} api doesn't have routes.json file`
		);
	}
}

//You can see all the orutes that you have made by consoling it on the screen
//console.log(allRoutes);
module.exports = allRoutes;
