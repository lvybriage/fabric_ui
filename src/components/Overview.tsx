import * as React from 'react';
import { Stack, DefaultPalette, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import Title1 from './overview/Title1';
// import {stackItemStyles, contentPadding} from '../static/style/commonSty';
require('../static/style/overview.scss');

class Overview extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {

        return (
            <div className="overview">
                {/* status and experiment block */}
                {/* <Stack> */}
                <Stack>
                    <Title1 text="Experiment" icon="11.png" />
                    {/* <BasicInfo experimentUpdateBroadcast={experimentUpdateBroadcast} /> */}
                </Stack>
                <Stack horizontal>
                    <Stack.Item grow={100 / 3}>
                        
                    </Stack.Item>
                    <Stack.Item grow={100 / 3}>
                        Grow is 2
                    </Stack.Item>
                    <Stack.Item grow={100 / 3}>
                        Grow is 1
                    </Stack.Item>
                </Stack>
                {/* 
                <Stack className="overMessage">
                    {/* status graph 
                    <StackItem span={9} className="prograph overviewBoder cc">
                        <Title1 text="Status" icon="5.png" />
                        <Progressed
                            bestAccuracy={bestAccuracy}
                            concurrency={trialConcurrency}
                            changeConcurrency={this.changeConcurrency}
                            experimentUpdateBroadcast={experimentUpdateBroadcast}
                        />
                    </Col>
                    <Col span={7} className="overviewBoder cc">
                        <Title1 text="Search space" icon="10.png" />
                        <Row className="experiment">
                            <SearchSpace searchSpace={searchSpace} />
                        </Row>
                    </Col>
                    <Col span={8} className="overviewBoder cc">
                        <Title1 text="Profile" icon="4.png" />
                        <Row className="experiment">
                            <div className="experiment searchSpace">
                                <TrialInfo
                                    experimentUpdateBroadcast={experimentUpdateBroadcast}
                                    concurrency={trialConcurrency}
                                />
                            </div>
                        </Row>
                    </Col>
                </Row>
                {/* 
                <Row className="overGraph">
                    <Row className="top10bg">
                        <Col span={4} className="top10Title">
                            <Title1 text="Top10  trials" icon="7.png" />
                        </Col>
                        <Col
                            span={2}
                            className="title"
                            onClick={this.clickMaxTop}
                        >
                            <Title1 text="Maximal" icon="max.png" bgcolor={titleMaxbgcolor} />
                        </Col>
                        <Col
                            span={2}
                            className="title minTitle"
                            onClick={this.clickMinTop}
                        >
                            <Title1 text="Minimal" icon="min.png" bgcolor={titleMinbgcolor} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="overviewBoder">
                            <Row className="accuracy">
                                <Accuracy
                                    accuracyData={accuracyGraphData}
                                    accNodata={noDataMessage}
                                    height={324}
                                />
                            </Row>
                        </Col>
                        <Col span={16} id="succeTable">
                            <SuccessTable trialIds={bestTrials.map(trial => trial.info.id)} />
                        </Col>
                    </Row> */}
                {/* </Row> */}
            </div>
        );
    }
};

export default Overview;
