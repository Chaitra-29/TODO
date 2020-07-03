import React, { Component } from 'react';
import "./index.css"
import ListItem from './ListItem';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: '',
            toDoItem: '',
            lid:'' ,
            editItem: false,
            editItemContent: ''
        };
    }

    callAPI() {
        if (this.state.lid !== this.props.match.params.id) {
            fetch('http://localhost:9000/api/lists/' + this.props.match.params.id)
                .then(response => response.json())
                .then((data) => {
                    this.setState({
                        apiResponse: data,
                        lid: this.props.match.params.id
                    })
                });
        }
    }

    createItem() {
        if(this.state.toDoItem !== ''){
        fetch('http://localhost:9000/api/lists/' + this.state.lid + '/items', {
            method: 'post',
            body: JSON.stringify({
                content: this.state.toDoItem
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => response.json())
            .then((data) => {
                this.setState({ 
                    apiResponse: data,
                    toDoItem: ''  
                });
            })
        }
    }
    
    deleteItems() {
        let checkboxes = document.getElementsByName('checkbox');
        let ids = [];
        checkboxes.forEach((box) => {
            if(box.checked){
                ids.push(Number(box.id));
            }
        });
        fetch('http://localhost:9000/api/delete/lists/' + this.state.lid + '/items', {
            method: 'delete',
            body: JSON.stringify({
                ids: ids
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => response.json())
            .then((data) => {
                this.setState({ 
                    apiResponse: data,
                    checked: false  
                });
                checkboxes.forEach((box) => {
                    box.checked = false;
                })
            })
    }

    handleChange(event) {
        this.setState({
            toDoItem: event.target.value,
        })
    }

    onChecked(event){
        this.setState({
            checked: event.target.checked,
        })
    }

    renderItems() {
        if (this.state.apiResponse !== '') {
            return this.state.apiResponse.items.map((element,index) => {
                return <li className='list-group-item' key={index}>
                    <input type='checkbox' className='form-check-input checkbox' name='checkbox' id={element.id} onClick={this.onChecked.bind(this)}></input>
                    <ListItem listId={this.state.lid} listName={this.props.match.params.listName} text={element.content} id={element.id}/> 
                </li >
            });
        }
    }

    render() {
        this.callAPI();
        return (
            <div style={{ paddingTop: '2rem' }} >
                <h3 className="text-center text-info pt-5">{this.props.match.params.listName}</h3>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' name='content' value={this.state.toDoItem} onChange={this.handleChange.bind(this)} />
                    <div className='input-group-append'>
                        <input type='button' value='add' className='btn btn-info btn-md' onClick={this.createItem.bind(this)} />
                    </div>
                </div>

                <ul className='list-group'>
                    {this.renderItems()}
                </ul>
                <input type='button' value='delete' className='btn btn-info btn-md delete-button' style={this.state.checked ? undefined : {display:"none"}} onClick={this.deleteItems.bind(this)} />
            </div>
        );
    }
}

export default List;
