const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

module.exports = {
  // GET /signin 用户登录
  signInPage: function (req, res) {
    res.render("signin");
  },

  // POST /signin 用户登录
  singInCheck: function(req, res) {
    const name = req.fields.name
    const password = req.fields.password
    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名')
      }
      if (!password.length) {
        throw new Error('请填写密码')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    UserModel.getUserByName(name)
      .then(function (user) {
        if (!user) {
          req.flash('error', '用户不存在')
          return res.redirect('back')
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误')
          return res.redirect('back')
        }
        req.flash('success', '登录成功')
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/manage')
      })
  }

}

exports.signup = function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var emailForm = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
    try {
        if (!emailForm.test(email)) {
            throw new Error('邮箱格式错误');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
    } catch (e) {
        console.log('sign up fail');
        return res.json({
            'status': false,
            'message': e.message
        });
    }
    userModel.getUserByEmail(email)
        .then(function(user) {
            if (user) {
                return res.json({
                    'status': false,
                    'message': '此邮箱已被用户使用'
                })
            }
        });
    userModel.getUserByName(name)
        .then(function(user) {
            if (user) {
                return res.json({
                    'status': false,
                    'message': '此用户名已被使用'
                })
            }
        });

    var user = {
        name: name,
        email: email,
        password: userModel.createHashPassword(password)
    };

    userModel.create(user)
        .then(function(user) {
            console.log('注册成功');
            delete user.password;
            req.session.user = user;
            return res.json({
                'status': true,
                'name': name
            });
        }).catch(function(err) {
            console.log("create user fail");
        });
};

exports.signin = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    userModel.getUserByEmail(email)
        .then(function(user) {
            try {
                if (!user) {
                    throw new Error('用户不存在');
                }
                if (!userModel.validHashPassword(password, user.password)) {
                    throw new Error('邮箱或密码错误');
                }
            } catch (e) {
                return res.json({
                    'status': false,
                    'message': e.message
                });
            }
            console.log(user.name + '已登陆');
            delete user.password;
            req.session.user = user;
            return res.json({
                'status': true,
                'email': email
            })
        });
};

exports.signout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
};

exports.browse = function(req, res, next) {
    userModel.getUsers()
        .then(users => {
            console.log("users: \n");
            console.log(users);
            res.json(users);
        });
};

exports.myprofile = function(req, res, next) {
    if (!!req.session.user) {
        userModel.getUserByEmail(req.session.user.email)
            .then(user => {
                res.json({
                    'name': user.name,
                    'avatar': user.avatar,
                    'email': user.email,
                    'description': user.description,
                    'fileList': user.fileList,
                    'starList': user.starList
                });
            });
    }
};

exports.browse.user = function(req, res, next) {
    userModel.getUserByName(req.params.userInfo)
        .then(user => {
            if (user) res.json(user);
        });
    userModel.getUserByEmail(req.params.userInfo)
        .then(user => {
            if (user) res.json(user);
        });
};

exports.settings = function(req, res, next) {
    if (!!req.session.user) {
        userModel.getUserByEmail(req.session.user.email)
            .then(user => {
                res.json({
                    'name': user.name,
                    'avatar': user.avatar,
                    'email': user.email,
                    'description': user.description,
                });
            });
    }
};

exports.checkSignin = function(req, res, next) {
    if (!!req.session.user) {
        userModel.getUserByEmail(req.session.user.email)
            .then(user => {
                console.log('avatar:' + user.avatar);
                res.json({
                    'signedin': true,
                    'userAvatar': user.avatar
                });
            });
    } else {
        return res.json({
            'signedin': false,
            'userAvatar': 'img/avatar.png'
        })
    };
};

exports.updateProfile = function(req, res, next) {
    console.log("req.body: \n");
    console.log(req.body);
    if (req.body.name) {
        userModel.update({
            email: req.session.user.email
        }, {
            name: req.body.name
        }, function(error) {});
    };
    if (req.body.email) {
        userModel.update({
            email: req.session.user.email
        }, {
            email: req.body.email
        }, function(error) {});
        userModel.getUserByEmail(req.body.email)
            .then(user => {
                req.session.user = user;
            });
    };
    if (req.body.description) {
        userModel.update({
            email: req.session.user.email
        }, {
            description: req.body.description
        }, function(error) {});
    };

    userModel.getUserByEmail(req.session.user.email)
        .then(user => {
            req.session.user = user;
        });
    next();
};

exports.updateAvatar = function(req, res, next) {
    var relativeAddress = 'uploads/' + req.file.filename;
    userModel.update({
        email: req.session.user.email
    }, {
        avatar: relativeAddress
    }, function(error) {
        console.log('updateAvatar error: ' + error);
    });
    next();
};

exports.updateAccount = function(req, res, next) {
    console.log(req.body);
};


exports.node = function(req, res, next) {
    nodeModel.getNodeByNodeId(req.params.nodeId)
        .then(function(node) {
            if (node) {
                console.log('get and do not need to create: ' + node);
                return res.json(node);
            }
            if (!node) {
                var newNode = {
                    nodeId: req.params.nodeId,
                    authorEmail: req.session.user.email
                };
                nodeModel.create(newNode)
                    .then(function(newNodeResult) {
                        console.log(newNodeResult);
                        console.log('创建成功');
                        return res.json(newNodeResult);
                    }).catch(function(err) {
                        console.log("create newNodeResult fail");
                        return;
                    });
            };
        });
};

exports.node.updateNodeData = function(req, res, next) {
    console.log('----updateNodeData----');
    console.log(req.body);
    nodeModel.getNodeByNodeId(req.body.nodeId)
        .then(response => {
            console.log(response);
        });
    nodeModel.update({
        nodeId: req.body.nodeId
    }, {
        $set: {
            comments: req.body.comments,
            plans: req.body.plans,
            documents: req.body.documents,
            notes: req.body.notes,
            description: req.body.description,
            tags: req.body.tags,
            time: req.body.time,
            cards: req.body.cards
        }
    }, function(error) {});
    next();
};

exports.uploadFile = function(req, res, next) {
    console.log('----uploadFile----');
    var newDocument = {
        'name': req.file.originalname,
        'size': req.file.size,
        'date': new Date().toDateString(),
        'url': 'uploads/' + req.file.filename
    };
    res.json(newDocument);
};

exports.getFileFromDatabase = function(req, res, next) {
    var filename = req.params.filename;
    var author = req.params.author;
    var findObj = {
        "filename": filename,
        "author": author
    };
    fileModel.getDataByFilenameAndAuthor(findObj)
        .then(function(response) {
            console.log("I am data: ");
            console.log(response);
            if (response.toString() != 0) {
                res.json(response[0].data);
            } else {
                res.json({});
            }
            console.log("I can return...");
            return response;
        });
};

exports.saveFileToDatabase = function(req, res, next) {
    var author = req.session.user.name;
    var filename = req.params.filename;
    var myfile = {
        "author": author,
        "filename": filename
    };

    var newfile = {
        "author": author,
        "filename": filename,
        "data": req.body
    };

    fileModel.getDataByFilenameAndAuthor(myfile)
        .then(function(response) {
            console.log("放回了什么:");
            console.log(response);
            if (response.toString() != "") {
                console.log("文件不是第一次存的");
                fileModel.updateFile(myfile, newfile);
            } else {
                fileModel.create(newfile);
                userModel.update({
                    "name": author
                }, {
                    $addToSet: {
                        "fileList": filename
                    }
                });
            }
        });
}

exports.deleteFile = function(req, res, next) {
    var author = req.session.user.name;
    var filename = req.body.filename;
    var myfile = {
        "author": author,
        "filename": filename
    };

    return fileModel.getDataByFilenameAndAuthor(myfile)
        .then(function(response) {
            if (response.toString() != "") {
                fileModel.remove(myfile);
                userModel.update({
                    "name": author
                }, {
                    $pull: {
                        "fileList": filename
                    }
                });
            }
        });
}

exports.deleteStarLeaf = function(req, res, next) {
    var author = req.session.user.name;
    var filename = req.body.filename;
    var myfile = {
        "author": author,
        "filename": filename
    };

    return fileModel.getDataByFilenameAndAuthor(myfile)
        .then(function(response) {
            if (response.toString() != "") {
                userModel.update({
                    "name": author
                }, {
                    $pull: {
                        "starList": filename
                    }
                });
            }
        });
}

exports.changeFilename = function(req, res, next) {
    var username = req.session.user.name;
    var oldFilename = req.params.filename;
    var newFilename = req.body.filename;

    var myfile = {
        "author": username,
        "filename": oldFilename
    };

    console.log("I am old filename: " + oldFilename);
    console.log("I am new filename: " + newFilename);
    var newfile = {
        "author": username,
        "filename": newFilename
    }

    return fileModel.getDataByFilenameAndAuthor(myfile)
        .then(function(response) {
            if (response.toString() != "") {
                fileModel.updateFile(myfile, newfile);
                userModel.update({
                    "name": username,
                    "fileList": oldFilename,
                    "$atomic": "true"
                }, {
                    $set: {
                        "fileList.$": newFilename
                    }
                });
            } else {
                res.json("haha!");
            }
        });

}

exports.cloneFile = function(req, res, next) {
    var username = req.session.user.name;
    var filename = req.body.filename;
    var author = req.body.author;
    var myfile = {
        "author": username,
        "filename": filename
    };
    var newfile = {
        "author": username,
        "filename": filename + "-" + author,
        "data": req.body
    };

    fileModel.getDataByFilenameAndAuthor(myfile)
        .then(function(response) {
            if (response.toString() != "") {
                console.log("文件不是第一次存的");
                fileModel.updateFile({
                    "author": username,
                    "filename": filename + "-" + author
                }, newfile);
            } else {
                fileModel.create(newfile);
                userModel.update({
                    "name": username
                }, {
                    $addToSet: {
                        "fileList": newfile.filename
                    }
                });
            }
        });
}

exports.starFile = function(req, res, next) {
    var username = req.session.user.name;
    var author = req.body.author;
    var filename = req.body.filename;

    console.log(username);
    console.log(author);
    console.log(filename);

    userModel.update({
        "name": username
    }, {
        $addToSet: {
            "starList": {
                "author": author,
                "filename": filename
            }
        }
    });

}

exports.isFileNew = function(req, res, next) {
    var filename = req.params.filename;
    var author = req.params.author;
    var findObj = {
        "filename": filename,
        "author": author
    };
    console.log("I am in isFileNew api!");
    fileModel.getDataByFilenameAndAuthor(findObj)
        .then(function(response) {
            var isFileNew = (response.toString() === "");
            console.log(isFileNew);
            res.json({
                "isFileNew": isFileNew
            });
        });
}

exports.getCreateJson = function(req, res, next) {
    res.json({
        "filename": "",
        "author": "",
        "tree": []
    });
}

