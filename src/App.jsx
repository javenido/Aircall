import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import Header from './Header.jsx';
import ActivityDetails from './ActivityDetails.jsx';
import ActivityFeed from './ActivityFeed.jsx';

const App = () => {
  return (
    <Router>
      <div className='container'>
        <Header />
        <Switch>
          <Route render={() => < ActivityFeed />} exact path="/" />
          <Route render={() => < ActivityDetails />} path="/activity/:id" />
        </Switch>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

export default App;