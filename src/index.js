import 'dotenv/config';
import express from 'express';

const app = express();
let list = [];
app.use(express.json())
app.use("/static",express.static("public"))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//GET Method
app.get('/',(req, res) => {
    res.render('index.ejs',{list});
});
//GET Method
app.get('/api/list',(req, res) => {
    res.send(list);
    //res.render('index.ejs',{list});
});
//POST Method
app.post('/',(req, res) => {
    if(req.body.content !== ""){
        const id = list.length+1;
        const item = {
            id:id,
            content: req.body.content 
        };
        list.push(item);
    }
    res.redirect("/");
});
//EDIT Method
app.route('/edit/:id').get((req, res) => {
    const id = req.params.id;
    res.render('edit.ejs',{ list: list, idTask: id });
    
}).post((req, res) => {
    const id = req.params.id;
    list.map((item) =>{
        if(item.id == id){
            item.content = req.body.content 
        }
    });
    res.redirect("/");
});
app.put('/api/list/edit/:id', (req, res) => {
    const id = req.params.id;
    list.map((item) =>{
        if(item.id == id){
            item.content = req.body.content 
        }
    });
    res.send(list);
});

//DELETE Method
app.delete('/api/list/delete/:id', (req, res) => {
    const id = req.params.id;
    list.splice(list.findIndex((item) =>{
        return (item.id == id)
    }),1);
    res.send(list);
});
app.route('/remove/:id').get((req, res) => {
    const id = req.params.id;
    const index = list.findIndex((item) =>{
        return (item.id == id)
    })
    if(index > -1){
        list.splice(index,1);
    }else{
        res.send(500, "Error!!");
    }
    res.redirect("/");
});


app.listen(process.env.PORT, function () {
    console.log(`Example app listening on port ${process.env.PORT}!`)
});

export default app;