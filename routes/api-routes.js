const db = require('../models/index');

// gina code starts
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/myPicFolder');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

module.exports = function (app) {

    app.get('/api/photos', function (req, res) {
        db.photos.find({})
            .sort({ photo_url: -1 })
            .populate("likes", "likes")
            .populate('comments')
            .then(function (photos) {
                res.json(photos);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post('/api/photo', upload.single('inputUploadPhoto'), function (req, res, next) {
        db.photos.create({ "photo_url": (req.file.path).replace('public', '') })
            .then(function (photos) {
                res.redirect(req.protocol + '://' + req.get('host'));
            })
            .catch(function (err) {
                res.json(err);
            });

    });

    app.delete('/api/photo/:index', function (req, res) {
        db.photos.findByIdAndDelete({ _id: req.params.index })
            .then(function (photo) {
                let imgPathToDelete = "./public/myPicFolder/" + photo.photo_url.replace("\\myPicFolder\\", "");
                fs.unlink(imgPathToDelete, (err) => {
                    if (err) {
                        console.log("failed to delete local image:" + err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
                res.json(photos);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // gina code ends

    app.post('/api/likes', function (req, res) {
        console.log(req.body);
        db.likes.create({ likes: req.body.isLiked })
            .then(function (dblike) {
                return db.photos.findOneAndUpdate({ _id: req.body._id }, { $push: { likes: dblike._id } }, { new: true });
            })
            .then(function (dbPhoto) {
                res.json(dbPhoto);
            })
            .catch(function (err) {
                res.json(err);
            });
    });


    app.post('/api/comments', function (req, res) {
        //we need req.body to have userComment and also photoUrl
        /*{
             userComment: "I like this photo",
             photo_id: '15675645647647.jpg'
        }*/
        db.eachComment.create({ userComment: req.body.userComment })
            .then(function (comments) {
                return db.photos.findOneAndUpdate({ _id: req.body.photo_id }, { $push: { comments: comments._id } }, { new: true })

            })

            .then(function (photos) {
                res.json(photos)
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get('/api/likes', function (req, res) {
        db.likes.find({})
            .then(function (likes) {
                res.json(likes);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get('/api/comments', function (req, res) {
        db.eachComment.find({})

            .then(function (comments) {
                res.json(comments);
            })
            .catch(function (err) {
                res.json(err);
            });
    });





    app.delete('/api/likes', function (req, res) {
        db.likes.findOneAndDelete(req.body)
            .then(function (likes) {
                res.json(likes);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete('/api/comments', function (req, res) {
        db.comments.findOneAndDelete(req.body)
            .then(function (comments) {
                res.json(comments);
            })
            .catch(function (err) {
                res.json(err);
            });
    });



    app.put('/api/photos', function (req, res) {
        db.photos.findOneAndUpdate({ _id: req.body._id }, { set: { photos: req.body.photos } })
            .then(function (photos) {
                res.json(photos);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.put('/api/likes', function (req, res) {
        db.likes.findOneAndUpdate({ _id: req.body._id }, { set: { likes: req.body.likes } })
            .then(function (likes) {
                res.json(likes);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.put('/api/comments', function (req, res) {
        db.comments.findOneAndUpdate({ _id: req.body._id }, { set: { comments: req.body.comments } })
            .then(function (comments) {
                res.json(comments);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

};