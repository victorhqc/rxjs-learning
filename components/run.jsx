'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

import MainComponent from './MainComponent';


window.onload = () => {
    ReactDOM.render(<MainComponent />, document.getElementById('main'));
};
