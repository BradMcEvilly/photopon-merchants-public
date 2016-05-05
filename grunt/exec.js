module.exports = {

    
    uploadpackage: {
        cmd: function () {
            //return "scp -rv " + global.filename + " bradmcevilly@photopon.co:/home/bradmcevilly/releases/";
            return "rsync -avzhe ssh --progress " + global.filename + " bradmcevilly@photopon.co:/home/bradmcevilly/releases/";
        }
    }





};
