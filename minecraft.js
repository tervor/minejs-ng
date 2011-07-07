#!/opt/node/node

var sys = require('sys'),
    fs = require('fs'),
    tty = require('tty').setRawMode(true),   
    http = require('http'),
    spawn = require('child_process').spawn,
    stdin = process.openStdin(),
    util = require('util'),
    minecraft = spawn('/usr/bin/java',['\-Xms1g','\-Xmx1g','\-jar','\minecraft_server.jar','\nogui','/home/minecraft/minecraft-testserver']);


/*process.ARGV[2];

if (!filename)
  return sys.puts("wtf");
*/

console.log("Node Memory Usage "+util.inspect(process.memoryUsage()));

sys.puts("\n\nMinecraft launched on PID: " + minecraft.pid);
sys.puts("Webconsole available on  http://127.0.0.1:1337/ ");

minecraft.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

minecraft.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

minecraft.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    res.write(data);
});

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': "text/plain;charset=UTF-8"});
    res.write("this is a chunk streamn");
    data="say New Nodemine HTTP connection"
    minecraft.stdin.write(data + '\n');
    res.write(data);

  
    minecraft.stdout.on('data', function (data) {

        res.write(data);
    });

    minecraft.stderr.on('data', function (data) {
        /*pharse logfile stream, count users, trigger on meta command*/
        res.write(data);
    });

}).listen(1337);


/* catching all console input */
stdin.on('keypress', function (chunk, key) {
    process.stdout.write(chunk);
    minecraft.stdin.write(chunk);
    process.stdin.resume();
    if (key && key.ctrl && key.name == 'c') {
        sys.puts("CTRL+C detected!!! KILL KILL KILL! X_x");
        minecraft.stdin.write("stop");
        minecraft.stdin.end();
        minecraft.kill('SIGHUP');
        process.exit();
    }
  
});


