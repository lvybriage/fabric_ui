import * as React from 'react';
import axios from 'axios';
import { Stack, Modal, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { MANAGER_IP } from '../../static/const';
import { EXPERIMENT, TRIALS } from '../../static/datamodel';
import { warining, errorBadge, completed } from '../Buttons/Icon';
// import { FormComponentProps } from 'antd/lib/form';
import './customized.scss';

// interface CustomizeProps extends FormComponentProps {
interface CustomizeProps {
    visible: boolean;
    copyTrialId: string;
    closeCustomizeModal: () => void;
}

interface CustomizeState {
    isShowSubmitSucceed: boolean;
    isShowSubmitFailed: boolean;
    isShowWarning: boolean;
    searchSpace: object;
    copyTrialParameter: object; // user click the trial's parameters
    customParameters: object; // customized trial, maybe user change trial's parameters
    customID: number; // submit customized trial succeed, return the new customized trial id
}

class Customize extends React.Component<CustomizeProps, CustomizeState> {

    constructor(props: CustomizeProps) {
        super(props);
        this.state = {
            isShowSubmitSucceed: false,
            isShowSubmitFailed: false,
            isShowWarning: false,
            searchSpace: EXPERIMENT.searchSpace,
            copyTrialParameter: {},
            customParameters: {},
            customID: NaN
        };
    }

    // [submit click] user add a new trial [submit a trial]
    // addNewTrial = () => {
    //     const { searchSpace, copyTrialParameter } = this.state;
    //     // get user edited hyperParameter, ps: will change data type if you modify the input val
    //     const customized = this.props.form.getFieldsValue();
    //     // true: parameters are wrong
    //     let flag = false;
    //     Object.keys(customized).map(item => {
    //         if (item !== 'tag') {
    //             // unified data type
    //             if (typeof copyTrialParameter[item] === 'number' && typeof customized[item] === 'string') {
    //                 customized[item] = JSON.parse(customized[item]);
    //             }
    //             if (searchSpace[item]._type === 'choice') {
    //                 if (searchSpace[item]._value.find((val: string | number) =>
    //                     val === customized[item]) === undefined) {
    //                     flag = true;
    //                     return;
    //                 }
    //             } else {
    //                 if (customized[item] < searchSpace[item]._value[0]
    //                     || customized[item] > searchSpace[item]._value[1]) {
    //                     flag = true;
    //                     return;
    //                 }
    //             }
    //         }
    //     });
    //     if (flag !== false) {
    //         // open the warning modal
    //         this.setState(() => ({ isShowWarning: true, customParameters: customized }));
    //     } else {
    //         // submit a customized job
    //         this.submitCustomize(customized);
    //     }

    // }

    warningConfirm = (): void => {
        this.setState(() => ({ isShowWarning: false }));
        const { customParameters } = this.state;
        this.submitCustomize(customParameters);
    }

    warningCancel = (): void => {
        this.setState(() => ({ isShowWarning: false }));
    }

    submitCustomize = (customized: Record<string, any>): void => {
        // delete `tag` key
        for (const i in customized) {
            if (i === 'tag') {
                delete customized[i];
            }
        }
        axios(`${MANAGER_IP}/trial-jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: customized
        })
            .then(res => {
                if (res.status === 200) {
                    this.setState(() => ({ isShowSubmitSucceed: true, customID: res.data.sequenceId }));
                    this.props.closeCustomizeModal();
                } else {
                    this.setState(() => ({ isShowSubmitFailed: true }));
                }
            })
            .catch(() => {
                this.setState(() => ({ isShowSubmitFailed: true }));
            });
    }

    closeSucceedHint = (): void => {
        // also close customized trial modal
        this.setState(() => ({ isShowSubmitSucceed: false }));
        this.props.closeCustomizeModal();
    }

    closeFailedHint = (): void => {
        // also close customized trial modal
        this.setState(() => ({ isShowSubmitFailed: false }));
        this.props.closeCustomizeModal();
    }

    componentDidMount(): void {
        const { copyTrialId } = this.props;
        if (copyTrialId !== undefined && TRIALS.getTrial(copyTrialId) !== undefined) {
            const originCopyTrialPara = TRIALS.getTrial(copyTrialId).description.parameters;
            this.setState(() => ({ copyTrialParameter: originCopyTrialPara }));
        }
    }

    componentWillReceiveProps(nextProps: CustomizeProps): void {
        const { copyTrialId } = nextProps;
        if (copyTrialId !== undefined && TRIALS.getTrial(copyTrialId) !== undefined) {
            const originCopyTrialPara = TRIALS.getTrial(copyTrialId).description.parameters;
            this.setState(() => ({ copyTrialParameter: originCopyTrialPara }));
        }
    }

    render(): React.ReactNode {
        const { closeCustomizeModal, visible } = this.props;
        // const { isShowSubmitSucceed, isShowSubmitFailed, isShowWarning, customID, copyTrialParameter } = this.state;
        const { isShowSubmitSucceed, isShowSubmitFailed, isShowWarning, customID } = this.state;
        // const {
        //     form: { getFieldDecorator },
        //     // form: { getFieldDecorator, getFieldValue },
        // } = this.props;
        const warning = 'The parameters you set are not in our search space, this may cause the tuner to crash, Are'
            + ' you sure you want to continue submitting?';
        return (
            <Stack>
                {/* new code start */}
                <Dialog
                    hidden={true} // required field!
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: 'Customized trial setting',
                        subText: 'Your can chose which columns you want to see in the table.'
                    }}
                    modalProps={{
                        isBlocking: false,
                        styles: { main: { maxWidth: 450 } }
                    }}
                >
                    Hello world
                    <DialogFooter>
                        <PrimaryButton text="Submit" />
                        {/* <PrimaryButton text="Submit" onClick={this.addNewTrial} /> */}
                        <DefaultButton text="Cancel" onClick={this.props.closeCustomizeModal} />
                    </DialogFooter>
                </Dialog>
                {/* new code end */}
                {/* form: search space */}
                {/* <Modal
                    isOpen={visible}
                    onDismiss={closeCustomizeModal} 
                centered={true}
                >
                    {/* search space form */}
                {/* <Stack className="hyper-box">
                        <Form>
                            {
                                Object.keys(copyTrialParameter).map(item => (
                                    <Stack key={item} className="hyper-form">
                                        <StackItem grow={40} className="title">{item}</StackItem>
                                        <StackItem grow={60} className="inputs">
                                            <FormItem key={item} style={{ marginBottom: 0 }}>
                                                {getFieldDecorator(item, {
                                                    initialValue: copyTrialParameter[item],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </StackItem>
                                    </Stack>
                                )
                                )
                            }
                            <Stack key="tag" className="hyper-form tag-input">
                                <StackItem grow={9} className="title">Tag</StackItem>
                                <StackItem grow={15} className="inputs">
                                    <FormItem key="tag" style={{ marginBottom: 0 }}>
                                        {getFieldDecorator('tag', {
                                            initialValue: 'Customized',
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </StackItem>
                            </Stack>
                        </Form>
                    </Stack>
                     */}
                {/* <Stack className="modal-button">
                        <PrimaryButton
                            className="tableButton distance"
                        // onClick={this.addNewTrial}
                        >
                            Submit
                        </PrimaryButton>
                        <PrimaryButton
                            className="tableButton cancelSty"
                            onClick={this.props.closeCustomizeModal}
                        >
                            Cancel
                        </PrimaryButton>
                    </Stack> */}
                {/* control button */}
                {/* </Modal> */}
                {/* clone: prompt succeed or failed */}
                <Modal
                    isOpen={isShowSubmitSucceed}
                // centered={true}
                >
                    <Stack className="resubmit">
                        <Stack>
                            <h2 className="title">
                                <span>{completed}<b>Submit successfully</b></span>
                            </h2>
                            <div className="hint">
                                <span>You can find your customized trial by Trial No.{customID}</span>
                            </div>
                        </Stack>
                        <Stack className="modal-button">
                            <DefaultButton
                                className="tableButton cancelSty"
                                onClick={this.closeSucceedHint}
                            >
                                OK
                            </DefaultButton>
                        </Stack>
                    </Stack>
                </Modal>
                <Modal
                    isOpen={isShowSubmitFailed}
                >
                    <Stack className="resubmit">
                        <Stack>
                            <h2 className="title">
                                <span>{errorBadge}Submit Failed</span>
                            </h2>
                            <div className="hint">
                                <span>Unknown error.</span>
                            </div>
                        </Stack>
                        <Stack className="modal-button">
                            <DefaultButton
                                className="tableButton cancelSty"
                                onClick={this.closeFailedHint}
                            >
                                OK
                            </DefaultButton>
                        </Stack>
                    </Stack>
                </Modal>
                {/* hyperParameter not match search space, warning modal */}
                <Modal
                    isOpen={isShowWarning}
                >
                    <Stack className="resubmit">
                        <Stack>
                            <h2 className="title">
                                <span>{warining}Warning</span>
                            </h2>
                            <div className="hint">
                                <span>{warning}</span>
                            </div>
                        </Stack>
                        <Stack className="modal-button center">
                            <DefaultButton
                                className="tableButton cancelSty distance"
                                onClick={this.warningConfirm}
                            >
                                Confirm
                            </DefaultButton>
                            <DefaultButton
                                className="tableButton cancelSty"
                                onClick={this.warningCancel}
                            >
                                Cancel
                            </DefaultButton>
                        </Stack>
                    </Stack>
                </Modal>
            </Stack>

        );
    }
}

// export default Form.create<FormComponentProps>()(Customize);
export default Customize;