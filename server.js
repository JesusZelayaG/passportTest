const express = require('express');
const passport = require('passport')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;

const app = express();

app.use(express.urlencoded({extended:true}));

app.use(cookieParser('mi ultra hiper secreto'));
app.use(session({
    secret:'mi ultra hiper secreto',
    resave:true,
    saveUninitialized:true
}));
//secrete un secreto
//resave : cada peticion aunq no se modifique la session se vuelve a guardar
//saveUninitialized: cuando esta como verdadero si iniciamos una session en una peticion y no le guardamos nada aun asi se va a guardar
app.use(passport.initialize());

app.use(passport.session());

passport.use(new passportLocal(function(username, password, done){
    if(username==="jegz" && password === "123456"){
        return done(null, {id:1, name:"uriel"});
    }
    done(null, false);  
}))

//serializacion 
passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    done(null,{id:1, name:"uriel"})
});

app.set('view engine','ejs');

app.get("/",(req,res,next)=>{
    if(req.isAuthenticated()){return next()}
    res.redirect('/login');
},(rep,res) => {
    //acceso con session.
    //si se inicio session mostrara bienvenida
    res.send("hola");
    //redireccionara si no se ha iniciado session

})

app.post("/login",passport.authenticate('local',{
    successRedirect:"/",
    failureRedirect:"/login"
}))

app.get("/login",(rep,res) => {
    //recibira credenciales de inicio de session
    res.render("login");
})

app.listen(3000,()=>console.log("server started"));