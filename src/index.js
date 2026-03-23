import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// ---------------- LOGGING MIDDLEWARE ----------------
const loggingMiddleWare = (req,res,next)=>{
    console.log(`${req.method} - ${req.url}`);
    next();
}

const finishedLogging = (req,res,next)=>{
    console.log("Finished Logging..");
    next();
}

app.use(loggingMiddleWare, finishedLogging);

// ---------------- DATA ----------------
const myUsers = [
    {id:1,username:'vijay',age:19},
    {id:2,username:'mithun',age:18},
    {id:3,username:'mithun',age:19},
    {id:4,username:'maneesh',age:20},
    {id:5,username:'Thanuj',age:19}
];

// ---------------- HOME ROUTE ----------------
app.get('/',(req,res)=>{
    res.send("Hello World !");
});

// ---------------- CREATE USER ----------------
app.post('/api/users',(req,res)=>{
    const newUser = {
        id: myUsers[myUsers.length-1].id + 1,
        ...req.body
    };

    myUsers.push(newUser);
    res.status(201).send(newUser);
});

// ---------------- GET USERS (WITH OPTIONAL FILTER) ----------------
app.get('/api/users',(req,res)=>{
    const {filter,value} = req.query;

    if(!filter || !value){
        return res.send(myUsers);
    }

    const filteredData = myUsers.filter((user)=>{
        return user[filter] == value;
    });

    res.send(filteredData);
});

// ---------------- GET USER BY ID ----------------
app.get('/api/users/:id',(req,res)=>{
    const id = parseInt(req.params.id);

    const user = myUsers.find(u => u.id === id);

    if(!user){
        return res.status(404).send({msg:"User Not Found"});
    }

    res.send(user);
});

// ---------------- PRODUCTS ----------------
app.get('/api/products',(req,res)=>{
    res.send([
        {name:"Chicken",price:300},
        {name:"Mutton",price:400}
    ]);
});

// ---------------- PUT UPDATE ----------------
app.put('/api/users/:id',(req,res)=>{
    const id = parseInt(req.params.id);

    const user = myUsers.find(u => u.id === id);

    if(!user){
        return res.status(404).send({msg:"User Not Found"});
    }

    user.username = req.body.username;
    user.age = req.body.age;

    res.send(user);
});

// ---------------- PATCH UPDATE ----------------
app.patch('/api/users/:id',(req,res)=>{
    const id = parseInt(req.params.id);

    const user = myUsers.find(u => u.id === id);

    if(!user){
        return res.status(404).send({msg:"User Not Found"});
    }

    if(req.body.username){
        user.username = req.body.username;
    }

    if(req.body.age){
        user.age = req.body.age;
    }

    res.send(user);
});

// ---------------- DELETE USER ----------------
app.delete('/api/users/:id',(req,res)=>{
    const id = parseInt(req.params.id);

    const index = myUsers.findIndex(u => u.id === id);

    if(index === -1){
        return res.sendStatus(404);
    }

    myUsers.splice(index,1);

    res.sendStatus(200);
});

// ---------------- SERVER ----------------
app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}...`);
});