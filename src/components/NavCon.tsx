import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MANAGER_IP, WEBUIDOC } from '../static/const';
import { verticalAlign } from '../static/style/commonSty'
import {
    Stack, initializeIcons, IconButton, IButtonProps, IIconProps, IContextualMenuProps, Dropdown, DefaultButton, Nav, IStackStyles,
    IStackTokens, IStackItemStyles, StackItem, sizeBoolean
} from 'office-ui-fabric-react';
import MediaQuery from 'react-responsive';
import { OVERVIEWTABS, DETAILTABS, NNILOGO } from './stateless-component/NNItabs';
// import LogDrawer from './Modal/LogDrawer';
// import ExperimentDrawer from './Modal/ExperimentDrawer';
import '../static/style/nav/nav.scss';
import '../static/style/icon.scss';

// 初始化icon
initializeIcons();
const emojiIcon: IIconProps = { iconName: 'Emoji2' };

interface NavState {
    version: string;
    menuVisible: boolean;
    navBarVisible: boolean;
    isdisabledFresh: boolean;
    isvisibleLogDrawer: boolean;
    isvisibleExperimentDrawer: boolean;
    activeKey: string;
}

class NavCon extends React.Component<{}, NavState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            version: '',
            menuVisible: false,
            navBarVisible: false,
            isdisabledFresh: false,
            isvisibleLogDrawer: false, // download button (nnimanager·dispatcher) click -> drawer
            isvisibleExperimentDrawer: false,
            activeKey: 'dispatcher'
        };
    }

    // to see & download experiment parameters
    showExpcontent = () => {
        this.setState({ isvisibleExperimentDrawer: true });
    }
    // to see & download nnimanager log
    showNNImanagerLog = () => {
        this.setState({ activeKey: 'nnimanager', isvisibleLogDrawer: true });
    }
    // to see & download dispatcher log
    showDispatcherLog = () => {
        this.setState({ isvisibleLogDrawer: true, activeKey: 'dispatcher' });
    }

    // refresh current page
    fresh = (event: React.SyntheticEvent<EventTarget>) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ isdisabledFresh: true }, () => {
            setTimeout(() => { this.setState({ isdisabledFresh: false }); }, 1000);
        });
    }

    onMenuClick?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, button?: IButtonProps) => void;
    iconbuttonss = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, button?: IButtonProps) => {
        console.info('ccc');
        console.info(ev);
        console.info(button);
    }

    render() {

        return (
            <Stack horizontal className="nav">
                <StackItem grow={30} styles={{ root: { minWidth: 300, display: 'flex', verticalAlign: 'center' } }}>
                    <span className="desktop-logo">{NNILOGO}</span>
                    <span className="left-right-margin">{OVERVIEWTABS}</span>
                    <span>{DETAILTABS}</span>
                </StackItem>
                <StackItem grow={70} className="veralign">
                    {/* TODO: min width 根据实际的最小宽度来定 */}
                    <Stack horizontal horizontalAlign="end" gap={30} styles={{ root: { minWidth: 400, color: '#fff' } }}>
                        {/* refresh button */}
                        <Stack.Item align="center">
                            <IconButton
                                className="iconButtons"
                                iconProps={{ iconName: 'sync' }}
                                title="refresh"
                                ariaLabel="refresh"
                                // disabled={true}
                                onClick={this.fresh}
                            />
                        </Stack.Item>

                        {/* <StackItem>
                            refresh selector
                        </StackItem> */}
                        {/* view button download log*/}
                        <IconButton
                            className="iconButtons"
                            menuProps={this.menuProps}
                            iconProps={{ iconName: 'View' }}
                            title="view"
                            ariaLabel="view"
                            onMenuClick={this.iconbuttonss}
                        // onMenuClick?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, button?: IButtonProps) => void;
                        />
                        {/* link to document button */}
                        <a href={WEBUIDOC} target="_blank" className="docIcon">
                            <IconButton
                                className="iconButtons"
                                iconProps={{ iconName: 'StatusCircleQuestionMark' }}
                                title="document"
                                ariaLabel="document"
                            />
                        </a>
                        {/* <a href={feed} target="_blank"> */}
                        <a href="#" target="_blank" className="feedback">
                            <IconButton
                                className="iconButtons"
                                iconProps={{ iconName: 'OfficeChat' }}
                                title="feedback"
                                ariaLabel="feedback"
                            // onClick={() => { window.open("http://github.com/nni") }}
                            />
                        </a>
                        {/* <span className="version">Version: {version}</span> */}
                        <span>v1.3</span>
                    </Stack>
                </StackItem>

            </Stack>
        );
    }

    // view and download experiment [log & experiment result]
    private menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'experiment',
                text: 'Experiment Parameters',
                iconProps: { iconName: 'Mail' },
                onClick: this.showExpcontent
            },
            {
                key: 'managerlog',
                text: 'NNImanager Logfile',
                iconProps: { iconName: 'Calendar' },
                onClick: this.showNNImanagerLog
            },
            {
                key: 'dispatcherlog',
                text: 'Dispatcher Logfile',
                iconProps: { iconName: 'Calendar' },
                onClick: this.showDispatcherLog
            }
        ],
        directionalHintFixed: true
    };
}

export default NavCon;
