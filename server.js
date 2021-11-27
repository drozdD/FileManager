var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")
var hbs = require('express-handlebars');
app.use(express.static('static'))
const fs = require('fs');
var formidable = require('formidable');

//res.download

var context = {
    files: []
}

var dane = {}

app.get("/", function (req, res) {
    res.render('index.hbs', context);
})

app.get("/fileManager", function (req, res) {
    res.render('fileManager.hbs', context);
})

app.get("/info/:id", function (req, res) {
    var id = req.params.id
    for (var i = 0; i < context.files.length; i++) {
        if (context.files[i].id == id) {
            dane = context.files[i]
        }
    }

    res.redirect('/information');
})

app.get("/download/:id", function (req, res) {
    var id = req.params.id
    for (var i = 0; i < context.files.length; i++) {
        if (context.files[i].id == id) {
            link = "upload/" + context.files[i].downloadName
        }
    }
    res.download(link);
})

app.get("/del", function (req, res) {
    context.files = []
    res.redirect('/fileManager');
})

app.get("/del/:id", function (req, res) {
    var id = req.params.id
    for (var i = 0; i < context.files.length; i++) {
        if (context.files[i].id == id) {
            context.files.splice(i, 1);
        }
    }
    res.redirect('/fileManager');
})

app.get("/information", function (req, res) {
    res.render('info.hbs', dane);
})

app.post("/uploadFiles", function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.parse(req, function (err, fields, files) {
        console.log("----- przesłane formularzem pliki ------");


        if (Array.isArray(files.file)) {
            for (var i = 0; i < files.file.length; i++) {
                if (context.files[0]) {
                    id = context.files[context.files.length - 1].id + 1
                } else {
                    id = 1
                }
                var File = {
                    id: id,
                    name: files.file[i].name,
                    size: files.file[i].size,
                    type: files.file[i].type,
                    savedate: Date.now(),
                }
                if (File.name.slice(File.name.length - 3) == "png") {
                    File.img = "img/png.png"
                } else if (File.name.slice(File.name.length - 3) == "jpg" || File.name.slice(File.name.length - 4) == "jpeg") {
                    File.img = "img/jpg.png"
                } else if (File.name.slice(File.name.length - 3) == "mp3") {
                    File.img = "img/mp3.png"
                } else if (File.name.slice(File.name.length - 3) == "txt") {
                    File.img = "img/txt.png"
                } else {
                    File.img = "img/file.png"
                }

                var oldPath = files.file[i].path;
                var filename = oldPath.replace(/^.*[\\\/]/, '')
                var newPath = path.join(__dirname, 'upload') + '\\' + filename
                var rawData = fs.readFileSync(oldPath)
                File.downloadName = filename
                File.path = newPath

                fs.writeFile(newPath, rawData, function (err) {
                    if (err) console.log(err)
                })

                context.files.push(File)
            }
        }
        else {
            if (context.files[0]) {
                id = context.files[context.files.length - 1].id + 1
            } else {
                id = 1
            }
            var File = {
                id: id,
                name: files.file.name,
                size: files.file.size,
                type: files.file.type,
                savedate: Date.now(),
            }
            if (File.name.slice(File.name.length - 3) == "png") {
                File.img = "img/png.png"
            } else if (File.name.slice(File.name.length - 3) == "jpg" || File.name.slice(File.name.length - 4) == "jpeg") {
                File.img = "img/jpg.png"
            } else if (File.name.slice(File.name.length - 3) == "mp3") {
                File.img = "img/mp3.png"
            } else if (File.name.slice(File.name.length - 3) == "txt") {
                File.img = "img/txt.png"
            } else {
                File.img = "img/file.png"
            }

            var oldPath = files.file.path;
            var filename = oldPath.replace(/^.*[\\\/]/, '')
            var newPath = path.join(__dirname, 'upload') + '\\' + filename
            var rawData = fs.readFileSync(oldPath)
            File.downloadName = filename
            File.path = newPath

            fs.writeFile(newPath, rawData, function (err) {
                if (err) console.log(err)
            })

            context.files.push(File)

        }
        console.log(context);
        res.send('ok');
    });
})

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})