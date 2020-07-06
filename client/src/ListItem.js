import React, { Component, createRef } from 'react';
class ListItem extends Component {
    li = createRef();
    constructor(props) {
        super(props);
        this.state = {
            lid: props.listId,
            text:props.text,
            priority:props.priority,
            id:props.id,
            editItem: false,
            editItemContent: ''
        };
        this.editItemClick = this.editItemClick.bind(this);
    }

    static getDerivedStateFromProps(props){
        return {
            lid: props.listId,
            text:props.text,
            priority:props.priority,
            id:props.id
        };
    }

    handleEditChange(event) {
        this.setState({
            editItemContent: event.target.value
        })
    }

    handleEditPriorityChange(event){
        this.setState({
            editPriority: event.target.value
        })
    }

    editItem() {
        fetch('http://localhost:9000/api/edit/lists/' + this.state.lid + '/items/' + this.li.current.id , {
            method: 'put',
            body: JSON.stringify({
                content: this.state.editItemContent,
                priority: this.state.editPriority
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => response.json())
            .then(() => {
                this.setState({ 
                    text:this.state.editItemContent,
                    priority:this.state.editPriority,
                    editItem: false 
            })
            window.location.reload();
        });
    }

    editItemClick(content,priority,isCancel) { 
        this.setState({
            editItem: isCancel === "cancel" ? false : true,
            editItemContent:content,
            editPriority:priority
        })
    }

    render(){
        return(
                <div id={this.state.id} ref={this.li} className='list-item'>
                    <div className='input-group mb-3' style={this.state.editItem ? undefined : {display:'none'}}  >
                        <input type='text' className='form-control' value={this.state.editItemContent || ''} onChange={this.handleEditChange.bind(this)} />
                        <input type="text" className="form-control" value={this.state.editPriority || ''} onChange={this.handleEditPriorityChange.bind(this)}/>
                        <div className='input-group-append'>
                            <input type='button'  className='btn btn-info btn-md' name={this.state.id} value='edit' onClick={() => this.editItem("edit")} />
                            <input type='button'  className='btn btn-info btn-md' name={this.state.id} value='cancel' onClick={() => this.editItemClick(this.state.text,this.state.priority,"cancel")}/>
                        </div>
                    </div>
                    <div className='justify-content-between align-items-center' style={this.state.editItem ? {display:'none'} : {display: "flex"}}>
                    <span>{this.state.text}</span>
                    <span className='badge badge-pill'>
                        <span style={{marginRight:'1rem'}}>{this.state.priority}</span>
                        <button type='button' className='btn' onClick={() => this.editItemClick(this.state.text,this.state.priority)}>
                            <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-pencil-square' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                                <path fillRule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z' />
                            </svg></button>
                    </span>
                    </div>
            </div >
        )
    }
}
export default ListItem;