import React, {Component} from 'react';
import ReactDOM from 'react-dom';

require('../less/app.less');

class App extends Component {
  render() {
    return (
      <div className="list">
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);