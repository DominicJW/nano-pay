module.exports = {
    ensureAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }
        else{
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/user/login');
        }
    },


    ensureUserAuthenticated : function(req,res,next) {
        if(req.isAuthenticated( )) {
            if (req.user.constructor.modelName == "User") {
                return next();
            }
        }
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/user/login');
    },


    ensureUserAuthenticatedAPI : function(req,res,next) {
        if(req.isAuthenticated( )) {
            if (req.user.constructor.modelName == "User") {
                return next();
            }
        }
        req.flash('error_msg' , 'please login to view this resource');
        res.statusCode = 401;
        res.send('Please Log into NanoPay');
    },







    ensurePartnerAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {//false when login via partner, true when logged in via user therefore /partner/login is the problem
            if (req.user.constructor.modelName == "Partner") {
                return next();
            }
        }

        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/partner/login');
    }

//do one for serverside api
}