import * as React from 'react';
import Table from 'rc-table';
import { DetailsList, DetailsRow, IDetailsListProps, IDetailsRowProps, IColumn, DetailsListLayoutMode } from 'office-ui-fabric-react/lib/DetailsList';
import { createListItems, IExampleItem } from '@uifabric/example-data';
import DefaultMetric from '../public-child/DefaultMetric';
import OpenRow from '../public-child/OpenRow';
import { convertDuration } from '../../static/function';
import { TRIALS } from '../../static/datamodel';
import '../../static/style/succTable.scss';
import { hiddenContentStyle } from 'office-ui-fabric-react';
import '../../static/style/openRow.scss';
interface SuccessTableProps {
    trialIds: string[];
}

interface SuccessTableState {
    isExpand: boolean;
}

class SuccessTable extends React.Component<SuccessTableProps, SuccessTableState> {
    constructor(props: SuccessTableProps) {
        super(props);
        this.state = { isExpand: false };
    }

    private _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
        if (props) {
            const { isExpand } = this.state;
            // const [isExpand, setIsExpand] = React.useState(false);
            // console.info(props); // eslint-disable-line
            return (
                <div>
                    <DetailsRow
                        {...props}
                        // onClick={() => this.setState(() => ({isExpand: !isExpand}))} // eslint-disable-line
                        // collapseAllVisibility={}
                        // {...divProps}
                        onRenderCheck={(props) => <div onClick={() => this.setState(() => ({ isExpand: !isExpand }))}>＋</div>}
                    >
                    </DetailsRow>
                    {isExpand && <OpenRow trialId={props.item.id} />}
                </div>
            );
        }
        return null;
    };
    /* test */
    private _onRenderRowCopy: IDetailsListProps['onRenderRow'] = props => {
        if (props) {
            console.info(props); // eslint-disable-line
            return (
                <div>
                    <DetailsRow
                        {...props}
                    >
                    </DetailsRow>
                </div>
            );
        }
        return null;
    };

    render(): React.ReactNode {
        /* test */
        const columns = [
            {
                name: 'Trial No.',
                key: 'sequenceId',
                fieldName: 'sequenceId',
                minWidth: 140,
                onRender() {
                    return <div>hello</div>
                }
            }, {
                name: 'ID',
                key: 'id',
                fieldName: 'id',
                minWidth: 60
            }, {
                name: 'Duration',
                key: 'duration',
                minWidth: 140,
                fieldName: 'duration'
            }, {
                name: 'Status',
                key: 'status',
                minWidth: 150,
                fieldName: 'status'
            }, {
                name: 'Default metric',
                key: 'accuracy',
                fieldName: 'accuracy',
                minWidth: 100,
            }
        ];
        {/* test */ }
        const source = [
            {
                sequenceId: 1,
                id: 'qwe12',
                duration: 1300,
                status: 'succeed',
                accuracy: 0.9876
            },
            {
                sequenceId: 2,
                id: 'abc12',
                duration: 1300,
                status: 'succeed',
                accuracy: 0.96
            },
            {
                sequenceId: 3,
                id: 'ccc66',
                duration: 1300,
                status: 'succeed',
                accuracy: 0.98
            },
        ];

        // const source = JSON.parse(JSON.stringify(TRIALS.table(this.props.trialIds)));
        // let useSource = [];
        // const showColumn = ['sequenceId', 'id', 'duration', 'status', 'accuracy'];

        // source.forEach(element => {
        //     for(const key in element){
        //         if(showColumn.includes(key)){
        //             useSource.push({key: element[key]});
        //         }
        //     }
        // });
        return (
            <div>
                <DetailsList
                    items={TRIALS.table(this.props.trialIds)}
                    setKey="set"
                    onRenderRow={this._onRenderRow}
                />
                {/* test */}
                {/* 只能render出column 数据render不上 */}
                <DetailsList
                    columns={columns}
                    items={source}
                    setKey="set"
                    onRenderRow={this._onRenderRowCopy}
                />

            </div>
        );
    }
}

export default SuccessTable;
