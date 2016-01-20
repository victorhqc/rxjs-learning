const Rx = require('rx');
const jQuery = require('jquerY');
import React from 'react';

class MainComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {profiles: [{}, {}, {}]};
        this.client_id = '9d84417b27ccc3d7c543';
        this.client_secret = '8fc14b5cb0db46b9816dcc665d2069c16b1e5cb9';
        this.linked = false;
    }

    randomizeUser(listUsers) {
        return listUsers[ Math.floor(Math.random() * listUsers.length) ];
    }

    emptyProfile() {
        return {};
    }

    refreshState(suggestion, index) {
        let profiles = this.state.profiles;
        profiles[index] = suggestion;
        this.setState({profiles: profiles});
    }

    observe() {
        const refreshButton = document.querySelector('.refresh');
        this.refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

        const requestStream = this.refreshClickStream.startWith('startup click')
        .map(() => {
            const randomOffset = Math.floor(Math.random()*500);
            return 'https://api.github.com/users?client_id=' + this.client_id +
                '&client_secret=' + this.client_secret +
                '&since=' + randomOffset;
        });

        this.responseStream = requestStream
        .flatMap((requestUrl) => {
            return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
        });
    }

    componentDidMount() {
        this.observe();
        this.linkButtons();
    }

    buildRows() {
        return this.state.profiles.map((profile, i) => {
            return <tr key={i}>
                    <td>{profile.id}</td>
                    <td><img src={profile.avatar_url} alt="profile" height="50" /></td>
                    <td><a href={profile.html_url}>{profile.html_url}</a></td>
                    <td>
                        <button className={'close' + i}>x</button>
                    </td>
                </tr>;
        });
    }

    linkButtons() {
        this.linked = true;
        this.state.profiles.map((profile, i) => {
            let closeButton = document.querySelector('.close' + i);
            let closeClickStream = Rx.Observable.fromEvent(closeButton, 'click');

            let suggestionStream = closeClickStream.startWith('startup click')
                .combineLatest(
                    this.responseStream,
                    (click, listUsers) => this.randomizeUser(listUsers)
                )
                .merge(this.refreshClickStream.map(this.emptyProfile))
                .startWith({});

            suggestionStream
                .subscribe(suggestion => this.refreshState(suggestion, i));
        });
    }

    render() {
        return (
            <div>
                <h1>RxJS</h1>
                <button className="refresh">
                    Refresh!
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Profile</th>
                            <th>URL</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.buildRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MainComponent;
