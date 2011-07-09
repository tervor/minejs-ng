<?php
$tmp = 0;

#duplicate the whole block to add new servers
$tmp++;
$cfg[$tmp]['name'] = "minecraft-prod";
$cfg[$tmp]['dir'] = "/home/minecraft/minecraft/";
$cfg[$tmp]['command'] = "java -Xmx4096M -Xms4096M -XX:ParallelGCThreads=10 -XX:NewSize=1024m -XX:MaxNewSize=1024m -XX:+UseConcMarkSweepGC -XX:+CMSIncrementalMode -XX:+CMSIncrementalPacing -XX:CMSIncrementalDutyCycleMin=0 -XX:CMSIncrementalDutyCycle=10 -XX:+UseCompressedOops -jar minecraft_server.jar nogui";
#$cfg[$tmp]['command'] = "java -Xmx4096M -Xms4096M -jar minecraft_server.jar nogui";
$cfg[$tmp]['user'] = "minecraft";

#duplicate the whole block to add new servers
$tmp++;
$cfg[$tmp]['name'] = "minecraft-test";
$cfg[$tmp]['dir'] = "/home/minecraft/minecraft-testserver/";
$cfg[$tmp]['command'] = "java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui";
$cfg[$tmp]['user'] = "minecraft";

?>
