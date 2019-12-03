import { IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
const stackItemStyles: IStackItemStyles = {
    root: {
        // alignItems: 'center',
        // background: DefaultPalette.themePrimary,
        // color: DefaultPalette.white,
        display: 'flex',
        // height: 50,
        //   justifyContent: 'center'
    }
};

const contentPadding: IStackStyles = {
    root: {
        padding: '0 20px',
    }
};
export { stackItemStyles, contentPadding };