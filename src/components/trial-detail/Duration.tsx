import * as React from 'react';
import ReactEcharts from 'echarts-for-react';
import { TableObj, EventMap } from '../../static/interface'; // eslint-disable-line no-unused-vars
import { filterDuration } from '../../static/function';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

interface Runtrial {
    trialId: string[];
    trialTime: number[];
}

interface DurationProps {
    source: Array<TableObj>;
    whichGraph: string;
}

interface DurationState {
    startDuration: number; // for record data zoom
    endDuration: number;
    durationSource: {};
}

class Duration extends React.Component<DurationProps, DurationState> {

    constructor(props: DurationProps) {

        super(props);
        this.state = {
            startDuration: 0, // for record data zoom
            endDuration: 100,
            durationSource: this.initDuration(this.props.source),
        };

    }

    initDuration = (source: Array<TableObj>): any => {
        const trialId: number[] = [];
        const trialTime: number[] = [];
        const trialJobs = source.filter(filterDuration);

        trialJobs.forEach(item => {
            trialId.push(item.sequenceId);
            trialTime.push(item.duration);
        });
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                bottom: '3%',
                containLabel: true,
                left: '1%',
                right: '4%'
            },
            dataZoom: [
                {
                    id: 'dataZoomY',
                    type: 'inside',
                    yAxisIndex: [0],
                    filterMode: 'empty',
                    start: 0,
                    end: 100
                },
            ],
            xAxis: {
                name: 'Time',
                type: 'value',
            },
            yAxis: {
                name: 'Trial',
                type: 'category',
                data: trialId
            },
            series: [{
                type: 'bar',
                data: trialTime
            }]
        };
    }

    getOption = (dataObj: Runtrial): any => {
        const { startDuration, endDuration } = this.state;
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                bottom: '3%',
                containLabel: true,
                left: '1%',
                right: '4%'
            },
            dataZoom: [
                {
                    id: 'dataZoomY',
                    type: 'inside',
                    yAxisIndex: [0],
                    filterMode: 'empty',
                    start: startDuration,
                    end: endDuration
                },
            ],
            xAxis: {
                name: 'Time',
                type: 'value',
            },
            yAxis: {
                name: 'Trial',
                type: 'category',
                data: dataObj.trialId
            },
            series: [{
                type: 'bar',
                data: dataObj.trialTime
            }]
        };
    }

    drawDurationGraph = (source: Array<TableObj>): void => {
        // why this function run two times when props changed?
        const trialId: string[] = [];
        const trialTime: number[] = [];
        const trialRun: Runtrial[] = [];
        const trialJobs = source.filter(filterDuration);
        Object.keys(trialJobs).map(item => {
            const temp = trialJobs[item];
            trialId.push(temp.sequenceId);
            trialTime.push(temp.duration);
        });
        trialRun.push({
            trialId: trialId,
            trialTime: trialTime
        });
        this.setState({
            durationSource: this.getOption(trialRun[0])
        });
    }

    componentDidMount(): void {
        const { source } = this.props;
        this.drawDurationGraph(source);
    }

    componentWillReceiveProps(nextProps: DurationProps): void {
        const { whichGraph, source } = nextProps;
        if (whichGraph === '3') {
            this.drawDurationGraph(source);
        }
    }

    shouldComponentUpdate(nextProps: DurationProps): boolean {

        const { whichGraph, source } = nextProps;
        if (whichGraph === '3') {
            const beforeSource = this.props.source;
            if (whichGraph !== this.props.whichGraph) {
                return true;
            }

            if (source.length !== beforeSource.length) {
                return true;
            }

            if (beforeSource[beforeSource.length - 1] !== undefined) {
                if (source[source.length - 1].duration !== beforeSource[beforeSource.length - 1].duration) {
                    return true;
                }
                if (source[source.length - 1].status !== beforeSource[beforeSource.length - 1].status) {
                    return true;
                }
            }
        }
        return false;
    }

    render(): React.ReactNode {
        const { durationSource } = this.state;
        const onEvents = { 'dataZoom': this.durationDataZoom };
        return (
            <div>
                <ReactEcharts
                    option={durationSource}
                    style={{ width: '95%', height: 412, margin: '0 auto' }}
                    theme="my_theme"
                    notMerge={true} // update now
                    onEvents={onEvents}
                />
            </div>
        );
    }

    private durationDataZoom = (e: EventMap): void => {
        if (e.batch !== undefined) {
            this.setState(() => ({
                startDuration: (e.batch[0].start !== null ? e.batch[0].start : 0),
                endDuration: (e.batch[0].end !== null ? e.batch[0].end : 100)
            }));
        }
    }
}

export default Duration;
