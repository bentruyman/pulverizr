# Pulverizr

Pulverizr will smash your images down to size. It uses a number of free, and often times open source, programs to optimize and compress image files while still retaining their original appearance.

Pulverizr is completely written in JavaScript intended to run in a [NodeJS](http://nodejs.org/) environment. This means any idiot front-end developer such as myself can pick up the code and easily understand what's going on. Also, and normal developer could also pick it up and fix all the mistakes I made.

## Dependencies

If you're on Ubuntu, almost all of these dependencies can be retrieved using **apt**. Although Pulverizr works best with all its dependencies, it will gracefully fail when it doesn't find a compressor it's looking for.

The compressors Pulverizr uses are admittedly a bit obscure and sometimes difficult to install on all platforms.

* [gifsicle](http://www.lcdf.org/gifsicle/) 1.58+
* [libjpeg](http://www.ijg.org/) (or **libjpeg-progs** if you're using **apt**)
* [node](http://nodejs.org/) v0.1.95+
* [optipng](http://optipng.sourceforge.net/) 0.6.3+
* [pngcrush](http://pmt.sourceforge.net/pngcrush/) 1.7.0+

### On Mac OSX

If you're using **homebrew**, install the following packages:

    brew install gifsicle libjpeg optipng pngcrush

### On Ubuntu

To install the dependencies on Ubuntu:

    sudo apt-get install gifsicle libjpeg-progs optipng pngcrush

### On Windows

Good luck to you, fine sir.

## Installation

Before you can install Pulverizr, you need to first make sure all git submodules have been downloaded and you let Pulverizr get "built". To do this, simply run:

    make

Once Pulverizr is "made", install it to **/usr/local/bin** by running:

    make install

## Usage

Since I'm too lazy right now to go through everything in detail, here's what you'll see if you run "**pulverize -h**".

    Usage: pulverize [OPTIONS]... -- [FILES]...
    Smash your images down to size. Pulverizr uses several compressors/optimizers
    to squeeze every last bit out of your images. If Pulverizr detects an
    optimization, it overwrites the old image with the newly optimized one.

    Options:

     General:
      -a, --aggressive	uses more aggressive compression algorithms (takes longer, 
    			works better)
      --dry-run		print summary but don't actually modify files
      -q, --quiet		pulverizer will stfu
      --verbose		verbose mode

     Traversing:
      -R, --recursive	scan directories recursively

     Other:
      -h, --help		print this handy dandy help page
      -v, --version		print program version

### Single File

    pulverize image.png
    
### Single Directory

    pulverize /var/www/mysite.com/images/products/backgrounds

### Multiple Files

    pulverize foo.png bar.png baz.png qux.png

### Recursive Directory

    pulverize -R -- /var/www/mysite.com/images

## Special Thanks

See **Dependencies**, and [Smush.it](http://smush.it)
