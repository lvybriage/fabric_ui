import * as React from 'react';
import {
    Stack, Pivot, PivotItem,
} from 'office-ui-fabric-react';
import { EXPERIMENT, TRIALS } from '../static/datamodel';
import { Trial } from '../static/model/trial'; // eslint-disable-line no-unused-vars
import DefaultPoint from './trial-detail/DefaultMetricPoint';
import Duration from './trial-detail/Duration';
import Title1 from './overview/Title1';
import Para from './trial-detail/Para';
import Intermediate from './trial-detail/Intermediate';
import { a } from './Buttons/Icon';
// import TableList from './trial-detail/TableList';
import '../static/style/trialsDetail.scss';
import '../static/style/search.scss';

interface TrialDetailState {
    tablePageSize: number; // table components val
    whichGraph: string;
    searchType: string;
    searchFilter: (trial: Trial) => boolean;
}

interface TrialsDetailProps {
    columnList: Array<string>;
    changeColumn: (val: Array<string>) => void;
    experimentUpdateBroacast: number;
    trialsUpdateBroadcast: number;
}

class TrialsDetail extends React.Component<TrialsDetailProps, TrialDetailState> {

    public interAccuracy = 0;
    public interAllTableList = 2;

    // public tableList!: TableList | null;
    // public searchInput: HTMLInputElement | null;

    private titleOfacc = (
        <Title1 text="Default metric" icon="3.png" />
    );

    private titleOfhyper = (
        <Title1 text="Hyper-parameter" icon="1.png" />
    );

    private titleOfDuration = (
        <Title1 text="Trial duration" icon="2.png" />
    );

    private titleOfIntermediate = (
        <div className="panelTitle">
            {a}
            <span>Intermediate result</span>
        </div>
    );

    constructor(props: TrialsDetailProps) {
        super(props);
        this.state = {
            tablePageSize: 20,
            whichGraph: '1',
            searchType: 'id',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
            searchFilter: trial => true
        };
    }

    // search a trial by trial No. & trial id
    searchTrial = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const targetValue = event.target.value;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let filter = (trial: Trial): boolean => true;
        if (!targetValue.trim()) {
            this.setState({ searchFilter: filter });
            return;
        }
        switch (this.state.searchType) {
            case 'id':
                filter = (trial): boolean => trial.info.id.toUpperCase().includes(targetValue.toUpperCase());
                break;
            case 'Trial No.':
                filter = (trial): boolean => trial.info.sequenceId.toString() === targetValue;
                break;
            case 'status':
                filter = (trial): boolean => trial.info.status.toUpperCase().includes(targetValue.toUpperCase());
                break;
            case 'parameters':
                // TODO: support filters like `x: 2` (instead of `"x": 2`)
                filter = (trial): boolean => JSON.stringify(trial.info.hyperParameters, null, 4).includes(targetValue);
                break;
            default:
                alert(`Unexpected search filter ${this.state.searchType}`);
        }
        this.setState({ searchFilter: filter });
    }

    handleTablePageSizeSelect = (value: string): void => {
        this.setState({ tablePageSize: value === 'all' ? -1 : parseInt(value, 10) });
    }

    handleWhichTabs = (activeKey: string): void => {
        this.setState({ whichGraph: activeKey });
    }

    // updateSearchFilterType = (value: string) => {
    //     // clear input value and re-render table
    //     if (this.searchInput !== null) {
    //         this.searchInput.value = '';
    //     }
    //     this.setState({ searchType: value });
    // }

    render(): React.ReactNode {
        // const { tablePageSize, whichGraph } = this.state;
        const { whichGraph } = this.state;
        // const { columnList, changeColumn } = this.props;
        const source = TRIALS.filter(this.state.searchFilter);
        const trialIds = TRIALS.filter(this.state.searchFilter).map(trial => trial.id);
        return (
            <div>
                <div className="trial" id="tabsty">
                    {/* <Pivot onChange={this.handleWhichTabs}> */}
                    <Pivot defaultSelectedKey={"3"}>
                        {/* <PivotItem tab={this.titleOfacc} key="1"> */}
                        <PivotItem headerText="Default metric" itemIcon="Recent" key="1">
                            <Stack className="graph">
                                <DefaultPoint
                                    trialIds={trialIds}
                                    visible={whichGraph === '1'}
                                    trialsUpdateBroadcast={this.props.trialsUpdateBroadcast}
                                />
                            </Stack>
                        </PivotItem>
                        {/* <PivotItem tab={this.titleOfhyper} key="2"> */}
                        <PivotItem headerText="Hyper-parameter" itemIcon="Recent" key="2">
                            <Stack className="graph">
                                <Para
                                    dataSource={source}
                                    expSearchSpace={JSON.stringify(EXPERIMENT.searchSpace)}
                                    whichGraph={whichGraph}
                                />
                            </Stack>
                        </PivotItem>
                        {/* <PivotItem tab={this.titleOfDuration} key="3"> */}
                        <PivotItem headerText="Duration" itemIcon="Recent" key="3">
                            <Duration source={source} whichGraph={whichGraph} />
                        </PivotItem>
                        {/* <PivotItem tab={this.titleOfIntermediate} key="4"> */}
                        <PivotItem headerText="Intermediate result" itemIcon="Recent" key="4">
                            <div className="graphContent">
                                <Intermediate source={source} whichGraph={whichGraph} />
                            </div>
                        </PivotItem>
                    </Pivot>
                </div>
                {/* trial table list */}
                <Title1 text="Trial jobs" icon="6.png" />
                {/* <Stack className="allList">
                    <Col span={10}>
                        <span>Show</span>
                        <Select
                            className="entry"
                            onSelect={this.handleTablePageSizeSelect}
                            defaultValue="20"
                        >
                            <Option value="20">20</Option>
                            <Option value="50">50</Option>
                            <Option value="100">100</Option>
                            <Option value="all">All</Option>
                        </Select>
                        <span>entries</span>
                    </Col> */}
                {/* <Col span={14} className="right">
                        <Button
                            className="common"
                            onClick={() => { if (this.tableList) { this.tableList.addColumn(); }}}
                        >
                            Add column
                        </Button>
                        <Button
                            className="mediateBtn common"
                            // use child-component tableList's function, the function is in child-component.
                            onClick={() => { if (this.tableList) { this.tableList.compareBtn(); }}}
                        >
                            Compare
                        </Button>
                        <Select defaultValue="id" className="filter" onSelect={this.updateSearchFilterType}>
                            <Option value="id">Id</Option>
                            <Option value="Trial No.">Trial No.</Option>
                            <Option value="status">Status</Option>
                            <Option value="parameters">Parameters</Option>
                        </Select>
                        <input
                            type="text"
                            className="search-input"
                            placeholder={`Search by ${this.state.searchType}`}
                            onChange={this.searchTrial}
                            style={{ width: 230 }}
                            ref={text => (this.searchInput) = text}
                        />
                    </Col>
                 */}
                {/* </Stack> */}
                {/* <TableList
                    pageSize={tablePageSize}
                    tableSource={source.map(trial => trial.tableRecord)}
                    columnList={columnList}
                    changeColumn={changeColumn}
                    trialsUpdateBroadcast={this.props.trialsUpdateBroadcast}
                    ref={(tabList) => this.tableList = tabList}
                /> */}
            </div>
        );
    }
}

export default TrialsDetail;
