import * as React from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import {
    Stack, Dropdown, DetailsList, IDetailsListProps,
    PrimaryButton, Modal, IDropdownOption, IColumn, Selection, SelectionMode
} from 'office-ui-fabric-react';
import { completed, blocked, copy } from '../Buttons/Icon';
import { MANAGER_IP, COLUMNPro } from '../../static/const';
import { convertDuration, formatTimestamp, intermediateGraphOption } from '../../static/function';
import { EXPERIMENT, TRIALS } from '../../static/datamodel';
import { TableRecord } from '../../static/interface';
import Details from '../overview/Details';
import ChangeColumnComponent from '../Modal/ChangeColumnComponent';
import Compare from '../Modal/Compare';
import KillJob from '../Modal/Killjob';
import Customize from '../Modal/CustomizedTrial';
import '../../static/style/search.scss';
import '../../static/style/tableStatus.css';
import '../../static/style/logPath.scss';
import '../../static/style/search.scss';
import '../../static/style/table.scss';
import '../../static/style/button.scss';
import '../../static/style/openRow.scss';
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
echarts.registerTheme('my_theme', {
    color: '#3c8dbc'
});

interface TableListProps {
    pageSize: number;
    tableSource: Array<TableRecord>;
    columnList: Array<string>; // user select columnKeys
    changeColumn: (val: Array<string>) => void;
    trialsUpdateBroadcast: number;
}

interface TableListState {
    intermediateOption: object;
    modalVisible: boolean;
    isObjFinal: boolean;
    isShowColumn: boolean;
    selectRows: Array<any>;
    isShowCompareModal: boolean;
    selectedRowKeys: string[] | number[];
    intermediateData: Array<object>; // a trial's intermediate results (include dict)
    intermediateId: string;
    intermediateOtherKeys: Array<string>;
    isShowCustomizedModal: boolean;
    copyTrialId: string; // user copy trial to submit a new customized trial
    isCalloutVisible: boolean; // kill job button callout [kill or not kill job window]
    intermediateKeys: string[]; // intermeidate modal: which key is choosed.
    isExpand: boolean;
    modalIntermediateWidth: number;
    modalIntermediateHeight: number;
}

interface ColumnIndex {
    name: string;
    index: number;
}

const AccuracyColumnConfig: any = {
    name: 'Default metric',
    className: 'leftTitle',
    key: 'accuracy',
    fieldName: 'accuracy',
    minWidth: 200,
    isResizable: true,
    // sorter: (a, b, sortOrder) => {
    //     if (a.latestAccuracy === undefined) {
    //         return sortOrder === 'ascend' ? 1 : -1;
    //     } else if (b.latestAccuracy === undefined) {
    //         return sortOrder === 'ascend' ? -1 : 1;
    //     } else {
    //         return a.latestAccuracy - b.latestAccuracy;
    //     }
    // },
    onRender: (item): React.ReactNode => <div>{item.formattedLatestAccuracy}</div>
};

const SequenceIdColumnConfig: any = {
    name: 'Trial No.',
    key: 'sequenceId',
    fieldName: 'sequenceId',
    minWidth: 50,
    className: 'tableHead',
    // onColumnClick: this._onColumnClick
    // sorter: (a, b) => a.sequenceId - b.sequenceId
};

const IdColumnConfig: any = {
    name: 'ID',
    key: 'id',
    fieldName: 'id',
    minWidth: 150,
    isResizable: true,
    className: 'tableHead leftTitle',
    // sorter: (a, b) => a.id.localeCompare(b.id),
    onRender: (item): React.ReactNode => (
        <div>{item.id}</div>
    )
};

const StartTimeColumnConfig: any = {
    name: 'Start Time',
    key: 'startTime',
    fieldName: 'startTime',
    minWidth: 150,
    isResizable: true,
    // sorter: (a, b) => a.startTime - b.startTime,
    onRender: (record): React.ReactNode => (
        <span>{formatTimestamp(record.startTime)}</span>
    )
};

const EndTimeColumnConfig: any = {
    name: 'End Time',
    key: 'endTime',
    fieldName: 'endTime',
    minWidth: 150,
    isResizable: true,
    // sorter: (a, b, sortOrder) => {
    //     if (a.endTime === undefined) {
    //         return sortOrder === 'ascend' ? 1 : -1;
    //     } else if (b.endTime === undefined) {
    //         return sortOrder === 'ascend' ? -1 : 1;
    //     } else {
    //         return a.endTime - b.endTime;
    //     }
    // },
    onRender: (record): React.ReactNode => (
        <span>{formatTimestamp(record.endTime, '--')}</span>
    )
};

const DurationColumnConfig: any = {
    name: 'Duration',
    key: 'duration',
    fieldName: 'duration',
    minWidth: 150,
    isResizable: true,
    // sorter: (a, b) => a.duration - b.duration,
    onRender: (record): React.ReactNode => (
        <span className="durationsty">{convertDuration(record.duration)}</span>
    )
};

const StatusColumnConfig: any = {
    name: 'Status',
    key: 'status',
    fieldName: 'status',
    className: 'tableStatus',
    minWidth: 150,
    isResizable: true,
    onRender: (record): React.ReactNode => (
        <span className={`${record.status} commonStyle`}>{record.status}</span>
    ),
    // sorter: (a, b) => a.status.localeCompare(b.status),
    // filters: trialJobStatus.map(status => ({ text: status, value: status })),
    // onFilter: (value, record) => (record.status === value)
};

const IntermediateCountColumnConfig: any = {
    name: 'Intermediate result',
    dataIndex: 'intermediateCount',
    fieldName: 'intermediateCount',
    minWidth: 150,
    isResizable: true,
    // sorter: (a, b) => a.intermediateCount - b.intermediateCount,
    onRender: (record): React.ReactNode => (
        <span>{`#${record.intermediateCount}`}</span>
    )
};

class TableList extends React.Component<TableListProps, TableListState> {

    public intervalTrialLog = 10;
    public _trialId!: string;
    // public tables: Table<TableRecord> | null;

    constructor(props: TableListProps) {
        super(props);

        this.state = {
            intermediateOption: {},
            modalVisible: false,
            isObjFinal: false,
            isShowColumn: false,
            isShowCompareModal: false,
            selectRows: [],
            selectedRowKeys: [], // close selected trial message after modal closed
            intermediateData: [],
            intermediateId: '',
            intermediateOtherKeys: [],
            isShowCustomizedModal: false,
            isCalloutVisible: false,
            copyTrialId: '',
            intermediateKeys: ['default'],
            isExpand: false,
            modalIntermediateWidth: window.innerWidth,
            modalIntermediateHeight: window.innerHeight
        };
    }

    showIntermediateModal = async (id: string, event: React.SyntheticEvent<EventTarget>): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();
        const res = await axios.get(`${MANAGER_IP}/metric-data/${id}`);
        if (res.status === 200) {
            const intermediateArr: number[] = [];
            // support intermediate result is dict because the last intermediate result is
            // final result in a succeed trial, it may be a dict.
            // get intermediate result dict keys array
            let otherkeys: string[] = ['default'];
            if (res.data.length !== 0) {
                otherkeys = Object.keys(JSON.parse(res.data[0].data));
            }
            // intermediateArr just store default val
            Object.keys(res.data).map(item => {
                const temp = JSON.parse(res.data[item].data);
                if (typeof temp === 'object') {
                    intermediateArr.push(temp.default);
                } else {
                    intermediateArr.push(temp);
                }
            });
            const intermediate = intermediateGraphOption(intermediateArr, id);
            this.setState({
                intermediateData: res.data, // store origin intermediate data for a trial
                intermediateOption: intermediate,
                intermediateOtherKeys: otherkeys,
                intermediateId: id
            });
        }
        this.setState({ modalVisible: true });
    }

    // intermediate button click -> intermediate graph for each trial
    // support intermediate is dict
    selectOtherKeys = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        if (item !== undefined) {
            const value = item.text;
            const isShowDefault: boolean = value === 'default' ? true : false;
            const { intermediateData, intermediateId } = this.state;
            const intermediateArr: number[] = [];
            // just watch default key-val
            if (isShowDefault === true) {
                Object.keys(intermediateData).map(item => {
                    const temp = JSON.parse(intermediateData[item].data);
                    if (typeof temp === 'object') {
                        intermediateArr.push(temp[value]);
                    } else {
                        intermediateArr.push(temp);
                    }
                });
            } else {
                Object.keys(intermediateData).map(item => {
                    const temp = JSON.parse(intermediateData[item].data);
                    if (typeof temp === 'object') {
                        intermediateArr.push(temp[value]);
                    }
                });
            }
            const intermediate = intermediateGraphOption(intermediateArr, intermediateId);
            // re-render
            this.setState({
                intermediateKeys: [value],
                intermediateOption: intermediate
            });
        }
    }

    hideIntermediateModal = (): void => {
        this.setState({
            modalVisible: false
        });
    }

    hideShowColumnModal = (): void => {

        this.setState(() => ({ isShowColumn: false }));
    }

    // click add column btn, just show the modal of addcolumn
    addColumn = (): void => {
        // show user select check button
        this.setState(() => ({ isShowColumn: true }));
    }

    fillSelectedRowsTostate = (selected: number[] | string[], selectedRows: Array<TableRecord>): void => {
        this.setState({ selectRows: selectedRows, selectedRowKeys: selected });
    }
    // open Compare-modal
    compareBtn = (): void => {

        const { selectRows } = this.state;
        if (selectRows.length === 0) {
            alert('Please select datas you want to compare!');
        } else {
            this.setState({ isShowCompareModal: true });
        }
    }
    // close Compare-modal
    hideCompareModal = (): void => {
        // close modal. clear select rows data, clear selected track
        this.setState({ isShowCompareModal: false, selectedRowKeys: [], selectRows: [] });
    }

    // open customized trial modal
    setCustomizedTrial = (trialId: string, event: React.SyntheticEvent<EventTarget>): void => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            isShowCustomizedModal: true,
            copyTrialId: trialId
        });
    }

    closeCustomizedTrial = (): void => {
        this.setState({
            isShowCustomizedModal: false,
            copyTrialId: ''
        });
    }

    onWindowResize = (): void => {
        this.setState(() => ({
            modalIntermediateHeight: window.innerHeight,
            modalIntermediateWidth: window.innerWidth
        }));
    }

    private _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
        if (props) {
            return <Details detailsProps={props} />;
        }
        return null;
    };

    componentDidMount(): void {
        window.addEventListener('resize', this.onWindowResize);
    }

    _selection = new Selection({
        onSelectionChanged: (): void => {
            this.setState(() => ({ selectRows: this._selection.getSelection() }));
            console.info(this._selection.getSelection()); // eslint-disable-line
        }
    });

    render(): React.ReactNode {
        const {
            // pageSize,
            columnList } = this.props;
        const { intermediateKeys, modalIntermediateWidth, modalIntermediateHeight } = this.state;
        const tableSource: Array<TableRecord> = JSON.parse(JSON.stringify(this.props.tableSource));
        const { intermediateOption, modalVisible,
            isShowColumn,
            selectRows, isShowCompareModal,
            intermediateOtherKeys,
            isShowCustomizedModal, copyTrialId
        } = this.state;
        // [supportCustomizedTrial: true]
        const supportCustomizedTrial = (EXPERIMENT.multiPhase === true) ? false : true;
        const disabledAddCustomizedTrial = ['DONE', 'ERROR', 'STOPPED'].includes(EXPERIMENT.status);

        const showColumn: IColumn[] = [];

        // parameter as table column
        const parameterStr: Array<string> = [];
        if (tableSource.length > 0) {
            const trialMess = TRIALS.getTrial(tableSource[0].id);
            const trial = trialMess.description.parameters;
            const parameterColumn: Array<string> = Object.keys(trial);
            parameterColumn.forEach(value => {
                parameterStr.push(`${value} (search space)`);
            });
        }
        let showTitle = COLUMNPro; // eslint-disable-line @typescript-eslint/no-unused-vars
        showTitle = COLUMNPro.concat(parameterStr);

        // only succeed trials have final keys
        if (tableSource.filter(record => record.status === 'SUCCEEDED').length >= 1) {
            const temp = tableSource.filter(record => record.status === 'SUCCEEDED')[0].accuracy;
            if (temp !== undefined && typeof temp === 'object') {
                // concat default column and finalkeys
                const item = Object.keys(temp);
                // item: ['default', 'other-keys', 'maybe loss']
                if (item.length > 1) {
                    const want: Array<string> = [];
                    item.forEach(value => {
                        if (value !== 'default') {
                            want.push(value);
                        }
                    });
                    showTitle = COLUMNPro.concat(want);
                }
            }
        }
        for (const item of columnList) {
            const paraColumn = item.match(/ \(search space\)$/);
            let cc;
            if (paraColumn !== null) {
                cc = paraColumn.input;
            }
            switch (item) {
                case 'Trial No.':
                    showColumn.push(SequenceIdColumnConfig);
                    break;
                case 'ID':
                    showColumn.push(IdColumnConfig);
                    break;
                case 'Start Time':
                    showColumn.push(StartTimeColumnConfig);
                    break;
                case 'End Time':
                    showColumn.push(EndTimeColumnConfig);
                    break;
                case 'Duration':
                    showColumn.push(DurationColumnConfig);
                    break;
                case 'Status':
                    showColumn.push(StatusColumnConfig);
                    break;
                case 'Intermediate result':
                    showColumn.push(IntermediateCountColumnConfig);
                    break;
                case 'Default':
                    showColumn.push(AccuracyColumnConfig);
                    break;
                case 'Operation':
                    showColumn.push({
                        name: 'Operation',
                        key: 'operation',
                        fieldName: 'operation',
                        minWidth: 120, // TODO: need to test 120
                        isResizable: true,
                        onRender: (record: any) => {
                            const trialStatus = record.status;
                            const flag: boolean = (trialStatus === 'RUNNING' || trialStatus === 'UNKNOWN') ? false : true;
                            // const flag: boolean = (trialStatus === 'SUCCEEDED') ? false : true;
                            return (
                                <Stack id="detail-button" horizontal>
                                    {/* see intermediate result graph */}
                                    <PrimaryButton
                                        title="Intermediate"
                                        onClick={this.showIntermediateModal.bind(this, record.id)}
                                    >
                                        {completed}
                                    </PrimaryButton>
                                    {/* kill job */}
                                    {
                                        flag
                                            ?
                                            <PrimaryButton disabled={true} title="kill">
                                                {blocked}
                                            </PrimaryButton>
                                            :
                                            <KillJob trial={record} />
                                    }
                                    {/* Add a new trial-customized trial */}
                                    {
                                        supportCustomizedTrial
                                            ?
                                            <PrimaryButton
                                                title="Customized trial"
                                                onClick={this.setCustomizedTrial.bind(this, record.id)}
                                                disabled={disabledAddCustomizedTrial}
                                            >
                                                {copy}
                                            </PrimaryButton>
                                            :
                                            null
                                    }
                                </Stack>
                            );
                        },
                    });
                    break;
                case (cc):
                    // remove SEARCH_SPACE title
                    // const realItem = item.replace(' (search space)', '');
                    showColumn.push({
                        name: item.replace(' (search space)', ''),
                        key: item,
                        fieldName: item,
                        minWidth: 150,
                        onRender: (record: TableRecord) => {
                            const eachTrial = TRIALS.getTrial(record.id);
                            return (
                                <span>{eachTrial.description.parameters[item.replace(' (search space)', '')]}</span>
                            );
                        },
                    });
                    break;
                default:
                    // FIXME
                    alert('Unexpected column type');
            }
        }

        return (
            <Stack className="tableList">
                <div id="tableList">
                    {/* <Table
                        ref={(table: Table<TableRecord> | null): any => this.tables = table}
                        columns={showColumn}
                        rowSelection={rowSelection}
                        expandedRowRender={this.openRow}
                        dataSource={tableSource}
                        className="commonTableStyle"
                        scroll={{ x: 'max-content' }}
                        pagination={pageSize > 0 ? { pageSize } : false}
                    /> */}
                    <DetailsList
                        columns={showColumn}
                        items={tableSource}
                        setKey="set"
                        onRenderRow={this._onRenderRow}
                        selectionMode={SelectionMode.multiple}
                        selection={this._selection}
                    />
                    {/* Intermediate Result Modal */}
                    <Modal
                        isOpen={modalVisible}
                        onDismiss={this.hideIntermediateModal}
                    >
                        {
                            intermediateOtherKeys.length > 1
                                ?
                                <Stack className="selectKeys" styles={{ root: { width: 800 } }}>
                                    <Dropdown
                                        className="select"
                                        selectedKeys={intermediateKeys}
                                        onChange={this.selectOtherKeys}
                                        options={
                                            intermediateOtherKeys.map((key, item) => {
                                                return {
                                                    key: key, text: intermediateOtherKeys[item]
                                                };
                                            })
                                        }
                                        styles={{ dropdown: { width: 300 } }}
                                    />
                                </Stack>
                                :
                                <div />
                        }
                        <ReactEcharts
                            option={intermediateOption}
                            style={{
                                width: 0.5 * modalIntermediateWidth,
                                height: 0.7 * modalIntermediateHeight,
                                padding: 20
                            }}
                            theme="my_theme"
                        />

                    </Modal>

                </div>
                {/* Add Column Modal */}
                {
                    isShowColumn &&
                    // true && 
                    <ChangeColumnComponent
                        hideShowColumnDialog={this.hideShowColumnModal}
                        isHideDialog={!isShowColumn}
                        showColumn={showTitle}
                        selectedColumn={columnList}
                        changeColumn={this.props.changeColumn}
                    />
                }

                {/* compare trials based message */}
                {isShowCompareModal && <Compare compareStacks={selectRows} cancelFunc={this.hideCompareModal} />}
                {/* {true && <Compare compareStacks={selectRows} cancelFunc={this.hideCompareModal} />} */}
                {/* clone trial parameters and could submit a customized trial */}
                <Customize
                    visible={isShowCustomizedModal}
                    copyTrialId={copyTrialId}
                    closeCustomizeModal={this.closeCustomizedTrial}
                />
            </Stack>
        );
    }
}

export default TableList;