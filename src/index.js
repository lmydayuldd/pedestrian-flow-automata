import React from 'react';
import ReactDOM from 'react-dom';
import Automata from './components/automata';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Automata />, document.getElementById('root'));
registerServiceWorker();
