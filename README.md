**THIS PROJECT IS NO LONGER UNDER ACTIVE DEVELOPMENT**

# Pulverizr

Pulverizr will smash your images down to size. It uses a number of free, and
often times open source, programs to optimize and compress image files while
still retaining their original appearance.

While modern image editor's, like Photoshop's, compressors do a decent job at
cutting the extra fat around images, they sometimes leave behind extras you
probably don't want or need. For example, EXIF data in JPEGs, color-correction
data in PNGs and redundant frames in GIFs.

Pulverizr uses a handful of compressors to perform a number of lossless
compression routines to squeeze every last bit out of your images (see
**Dependencies**). Note this software isn't 100% stable yet. You may notice
differences in images that may contain certain color profiles that can be
stripped out by the compressors. Any strangeness you see, [please report
it](http://github.com/bentruyman/pulverizr/issues)!

Pulverizr is completely written in JavaScript intended to run in a
[NodeJS](http://nodejs.org/) environment. This means any idiot front-end
developer such as myself can pick up the code and easily understand what's
going on. Also, any normal developer could also pick it up and fix all the
mistakes I made.

## Dependencies

If you're on Ubuntu, almost all of these dependencies can be retrieved using
**apt**. Although Pulverizr works best with all its dependencies, it will
gracefully fail when it doesn't find a compressor it's looking for.

The compressors Pulverizr uses are admittedly a bit obscure and sometimes
difficult to install on all platforms.

* [gifsicle](http://www.lcdf.org/gifsicle/) 1.58+
* [libjpeg](http://www.ijg.org/) (or **libjpeg-progs** if you're using
  **apt**)
* [optipng](http://optipng.sourceforge.net/) 0.6.3+
* [pngcrush](http://pmt.sourceforge.net/pngcrush/) 1.7.0+

### On Mac OSX

If you're using [homebrew](http://mxcl.github.com/homebrew/), install the
following packages:

    brew install gifsicle libjpeg optipng pngcrush

### On Ubuntu

To install the dependencies on Ubuntu:

    apt-get install gifsicle libjpeg-progs optipng pngcrush

### On Windows

Good luck to you, fine sir.

## Installation

    npm install -g pulverizr

## Usage

**Note: Be sure to test before you overwrite your images by using `--dry-run`**

Usage: pulverize [options] <file...>

    Options:

      -h, --help        output usage information
      -V, --version     output the version number
      -a, --aggressive  Uses more aggressive compression algorithms (takes longer, works better)
      --dry-run         Print summary but don't actually modify files
      -q, --quiet       Pulverizer will not report
      -R, --recursive   Recurse through directories
      -v, --verbose     Verbose mode

### Single File

    pulverize image.png
    
### Single Directory

    pulverize /var/www/mysite.com/images/products/backgrounds

### Multiple Files

    pulverize foo.png bar.png baz.png qux.png

### Recursive Directory

    pulverize -R -- /var/www/mysite.com/images

### Aggressive Recursive Directory

    pulverize -aR -- /var/www/mysite.com/images

## Special Thanks

See **Dependencies**, and [Smush.it](http://smush.it)

## License

Copyright (c) 2010, Benjamin Truyman
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
 * Neither the name of the owner nor the names of its contributors may be
   used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL BENJAMIN TRUYMAN BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
