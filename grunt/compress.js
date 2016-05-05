module.exports = {

    
    createpackage: {
        options: {
          archive: function () {
            var timestamp =  Math.floor(Date.now() / 1000);
            var filename = "release/photopon_" + timestamp + '.zip';
            global["filename"] = filename;
            return filename;
          }
        },
        files: [
            {expand: true, src: "**", cwd: "bin/", dest: "."}
        ]
    }





};
