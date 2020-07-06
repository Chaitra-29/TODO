import React, { Component } from 'react';
import "./index.css"
import ListItem from './ListItem';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: '',
            toDoItem: '',
            priority: '',
            lid: '',
            editItem: false,
            editItemContent: ''
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', function (event) {
            switch(event.keyCode){
                case 46:
                case 8:
                    this.deleteItems();
                    break;
                case 37:
                    this.previous();
                    break;
                case 39:
                    this.next();
                    break;
            }
        }.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', function (event) {
            switch(event.keyCode){
                case 46:
                case 8:
                    this.deleteItems();
                    break;
                case 37:
                    if(Number(this.props.match.params.id) === 1 )
                    this.previous();
                    break;
                case 39:
                    if(Number(this.props.match.params.id) === 2 )
                    this.next();
                    break;
            }
        }.bind(this));
    }

    callAPI(pageNum) {
        if (this.state.lid !== pageNum) {
            fetch('http://localhost:9000/api/lists/' + pageNum)
                .then(response => response.json())
                .then((data) => {
                    this.setState({
                        apiResponse: data,
                        lid: pageNum,
                        checked: false
                    });
                    let checkboxes = document.getElementsByName('checkbox');
                    checkboxes.forEach((box) => {
                        if (box.checked) {
                            box.checked = false;
                        }
                    });
                });
        }
    }
    previous() {
        this.props.history.goBack();
        this.callAPI(Number(this.props.match.params.id) - 1)
    }

    next() {
        this.props.history.push('2')
        this.callAPI(2)
    }

    createItem() {
        if (this.state.toDoItem !== '') {
            fetch('http://localhost:9000/api/lists/' + this.state.lid + '/items', {
                method: 'post',
                body: JSON.stringify({
                    content: this.state.toDoItem.trim(),
                    priority: this.state.priority
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then(response => response.json())
                .then((data) => {
                    this.setState({
                        apiResponse: data,
                        toDoItem: '',
                        priority: ''
                    });
                })
        }
    }

    deleteItems() {
        let checkboxes = document.getElementsByName('checkbox');
        let ids = [];
        checkboxes.forEach((box) => {
            if (box.checked) {
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

    handleItemChange(event) {
        this.setState({
            priority: event.target.value,

        })
    }

    onChecked(event) {
        this.setState({
            checked: event.target.checked,
        })
    }

    renderItems() {
        if (this.state.apiResponse !== '') {
            const items = this.state.apiResponse.items;
            for (let i = 0; i < items.length; i++) {
                for (let j = i + 1; j < items.length; j++) {
                    if (items[i].priority > items[j].priority) {
                        let tmp = items[i];
                        items[i] = items[j];
                        items[j] = tmp;
                    }
                }
            }
            return items.map((element, index) => {
                return <li className='list-group-item' key={index}>
                    <input type='checkbox' className='form-check-input checkbox' name='checkbox' id={element.id} onClick={this.onChecked.bind(this)}></input>
                    <ListItem listId={this.state.lid} text={element.content} id={element.id} priority={element.priority} />
                </li >
            });
        }
    }




    render() {
        this.callAPI(this.props.match.params.id);
        return (
            <div style={{ paddingTop: '2rem' }} >
                <h3 className="text-center text-info pt-5">List {this.props.match.params.id}</h3>
                <div className='input-group mb-3'>
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="">Item and Priority</span>
                    </div>
                    <input type='text' className='form-control' name='content' value={this.state.toDoItem} onChange={this.handleChange.bind(this)} />
                    <input type="text" className="form-control" value={this.state.priority} onChange={this.handleItemChange.bind(this)} />

                    <div className='input-group-append'>
                        <input type='button' value='add' className='btn btn-info btn-md' onClick={this.createItem.bind(this)} />
                    </div>
                </div>

                <ul className='list-group'>
                    {this.renderItems()}
                </ul>
                <input type='button' value='delete' className='btn btn-info btn-md delete-button btn-danger' style={this.state.checked ? undefined : { display: "none" }} onClick={this.deleteItems.bind(this)} />

                <div className="float-right navigate-div">
                    <button className="btn btn-info btn-md navigate" onClick={this.previous.bind(this)} style={Number(this.props.match.params.id) === 1 ? { display: "none" } : undefined}>Previous</button>
                    <button className="btn btn-info btn-md navigate" onClick={this.next.bind(this)} style={Number(this.props.match.params.id) === 2 ? { display: "none" } : { marginRight: "1rem" }}>Next</button>
                </div>
            </div>
        );
    }
}

export default List;
