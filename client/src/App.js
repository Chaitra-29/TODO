import React, { Component } from "react";
import List from "./List";
import { BrowserRouter as Router,
  Switch,
  Route,
  Link} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/api/lists")
        .then(response => response.json())
        .then((data) => {
            this.setState({ apiResponse: data })
        })
  }

  componentDidMount() {
    this.callAPI();
  }

  renderLists(){
    if(this.state.apiResponse !== ""){
      return this.state.apiResponse.map((list,index)=>{
        return <li className="list-group-item d-flex justify-content-between align-items-center" key={index} >
          <Link to={`/${list.name}/${list.id}`} >{list.name}</Link>
        </li>
      })
    }
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="row justify-content-center align-items-center">
              <div className="col-md-6">
                  <div className="col-md-12">
                  <h3 className="text-center text-info pt-5">TODO</h3>
                    <Router>
                      <ul className="list-group">
                          {this.renderLists()}
                      </ul>
                      <Switch>
                        
                        <Route path={"/:listName/:id"} component={List}>
                          
                        </Route> 
                      </Switch>
                    </Router>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
