import * as React from 'react';
import {Stack, StackItem} from 'office-ui-fabric-react';
import NavCon from './components/NavCon';
import './App.css';
interface AppProps {
    path: string;
}
class App extends React.Component<AppProps, {}> {

    constructor(props: AppProps) {
        super(props);
    }

    render() {

        return (
            <Stack className="nni" style={{ minHeight: window.innerHeight }}>
                <div className="header">
                    <div className="headerCon">
                        <NavCon />
                    </div>
                </div>
                <Stack className="contentBox">
                    <Stack className="content">
                        {this.props.children}
                    </Stack>
                </Stack>
            </Stack>
        );
    }
}

export default App;


