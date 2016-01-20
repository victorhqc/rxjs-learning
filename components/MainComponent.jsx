const Rx = require('rx');
const jQuery = require('jquerY');
import React from 'react';

class MainComponent extends React.Component {

    observe() {
        const refreshButton = document.querySelector('.refresh');
        const refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

        const requestStream = refreshClickStream
        .map(function() {
            const randomOffset = Math.floor(Math.random()*500);
            return 'https://api.github.com/users?since=' + randomOffset;
        })
        .startWith('https://api.github.com/users');

        const responseStream = requestStream
        .flatMap(function(requestUrl) {
            return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
        });

        responseStream.subscribe((response) => {
            console.log('response', response);
        });
    }

    componentDidMount() {
        this.observe();
    }

    render() {
        return (
            <div>
                <h1>RxJS</h1>
                <button className="refresh">
                    Refresh!
                </button>
            </div>
        );
    }
}

export default MainComponent;
