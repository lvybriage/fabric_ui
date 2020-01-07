import * as React from 'react';
import {
    Stack, FocusTrapCallout, DefaultButton,
    FocusZone,
    PrimaryButton, getTheme, mergeStyleSets, FontWeights
} from 'office-ui-fabric-react';
import { killJob } from '../../static/function';
import { blocked } from '../Buttons/Icon';

const theme = getTheme();
const styles = mergeStyleSets({
    buttonArea: {
        verticalAlign: 'top',
        display: 'inline-block',
        textAlign: 'center',
        margin: '0 100px',
        minWidth: 130,
        height: 32
    },
    callout: {
        maxWidth: 300
    },
    header: {
        padding: '18px 24px 12px'
    },
    title: [
        theme.fonts.xLarge,
        {
            margin: 0,
            color: theme.palette.neutralPrimary,
            fontWeight: FontWeights.semilight
        }
    ],
    inner: {
        height: '100%',
        padding: '0 24px 20px'
    },
    actions: {
        position: 'relative',
        marginTop: 20,
        width: '100%',
        whiteSpace: 'nowrap'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 24px 24px'
    },
    subtext: [
        theme.fonts.small,
        {
            margin: 0,
            color: theme.palette.neutralPrimary,
            fontWeight: FontWeights.semilight
        }
    ]
});

interface KillJobState {
    isCalloutVisible: boolean;
}

interface KillJobProps {
    trial: any;
}

class KillJob extends React.Component<KillJobProps, KillJobState> {

    private _menuButtonElement!: HTMLElement | null;
    constructor(props: KillJobProps) {
        super(props);
        this.state = { isCalloutVisible: false };
    }

    _onDismiss = (): void => {
        this.setState(() => ({ isCalloutVisible: false }));
    }

    _onKill = (): void => {
        this.setState({isCalloutVisible: false }, () => {
            const { trial } = this.props;
            killJob(trial.key, trial.id, trial.status);
        });
    }

    render(): React.ReactNode {
        const { isCalloutVisible } = this.state;
        
        return (
            <div>
                <div className={styles.buttonArea} ref={(menuButton): any => (this._menuButtonElement = menuButton)}>
                    {/* <DefaultButton onClick={this._onDismiss} text={isCalloutVisible ? 'Hide FocusTrapCallout' : 'Show FocusTrapCallout'} /> */}
                    <PrimaryButton title="kill">{blocked}</PrimaryButton>
                </div>
                {isCalloutVisible ? (
                    <div>
                        <FocusTrapCallout
                            role="alertdialog"
                            className={styles.callout}
                            gapSpace={0}
                            target={this._menuButtonElement}
                            onDismiss={this._onDismiss}
                            setInitialFocus={true}
                        >
                            <div className={styles.header}>
                                <p className={styles.title}>Callout title here</p>
                            </div>
                            <div className={styles.inner}>
                                <div>
                                    <p className={styles.subtext}>
                                        Content is wrapped in a FocusTrapZone so that user cannot accidently tab out of this callout.
                                    </p>
                                </div>
                            </div>
                            <FocusZone>
                                <Stack className={styles.buttons} gap={8} horizontal>
                                    <PrimaryButton onClick={this._onDismiss}>Cancel</PrimaryButton>
                                    <DefaultButton onClick={this._onKill}>Kill</DefaultButton>
                                </Stack>
                            </FocusZone>
                        </FocusTrapCallout>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default KillJob;