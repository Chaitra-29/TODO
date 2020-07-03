import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
let lists = [
    {
        id:1,
        name:"groceries",
        items:[
            {
                id:1,
                content:"get milk"
            },
            {
                id:2,
                content:"get butter"
            }
        ]
    },{
        id:2,
        name:"home",
        items:[
            {
                id:1,
                content:"get pencil"
            },
            {
                id:2,
                content:"fix net"
            }
        ]
    }
];
let list = [];
app.use(express.json());
app.use(cors());
app.use("/static",express.static("public"))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//GET Method
app.get('/',(req, res) => {
    res.render('index.ejs',{list});
});
//POST Method
app.post('/',(req, res) => {
    if(req.body.content !== ""){
        const id = list.length+1;
        const item = {
            "id":id,
            "content": req.body.content 
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
    if(req.body.content ){
        const id = req.params.id;
        list.map((item) =>{
            if(item.id == id){
                item.content = req.body.content 
            }
        });
    }
    res.redirect("/");
});
//DELETE Method
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






//New APIs
app.get('/api/lists',(req, res) => {
    res.send(lists);
});
app.get('/api/lists/:id',(req, res) => {
    const id = req.params.id;
    const todoList = lists.filter((list)=>{
        return list.id == id;
    })
    res.send(todoList[0]);
});

app.post('/api/lists',(req, res) => {
    const id = lists.length + 1;
    const newList = {
        "id":id,
        "name": req.body.name,
        "items":[] 
    };
    lists.push(newList);
    res.send(lists);
});

app.post('/api/lists/:id/items',(req, res) => {
    const id = req.params.id;
    const index = lists.findIndex((list)=>{
        return list.id == id;
    });
    if(index > -1){
        const itemId = lists[index].items.length + 1;
        const item = {
            id:itemId,
            content: req.body.content 
        };
        lists[index].items.push(item);
    }
    res.send(lists[index]);
});

app.put('/api/edit/lists/:lid/items/:id', (req, res) => {
    const id = req.params.id;
    const lid = req.params.lid;
    lists.map((list) =>{
        if(list.id == lid){
            list.items.map((item)=>{
                if(item.id == id){
                    item.content = req.body.content 
                }
            })
        }
    });
    res.send(lists);
});

app.delete('/api/delete/lists/:lid/items/:id', (req, res) => {
    const id = req.params.id;
    const lid = req.params.lid;
    lists.forEach((list) =>{
        if(list.id == lid){
            list.items.splice(list.items.findIndex((item) =>{
                return (item.id == id)
            }),1);
        }
    });
    res.send(lists);
});

app.delete('/api/delete/lists/:lid/items', (req, res) => {
    const reqIds = req.body.ids;
    const lid = req.params.lid;
    let index;
    lists.forEach((list,count) =>{
        if(list.id == lid){
            index = count;
            reqIds.forEach((reqId)=>{
                let index = list.items.findIndex((item)=>{
                    return item.id === reqId
                })
                if(index > -1){

                    list.items.splice(index,1)
                }
            });
        }
    });
    res.send(lists[index]);
});

app.listen(process.env.PORT, function () {
    console.log(`Example app listening on port ${process.env.PORT}!`)
});

export default app;