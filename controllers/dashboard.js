// nodejs modules
const path = require('path');
const fs = require('fs');

// third party modules
const multer = require('multer');

// my own modules
const Blogger = require(path.join(process.cwd(), 'models', 'blogger.js'));
const Article = require(path.join(process.cwd(), 'models', 'article.js'));
const redirect = require(path.join(process.cwd(), 'tools', 'redirection.js'));
const multerInitializer = require(path.join(process.cwd(), 'tools', 'multerInitializer.js'));

const getDashboardPage = (req, res, next) => {
    Article.find({}).populate('postedBy', {
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            avatar: true,
        }).exec((err, articles) => {
            if (err) {
                return console.log(err);
            }
            res.render('dashboard.ejs', {
                blogger: req.session.blogger,
                articles
            })
        })
        // res.render('dashboard.ejs', {
        //     blogger: req.session.blogger
        // })
}

const getNewPostPage = (req, res, next) => {
    res.render('newPost.ejs', {
        blogger: req.session.blogger
    })
}

const getWhoAmIPage = (req, res, next) => {
    res.render('whoAmI.ejs', {
        blogger: req.session.blogger
    })
}

const getModifyInformationPage = (req, res, next) => {
    res.render('modifyInformation.ejs', {
        blogger: req.session.blogger,
        message: req.query.message || ''
    })
}

const updateBlogger = (req, res, next) => {
    const bloggerNewObj = {
        firstName: req.body.firstName || req.session.blogger.firstName,
        lastName: req.body.lastName || req.session.blogger.lastName,
        username: req.body.username || req.session.blogger.username,
        gender: req.body.gender || req.session.blogger.gender,
        avatar: req.body.avatar || req.session.blogger.avatar,
        phone: req.body.phone ? `+98${req.body.phone}` : req.session.blogger.phone,
        email: req.body.email || req.session.blogger.email,
        createdAt: req.body.createdAt || req.session.blogger.createdAt
    }

    if (req.body.password) {
        bloggerNewObj.password = req.body.password
    }

    Blogger.findOne({ username: bloggerNewObj.username }, (err, blogger) => {
        if (err) {
            return redirect(res, '/dashboard/modifyInformation', 'Something went wrong.');
        }
        if (blogger && bloggerNewObj.username !== blogger.username) {
            return redirect(res, '/dashboard/modifyInformation', 'Username is already in use.');
        }
        Blogger.updateOne({ username: req.session.blogger.username }, bloggerNewObj, (err) => {
            if (err) {
                return redirect(res, '/dashboard/modifyInformation', 'Something went wrong.');
            }
            req.session.blogger = null;
            return res.redirect('/auth/signIn');
        })
    })
}

const logout = (req, res, next) => {
    req.session.blogger = null;
    return res.redirect('/auth/signIn')
}

const uploadAvatar = (req, res, next) => {
    const upload = multerInitializer.uploadAvatar.single('avatar');
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err.message);
            res.redirect('/dashboard')
        } else if (err) {
            console.log(err.message);
            res.redirect('/dashboard')
        } else {
            Blogger.findByIdAndUpdate(req.session.blogger._id, { avatar: req.file.filename }, { new: true }, (err, blogger) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/dashboard')
                } else {
                    if (req.session.blogger.avatar) {
                        fs.unlink(path.join(process.cwd(), 'public', 'images', 'avatars', req.session.blogger.avatar), (err) => {
                            if (err) {
                                console.log(err.message);
                                res.redirect('/dashboard')
                            } else {
                                req.session.blogger = blogger;
                                res.redirect('/dashboard')
                            }
                        })
                    } else {
                        req.session.blogger = blogger;
                        res.redirect('/dashboard')
                    }
                }
            })
        }
    })
}

const uploadPostImage = (req, res, next) => {
    const upload = multerInitializer.uploadPostImage.single('postImage');
    upload(req, res, error => {
        if (error) {
            res.status(500).json({
                message: err.message
            })
        } else {
            res.json({
                imageUrl: `images/post_images/${req.file.imageName}`
            })
        }
    })
}

const deletePostImage = (req, res) => {
    req.body.forEach(url => {
        try {
            fs.unlinkSync(path.join(process.cwd(), 'public', url));
        } catch (err) {
            console.log(err.message);
        }
    })
}

const uploadPost = (req, res, next) => {
    console.log('abc', req.body);
    const upload = multerInitializer.uploadPostImage.single('postHeaderImage');
    upload(req, res, err => {
        // inja ---------------------------------
        console.log(req.body);
        console.log(req.file);
    })
}

module.exports = {
    getDashboardPage,
    getNewPostPage,
    getWhoAmIPage,
    getModifyInformationPage,
    updateBlogger,
    logout,
    uploadAvatar,
    uploadPost,
    uploadPostImage,
    deletePostImage
}