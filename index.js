var fallback=require("express-history-api-fallback"),
express=require("express"),
app=express(),
root=__dirname;
app.use(express.static(root)),
app.use(fallback("index.html",{root:root}));
var server=require("http").createServer(app);
server.listen(8081,function(){console.log("Listening on 8081")});
