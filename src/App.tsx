import * as React from 'react';
import Nav from './components/Nav';
import './App.css';

class App extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
    }

    render() {
        
        return (
            <div>
                <Nav />
                <div>hello world</div>
                <div>{this.props.children}</div>
            </div>
        );
    }
}

export default App;


