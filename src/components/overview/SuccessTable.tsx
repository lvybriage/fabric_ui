import * as React from 'react';

interface SuccessTableProps {
    trialIds: string[];
}

class SuccessTable extends React.Component<SuccessTableProps, {}> {
    constructor(props: SuccessTableProps) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="tabScroll" >
                table
            </div>
        );
    }
}

export default SuccessTable;
