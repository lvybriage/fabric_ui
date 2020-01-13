import * as React from 'react';
import { DetailsRow, IDetailsRowBaseProps } from 'office-ui-fabric-react';
import OpenRow from '../public-child/OpenRow';

interface DetailsProps {
    detailsProps: IDetailsRowBaseProps;
}

interface DetailsState {
    isExpand: boolean;
}

class Details extends React.Component<DetailsProps, DetailsState> {
    public cc!: HTMLDivElement | null;
    constructor(props: DetailsProps) {
        super(props);
        this.state = { isExpand: false };
    }

    isOpenExpandRow = () => {
        console.info('被点击了'); // eslint-disable-line
        const {isExpand} = this.state;
        this.setState(() => ({isExpand: !isExpand}));
    }

    render(): React.ReactNode {
        const { detailsProps } = this.props;
        const { isExpand } = this.state;
        console.info('isEx', isExpand); // eslint-disable-line
        
        return (
            <div>
                {/* TODO: 
                1. 点击选择button openRow正常展开 在再tr上点击这一行 openRow闭合 选择button依然高亮 
                2. 点击Operation里的button 依然会触发选择行的高亮
                */}
                {/* <div onClick={() => this.setState(() => ({isExpand: !isExpand}))}><DetailsRow {...detailsProps} /></div> */}
                {/* <DetailsRow {...detailsProps} /> */}
                {/* {isExpand && <OpenRow trialId={detailsProps.item.id}/>} */}

                <div ref={cc => (this.cc) = cc}><DetailsRow {...detailsProps}/></div>
                {/* <div onClick={this.isOpenExpandRow}><DetailsRow {...detailsProps} /></div> */}
                {isExpand && <OpenRow trialId={detailsProps.item.id}/>}
            </div>
        );
    }
}

export default Details;
