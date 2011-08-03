#!/usr/bin/python

import os
import math
import Image
import json

cellsize = 32;

files = os.listdir('./');
files = filter(lambda file: os.path.splitext(file)[1] == '.png', files);
count = len(files);
size = int(math.ceil(math.sqrt(count)));

target = Image.new('RGBA', [size * cellsize, size * cellsize]);

info = {
	'info': {
		'width': size * cellsize,
		'height': size * cellsize,
		'cellwidth': cellsize,
		'cellheight': cellsize,
	},
	'cells': {
	},
};


index = 0;
for file in files:
	name = os.path.splitext(file)[0];
	cell = Image.open(file);
	cell = cell.resize([cellsize, cellsize], Image.NEAREST);
	x = index % size;
	y = index / size;
	index += 1;
	target.paste(cell, [x * cellsize, y * cellsize, (x + 1) * cellsize, (y + 1) * cellsize]);
	info['cells'][name] = {
		'x': x,
		'y': y,	
	};


target.save('output/map.png');

file = open('output/map.json', 'w');
file.write(json.dumps(info));
file.close()

