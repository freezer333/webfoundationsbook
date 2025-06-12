This folder contains a program and a sub-folder of HTML examples.  
The program is a simple HTTP server designed to run locally on your own computer.  
This will let you review example HTML served from your own computer.  

Download `serve.js` and the `examples` directory to a folder on your computer.   You might find it easier to download `examples.zip`, and extract the contents into the folder with `serve.js` instead. 
You should have one directory, with `serve.js` and a folder called `examples` in it, and within `examples` a `block` and `inline` directory.

**Important** When downloading files from github's web page directly, always click the file, and download the *raw* file.  If you just right click the link and click "Save page as" you will be downloading an HTML file with the file contents inside of it - not the file itself.

With Node.js installed, you can navigate your command prompt or terminal to the directory where you
saved `serve.js` and type `node serve.js`.  The application should launch without error.

Once running, you may access the examples by entering `http://localhost:8080/examples` in any web browser running on your machine.

**Unlike full-featured web servers**, this one doesn't list directory contents - so you'll need to enter full paths of the examples.  

You can use this to test:
http://localhost:8080/examples/block/block-article.html

It should load something like this if you have things working correctly:

![image](https://github.com/user-attachments/assets/36e6a18f-8718-420c-83b1-daf13e8c794d)

