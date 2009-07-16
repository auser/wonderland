OUTPUT_DIR			= compiled/

all: title compile
	
title:
	echo "Compile all the assets into one index.html"
	
compile:
	echo "Compiling"

clean:
	rm -rf $OUTPUT_DIR