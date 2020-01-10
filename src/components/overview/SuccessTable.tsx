import * as React from 'react';
import PropTypes from 'prop-types';
import { DetailsList, IDetailsListProps } from 'office-ui-fabric-react';
import DefaultMetric from '../public-child/DefaultMetric';
import Details from './Details';
import { convertDuration } from '../../static/function';
import { TRIALS } from '../../static/datamodel';
// import '../../static/style/succTable.scss';
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
    }

    private _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
        if (props) {
            return <Details detailsProps={props} />;
        }
        return null;
    };

    render(): React.ReactNode {

        const columns = [
            {
                name: 'Trial No.',
                key: 'sequenceId',
                fieldName: 'sequenceId',
                minWidth: 80,
                maxWidth: 80,
                onRender(item: any) {
                    return <div>{item.sequenceId}</div>
                }
            }, {
                name: 'ID',
                key: 'id',
                fieldName: 'id',
                minWidth: 80,
                className: 'tableHead leftTitle',
                render: (item: any) => {
                    return (
                        <div>{item.id}</div>
                    );
                },
            }, {
                name: 'Duration',
                key: 'duration',
                minWidth: 140,
                fieldName: 'duration',
                render: (item: any) => {
                    return (
                        <div className="durationsty"><div>{convertDuration(item.duration)}</div></div>
                    );
                },
            }, {
                name: 'Status',
                key: 'status',
                minWidth: 150,
                fieldName: 'status',
                render: (item: any) => {
                    return (
                        <div className={`${item.status} commonStyle`}>{item.status}</div>
                    );
                }
            }, {
                name: 'Default metric',
                key: 'accuracy',
                fieldName: 'accuracy',
                minWidth: 100,
                render: (item: any) => {
                    return (
                        <DefaultMetric trialId={item.id} />
                    );
                }
            }
        ];
        
        return (
            <div id="succTable">
                {/* 只能render出column 数据render不上 */}
                {/* done fixed: add fieldName 属性 */}
                {/* TODO: lineHeight question */}
                <DetailsList
                    columns={columns}
                    items={TRIALS.table(this.props.trialIds)}
                    setKey="set"
                    onRenderRow={this._onRenderRow}
                />
            </div>
        );
    }
}

export default SuccessTable;
