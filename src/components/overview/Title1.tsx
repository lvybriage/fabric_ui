import * as React from 'react';
import '../../static/style/overviewTitle.scss';
interface Title1Props {
    text: string;
    icon?: string;
    bgcolor?: string;
}

class Title1 extends React.Component<Title1Props, {}> {

    constructor(props: Title1Props) {
        super(props);
    }

    render(): React.ReactNode {
        const { text, icon, bgcolor } = this.props;
        return (
            <div className="panelTitle" style={{ backgroundColor: bgcolor }}>
                <img src={require(`../../static/img/icon/${icon}`)} alt="icon" />
                <span>{text}</span>
            </div>
        );
    }
}

export default Title1;