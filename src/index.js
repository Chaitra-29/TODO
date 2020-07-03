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
                content:"get milk",
                priority:1
            },
            {
                id:2,
                content:"get butter",
                priority:2
            }
        ]
    },{
        id:2,
        name:"home",
        items:[
            {
                id:1,
                content:"get pencil",
                priority:1
            },
            {
                id:2,
                content:"fix net",
                priority:2
            }
        ]
    }
];
let list = [];
app.use(express.json());
app.use(cors());
app.use("/static",express.static("public"))
app.use(express.urlencoded({ extended: true }));
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
            content: req.body.content,
            priority: req.body.priority
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
                    item.content = req.body.content;
                    item.priority= req.body.priority;
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