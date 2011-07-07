
// Configuration options
var config = {
	
	// Minecraft server configuration options
	server: {
		java: '/usr/bin/java',
		java_args: ['-Xmx1024M', '-Xms1024M'],
		dir: '/Users/freak/Documents/minejs/server',
		jar: 'minecraft_server.jar',
		server_args: ['nogui'],
	},
	
	// Web server configuration options
	web: {
		port: 8000,
	},

	// Telnet server configuration options
	telnet: {
		port: 8001,
	},
	
};


module.exports.config = config;