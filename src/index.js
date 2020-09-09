import React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router, Route} from "react-router-dom";
import ClanDetail from "./ClanDetail";
import HomePage from "./HomePage";



class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path={"/"} exact component={HomePage}/>
                <Route path={"/clan"} component={ClanDetail}/>
            </Router>
        )
    }
}

render(
    <App/>,
    document.getElementById("root")
)