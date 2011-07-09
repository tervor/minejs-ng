#!/usr/bin/php
<?php
require_once( realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . "/../htdocs/include/settings.inc.php");
require_once( realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . "/../htdocs/include/functions.inc.php");

switch ($argv[1]) {
    case "tell":
        echo sendCommand("tell", array("user" => $argv[2], "text" => $argv[3])) . "\n";
        break;

    case "users":
        echo "Users connected:\n";
        foreach (json_decode(sendCommand("users")) as $user) {
            echo "\t" . $user . "\n";
        }
        break;

    case "say":
        echo sendCommand("say", array("text" => $argv[2])) . "\n";
        break;

    case "exportItems":
        $items = array(
            #sample	array("id" => "1", "name" => "nice stone", "amount" => "1"),
            #sample	array("id" => "4", "name" => "gobble stone")

            array("id" => "1", "name" => "Einstein", "amount" => "1"),
            array("id" => "2", "name" => "Weed", "amount" => "1"),
            array("id" => "3", "name" => "Dirt", "amount" => "1"),
            array("id" => "4", "name" => "Cobblestone", "amount" => "1"),
            array("id" => "5", "name" => "Wooden Plank", "amount" => "1"),
            array("id" => "6", "name" => "Sapling", "amount" => "1"),
            array("id" => "8", "name" => "Flowing Water", "amount" => "1"),
            array("id" => "9", "name" => "Solid Water", "amount" => "1"),
            array("id" => "10", "name" => "Flowing Lava", "amount" => "1"),
            array("id" => "11", "name" => "Solid Lava", "amount" => "1"),
            array("id" => "12", "name" => "Sand", "amount" => "1"),
            array("id" => "13", "name" => "Gravel", "amount" => "1"),
            array("id" => "14", "name" => "Gold Ore", "amount" => "1"),
            array("id" => "15", "name" => "Iron Ore", "amount" => "1"),
            array("id" => "16", "name" => "Coal Ore", "amount" => "1"),
            array("id" => "17", "name" => "Log", "amount" => "1"),
            array("id" => "18", "name" => "Leaves", "amount" => "1"),
            array("id" => "19", "name" => "Sponge", "amount" => "1"),
            array("id" => "20", "name" => "Glass", "amount" => "1"),
            array("id" => "21", "name" => "Lapis Lazuli Ore", "amount" => "1"),
            array("id" => "22", "name" => "Lapis Lazuli Block", "amount" => "1"),
            array("id" => "23", "name" => "Dispenser", "amount" => "1"),
            array("id" => "24", "name" => "Sandstone", "amount" => "1"),
            array("id" => "25", "name" => "Note Block", "amount" => "1"),
            #       array("id" => "26", "name" => "Bed", "amount" => "1"),
            array("id" => "27", "name" => "Powered Rail", "amount" => "1"),
            array("id" => "28", "name" => "Detector Rail", "amount" => "1"),
            array("id" => "29", "name" => "Sticky Piston", "amount" => "1"),
            array("id" => "30", "name" => "Web", "amount" => "1"),
            array("id" => "31", "name" => "Tall Grass", "amount" => "1"),
            array("id" => "32", "name" => "Dead Shrub", "amount" => "1"),
            array("id" => "33", "name" => "Piston", "amount" => "1"),
            array("id" => "34", "name" => "Piston (Head)", "amount" => "1"),
            array("id" => "35", "name" => "Wool", "amount" => "1"),
            array("id" => "37", "name" => "Dandelion", "amount" => "1"),
            array("id" => "38", "name" => "Rose", "amount" => "1"),
            array("id" => "39", "name" => "Brown Mushroom", "amount" => "1"),
            array("id" => "40", "name" => "Red Mushroom", "amount" => "1"),
            array("id" => "41", "name" => "Gold Block", "amount" => "1"),
            array("id" => "42", "name" => "Iron Block", "amount" => "1"),
            array("id" => "43", "name" => "Double Stone Slab", "amount" => "1"),
            array("id" => "44", "name" => "Stone Slab", "amount" => "1"),
            array("id" => "45", "name" => "Brick", "amount" => "1"),
            array("id" => "46", "name" => "TNT", "amount" => "1"),
            array("id" => "47", "name" => "Bookcase", "amount" => "1"),
            array("id" => "48", "name" => "Moss Stone", "amount" => "1"),
            array("id" => "49", "name" => "Obsidian", "amount" => "1"),
            array("id" => "50", "name" => "Torch", "amount" => "1"),
            #    array("id" => "51", "name" => "Fire", "amount" => "1"),
            #array("id" => "52", "name" => "Mob Spawner", "amount" => "1"),
            array("id" => "53", "name" => "Wood Stairs", "amount" => "1"),
            array("id" => "54", "name" => "Chest", "amount" => "1"),
            array("id" => "56", "name" => "Diamond Ore", "amount" => "1"),
            array("id" => "57", "name" => "Diamond Block", "amount" => "1"),
            array("id" => "58", "name" => "Workbench", "amount" => "0"),
            array("id" => "61", "name" => "Furnace", "amount" => "1"),
            array("id" => "63", "name" => "amount Signs", "amount" => "1"),
            array("id" => "64", "name" => "amount Wodden Door", "amount" => "1"),
            array("id" => "65", "name" => "Ladder", "amount" => "1"),
            array("id" => "66", "name" => "Rails", "amount" => "1"),
            array("id" => "67", "name" => "Cobblestone Stairs", "amount" => "1"),
            array("id" => "69", "name" => "Lever", "amount" => "1"),
            array("id" => "70", "name" => "Stone Pressure Plate", "amount" => "1"),
            array("id" => "72", "name" => "Wood Pressure Plate", "amount" => "1"),
            array("id" => "73", "name" => "Redstone Ore", "amount" => "1"),
            array("id" => "76", "name" => "Redstone Torch", "amount" => "1"),
            array("id" => "77", "name" => "Stone Button", "amount" => "1"),
            array("id" => "78", "name" => "Small Snow", "amount" => "1"),
            array("id" => "79", "name" => "Ice", "amount" => "1"),
            array("id" => "80", "name" => "Snow Block", "amount" => "1"),
            array("id" => "81", "name" => "Cactus", "amount" => "1"),
            array("id" => "82", "name" => "Clay Block", "amount" => "1"),
            array("id" => "83", "name" => "Sugar Cane", "amount" => "1"),
            array("id" => "84", "name" => "Jukebox", "amount" => "1"),
            array("id" => "85", "name" => "Fence", "amount" => "1"),
            array("id" => "86", "name" => "Pumpkin", "amount" => "1"),
            array("id" => "87", "name" => "Netherrack", "amount" => "1"),
            array("id" => "88", "name" => "Soul Sand", "amount" => "1"),
            array("id" => "89", "name" => "Glowstone", "amount" => "1"),
#        array("id" => "90", "name" => "Portal Piece", "amount" => "1"),
            array("id" => "91", "name" => "Jack-O-Lantern", "amount" => "1"),
            array("id" => "92", "name" => "Cake", "amount" => "1"),
            # array("id" => "93", "name" => "amount Repeater", "amount" => "1"),
            array("id" => "96", "name" => "Trapdoor", "amount" => "1"),
#        array("id" => "256", "name" => "Iron Shovel", "amount" => "1"),
#        array("id" => "257", "name" => "Iron Pickaxe", "amount" => "1"),
#        array("id" => "258", "name" => "Iron Axe", "amount" => "1"),
            array("id" => "259", "name" => "Flint and Steel", "amount" => "0"),
            array("id" => "260", "name" => "Apple", "amount" => "0"),
            array("id" => "261", "name" => "Bow", "amount" => "0"),
            array("id" => "262", "name" => "Arrow", "amount" => "1"),
            array("id" => "263", "name" => "Coal", "amount" => "1"),
            array("id" => "264", "name" => "Diamond Gem", "amount" => "1"),
            array("id" => "265", "name" => "Iron Ingot", "amount" => "1"),
            array("id" => "266", "name" => "Gold Ingot", "amount" => "1"),
#        array("id" => "267", "name" => "Iron Sword", "amount" => "0"),
#        array("id" => "268", "name" => "Wood Sword", "amount" => "0"),
#        array("id" => "269", "name" => "Wood Shovel", "amount" => "0"),
#        array("id" => "270", "name" => "Wood Pickaxe", "amount" => "0"),
#        array("id" => "271", "name" => "Wood Axe", "amount" => "0"),
#        array("id" => "272", "name" => "Stone Sword", "amount" => "0"),
#        array("id" => "273", "name" => "Stone Shovel", "amount" => "0"),
#        array("id" => "274", "name" => "Stone Pickaxe", "amount" => "0"),
#        array("id" => "275", "name" => "Stone Axe", "amount" => "0"),
#        array("id" => "276", "name" => "Diamond Sword", "amount" => "0"),
            array("id" => "277", "name" => "Diamond Shovel", "amount" => "0"),
            array("id" => "278", "name" => "Diamond Pickaxe", "amount" => "0"),
            array("id" => "279", "name" => "Diamond Axe", "amount" => "0"),
            array("id" => "280", "name" => "Stick", "amount" => "1"),
            array("id" => "281", "name" => "Bowl", "amount" => "1"),
            array("id" => "282", "name" => "Mushroom Stew", "amount" => "1"),
#        array("id" => "283", "name" => "Gold Sword", "amount" => "1"),
#        array("id" => "284", "name" => "Gold Shovel", "amount" => "1"),
#        array("id" => "285", "name" => "Gold Pickaxe", "amount" => "1"),
#        array("id" => "286", "name" => "Gold Axe", "amount" => "1"),
            array("id" => "287", "name" => "String", "amount" => "1"),
            array("id" => "288", "name" => "Feather", "amount" => "1"),
            array("id" => "289", "name" => "Gunpowder", "amount" => "1"),
#        array("id" => "290", "name" => "Wood Hoe", "amount" => "1"),
#        array("id" => "291", "name" => "Stone Hoe", "amount" => "1"),
#        array("id" => "292", "name" => "Iron Hoe", "amount" => "1"),
#        array("id" => "293", "name" => "Diamond Hoe", "amount" => "1"),
#        array("id" => "294", "name" => "Gold Hoe", "amount" => "1"),
            array("id" => "295", "name" => "Seeds", "amount" => "1"),
            array("id" => "296", "name" => "Wheat", "amount" => "1"),
            array("id" => "297", "name" => "Bread", "amount" => "0"),
#        array("id" => "298", "name" => "Leather Helmet", "amount" => "1"),
#        array("id" => "299", "name" => "Leather Chestplate", "amount" => "1"),
#        array("id" => "300", "name" => "Leather Leggings", "amount" => "1"),
#        array("id" => "301", "name" => "Leather Boots", "amount" => "1"),
#        array("id" => "306", "name" => "Iron Helmet", "amount" => "1"),
#        array("id" => "307", "name" => "Iron Chestplate", "amount" => "1"),
#        array("id" => "308", "name" => "Iron Leggings", "amount" => "1"),
#        array("id" => "309", "name" => "Iron Boots", "amount" => "1"),
#        array("id" => "310", "name" => "Diamond Helmet", "amount" => "1"),
#        array("id" => "311", "name" => "Diamond Chestplate", "amount" => "1"),
#        array("id" => "312", "name" => "Diamond Leggings", "amount" => "1"),
#        array("id" => "313", "name" => "Diamond Boots", "amount" => "1"),
#        array("id" => "314", "name" => "Gold Helmet", "amount" => "1"),
#        array("id" => "315", "name" => "Gold Chestplate", "amount" => "1"),
#        array("id" => "316", "name" => "Gold Leggings", "amount" => "1"),
#        array("id" => "317", "name" => "Gold Boots", "amount" => "1"),
            array("id" => "318", "name" => "Flint", "amount" => "1"),
            array("id" => "319", "name" => "Raw Porkchop", "amount" => "0"),
            array("id" => "320", "name" => "Cooked Porkchop", "amount" => "0"),
            array("id" => "321", "name" => "Painting", "amount" => "1"),
            array("id" => "322", "name" => "Gold Apple", "amount" => "0"),
            array("id" => "323", "name" => "Sign", "amount" => "0"),
            array("id" => "324", "name" => "Wood Door", "amount" => "0"),
            array("id" => "325", "name" => "Bucket", "amount" => "0"),
            array("id" => "326", "name" => "Water Bucket", "amount" => "0"),
            array("id" => "327", "name" => "Lava Bucket", "amount" => "0"),
            array("id" => "328", "name" => "Minecart", "amount" => "0"),
            array("id" => "329", "name" => "Saddle", "amount" => "0"),
            array("id" => "330", "name" => "Iron Door", "amount" => "0"),
            array("id" => "331", "name" => "Redstone Dust", "amount" => "1"),
            array("id" => "332", "name" => "Snowball", "amount" => "1"),
            array("id" => "333", "name" => "Boat", "amount" => "0"),
            array("id" => "334", "name" => "Leather", "amount" => "1"),
            array("id" => "335", "name" => "Milk", "amount" => "0"),
            array("id" => "336", "name" => "Clay Brick", "amount" => "1"),
#       array("id" => "337", "name" => "Clay", "amount" => "1"),
            array("id" => "338", "name" => "Sugar Cane", "amount" => "1"),
            array("id" => "339", "name" => "Paper", "amount" => "1"),
            array("id" => "340", "name" => "Book", "amount" => "1"),
            array("id" => "341", "name" => "Slime Ball", "amount" => "1"),
            array("id" => "342", "name" => "Storage Minecart", "amount" => "0"),
            array("id" => "343", "name" => "Powered Minecart", "amount" => "0"),
            array("id" => "344", "name" => "Egg", "amount" => "1"),
            array("id" => "345", "name" => "Compass", "amount" => "0"),
            array("id" => "346", "name" => "Fishing Rod", "amount" => "0"),
            array("id" => "347", "name" => "Watch", "amount" => "0"),
            array("id" => "348", "name" => "Glowstone Dust", "amount" => "1"),
            array("id" => "349", "name" => "Raw Fish", "amount" => "0"),
            array("id" => "350", "name" => "Cooked Fish", "amount" => "0"),
            array("id" => "351", "name" => "Ink Sack", "amount" => "1"),
            array("id" => "352", "name" => "Bone", "amount" => "1"),
            array("id" => "353", "name" => "Sugar", "amount" => "1"),
#        array("id" => "354", "name" => "Cake", "amount" => "1"),
            array("id" => "355", "name" => "Bed", "amount" => "0"),
            array("id" => "356", "name" => "Redstone Repeater", "amount" => "1"),
            array("id" => "357", "name" => "Cookie", "amount" => "1"),
            array("id" => "358", "name" => "Map", "amount" => "0"),
            array("id" => "359", "name" => "Shears", "amount" => "0"),
            array("id" => "2256", "name" => "Gold Music Disk", "amount" => "0"),
            array("id" => "2257", "name" => "Green Music Disk", "amount" => "0")
        );
        echo json_encode($items);
        break;

    case "exportScripts":
        $scripts = array(
        "name" => "Diamond Toolset", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Diamant Werkzeuge",
                "give USER 277 1",
                "give USER 278 2",
                "give USER 279 1"
            ),
            "Starterkit" => array(
                "say USER drop Starterkit",
                "give USER 278 1",
                "give USER 26 1",
                "give USER 345 1",
                "give USER 347 1",
                "give USER 346 1",
                "give USER 322 3"
            ),
        "name" => "Schienenarbeiter", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Schienen Equipment",
                "give USER 66 64",
                "give USER 66 64",
                "give USER 66 64",
                "give USER 66 64",
                "give USER 66 64",
                "give USER 66 64",
                "give USER 66 64",
                "give USER 66 64",
                "give USER 27 64",
                "give USER 27 64",
                "give USER 27 64",
                "give USER 28 16",
                "give USER 1 64",
                "give USER 1 64",
                "give USER 328 2",
                "give USER 76 64",
                "give USER 76 64"
            ),
        "name" => "Elektroniker", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Elektro Equipment",
                "give USER 76 64",
                "give USER 331 64",
                "give USER 77 64",
                "give USER 69 64",
                "give USER 42 64",
                "give USER 1 64",
                "give USER 331 64",
                "give USER 331 64",
                "give USER 331 64",
                "give USER 331 64",
                "give USER 331 64",
                "give USER 65 64",
                "give USER 76 64",
                "give USER 76 64",
                "give USER 75 64",
                "give USER 72 64",
                "give USER 71 64",
                "give USER 23 64",
                "give USER 42 64",
                "give USER 42 64",
                "give USER 93 64",
                "give USER 93 64",
                "give USER 63 64"
            ),
        "name" => "Bergbauarbeiter", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Mining Equipment",
                "give USER 1 64",
                "give USER 1 64",
                "give USER 1 64",
                "give USER 1 64",
                "give USER 50 64",
                "give USER 50 64",
                "give USER 50 64",
                "give USER 50 64",
                "give USER 20 64",
                "give USER 20 64",
                "give USER 20 64",
                "give USER 20 64",
                "give USER 278 4",
                "give USER 277 2",
                "give USER 322 3",
                "give USER 326 1"
            ),
        "name" => "Gärtner", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Gartenbau Equipment",
                "give USER 293 1",
                "give USER 2 64",
                "give USER 3 64",
                "give USER 352 64",
                "give USER 18 64",
                "give USER 17 64",
                "give USER 59 64",
                "give USER 20 64",
                "give USER 40 64",
                "give USER 259 1",
                "give USER 1 64",
                "give USER 6 64",
                "give USER 2 64",
                "give USER 2 64",
                "give USER 2 64",
                "give USER 352 64",
                "give USER 3 64",
                "give USER 3 64",
                "give USER 3 64",
                "give USER 50 64",
                "give USER 6 64",
                "give USER 6 64",
                "give USER 83 64",
                "give USER 81 64",
                "give USER 30 64",
                "give USER 37 64",
                "give USER 38 64",
                "give USER 352 64",
                "give USER 352 64",
                "give USER 352 64",
                "give USER 85 64",
                "give USER 8 64",
                "give USER 395 64",
                "give USER 395 64",
                "give USER 395 64",
                "give USER 39 64",
                "give USER 12 64",
                "give USER 18 64"
            ),
        "name" => "Sound Equipment", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Sound Equipment",
                "give USER 25 64",
                "give USER 25 64",
                "give USER 25 64",
                "give USER 331 64",
                "give USER 93 64",
                "give USER 2256 1",
                "give USER 2257 1",
                "give USER 84 1",
                "give USER 279 1",
                "give USER 277 1",
                "give USER 42 1",
                "give USER 42 1",
                "give USER 42 1",
                "give USER 76 64",
                "give USER 76 64",
                "give USER 331 64",
                "give USER 331 64",
                "give USER 279 1"
            ),
        "name" => "Robinhood", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Robinhood Gear",
                "give USER 298 1",
                "give USER 299 1",
                "give USER 300 1",
                "give USER 301 1",
                "give USER 261 1",
                "give USER 262 64",
                "give USER 262 64",
                "give USER 262 64",
                "give USER 262 64"
            ),
        "name" => "Chainmail Warrior", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Chainmail Warrior Gear",
                "give USER 302 1",
                "give USER 303 1",
                "give USER 304 1",
                "give USER 305 1",
                "give USER 267 1",
                "give USER 258 1",
                "give USER 257 1",
                "give USER 255 1"
            ),
        "name" => "Goldenchild", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Gold Warrior Gear",
                "give USER 314 1",
                "give USER 315 1",
                "give USER 316 1",
                "give USER 317 1",
                "give USER 283 1",
                "give USER 284 1",
                "give USER 285 1",
                "give USER 286 1"
            ),
        "name" => "Babyblue Warrior", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say USER drop Diamond Warrior Gear",
                "give USER 310 1",
                "give USER 311 1",
                "give USER 312 1",
                "give USER 313 1",
                "give USER 276 1"
            ),
            #"Es werde Tag" => array(
            #    "say ..und USER sprach: Es werde Tag!",
            #    "say Warnung: Redstone Loop Schaltungen defekt!",
            #	"time set 0"
            #    ),
            #"Es werde Nacht" => array(
            #    "say ..und USER sprach: Es werde Nacht!",
            #    "say Warnung: Redstone Loop Schaltungen defekt!",
            #	"time set 20000"
            #    ),
        "name" => "Surprise", 
        "icon" => "default.png",
        "cmdlist" => array(
                "say suprise suprise USER!",
                "give USER RANDOM RANDOM"
            )
        );
        echo json_encode($scripts);
        break;

    default:
        echo "Options available:\n";
        echo "\ttell user 'text'\n";
        echo "\tsay 'text'\n";
        echo "\tusers\n";
        echo "\texportItems\n";
        echo "\texportScripts\n";
}
?>