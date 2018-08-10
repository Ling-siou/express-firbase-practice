var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

var serviceAccount = require("./express-firebase-liao-firebase-adminsdk-8z2zx-efe9272fd9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://express-firebase-liao.firebaseio.com"
});

var fireData = admin.database();
fireData.ref('new!!').set({'01':'01', '02': '0002'}).then(function(){
    fireData.ref().once('value', function(snapshot){
        console.log(snapshot.val())
    })
})


app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

fireData.ref('todos').set({'title': '標題'})

//路由
app.get('/',function(req,res){

    fireData.ref('todos').once('value', function(snapshot){
        var data = snapshot.val();
        var title = data.title;
        res.render('index', {'title': title});  
    })
    
})

// 新增的邏輯

app.post('/addTodo', function(req, res){
    var content = req.body.content;
    var contentRef = fireData.ref('todos').push();
    contentRef.set({'content': content}).then(function(){
        fireData.ref('todos').once('value', function(snapshot){
            res.send(snapshot.val())
        })
    })

})


// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);