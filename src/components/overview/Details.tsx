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

    constructor(props: DetailsProps) {
        super(props);
        this.state = { isExpand: false };
    }

    render(): React.ReactNode {
        const { detailsProps } = this.props;
        const { isExpand } = this.state;
        return (
            <div>
                {/* TODO: 
                1. 点击选择button openRow正常展开 在再tr上点击这一行 openRow闭合 选择button依然高亮 
                2. 点击Operation里的button 依然会触发选择行的高亮
                测试修改用户名
                * git config user.name 'xxx'
                * 在x项目下修改名字, 并非全局
                */}
                <div onClick={() => this.setState(() => ({isExpand: !isExpand}))}><DetailsRow {...detailsProps} /></div>
                {/* <DetailsRow {...detailsProps} /> */}
                {isExpand && <OpenRow trialId={detailsProps.item.id}/>}
            </div>
        );
    }
}

export default Details;