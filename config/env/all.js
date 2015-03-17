'use strict';

module.exports = {
	app: {
		title: 'MRA',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	debug: true,
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
				'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',			
				'public/lib/adminLTE/dist/css/AdminLTE.css',	
				'public/lib/adminLTE/dist/css/skins/skin-black.min.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular/angular-locale_es-ar.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',				
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular-smart-table/dist/smart-table.debug.js',
				'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
				'public/lib/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
				'public/lib/adminLTE/dist/js/app.js',	
				'public/lib/moment/moment.js',	
				'public/lib/angular-moment/angular-moment.js',	
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};