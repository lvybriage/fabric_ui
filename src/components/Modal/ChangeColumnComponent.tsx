import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { COLUMN_INDEX } from '../../static/const';

interface KillJobState {
    userSelectColumnList: string[]; // 支持改变，实时保存用户的操作
    originSelectColumnList: string[]; // 不支持改变，保留原始操作[用户各种选，然后放弃操作]
}

interface ChangeColumnProps {
    isHideDialog: boolean;
    showColumn: string[]; // all column List
    selectedColumn: string[]; // user selected column list
    changeColumn: (val: Array<string>) => void;
    hideShowColumnDialog: () => void;
}

interface CheckBoxItems {
    label: string;
    checked: boolean;
    onChange: () => void;
}
class ChangeColumnComponent extends React.Component<ChangeColumnProps, KillJobState> {

    constructor(props: ChangeColumnProps) {
        super(props);
        this.state = { userSelectColumnList: this.props.selectedColumn, originSelectColumnList: this.props.selectedColumn };
    }

    makeChangeHandler = (label: string): any => {
        return (ev: any, checked: boolean) => this._onCheckboxChange(ev, label, checked);
    }

    _onCheckboxChange = (ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, label: string, val?: boolean, ): void => {
        const source: string[] = JSON.parse(JSON.stringify(this.state.userSelectColumnList));
        if (val === true) {
            if (!source.includes(label)) {
                source.push(label);
                this.setState(() => ({ userSelectColumnList: source }));
            }
        } else {
            if (source.includes(label)) {
                // remove from source
                const result = source.filter((item) => item !== label);
                this.setState(() => ({ userSelectColumnList: result }));
            }
        }
    };

    saveUserSelectColumn = (): void => {
        // 保留用户选择的column 改变props
        const { userSelectColumnList } = this.state;
        const { showColumn } = this.props;
        // TODO: 保证顺次展示Trial No. | ID | Duration | Start Time | End Time | ...
        // ['startTime', 'endTime', 'Trial No.', 'ID', 'Duration']
        this.props.changeColumn(userSelectColumnList);
        this.hideDialog(); // 隐藏dialog
    }

    hideDialog = (): void => {
        this.props.hideShowColumnDialog();
    }

    // 用户放弃当前改动, 退出dialog
    cancelOption = () => {
        // 重新设置select column, 取消掉用户的操作
        const { originSelectColumnList } = this.state;
        this.setState({ userSelectColumnList: originSelectColumnList }, () => {
            this.hideDialog();
        });
    }

    render(): React.ReactNode {
        const { showColumn, isHideDialog } = this.props;
        const { userSelectColumnList } = this.state;
        const renderOptions: Array<CheckBoxItems> = [];
        showColumn.map(item => {
            if (userSelectColumnList.includes(item)) {
                // selected column name
                renderOptions.push({ label: item, checked: true, onChange: this.makeChangeHandler(item) });
            } else {
                renderOptions.push({ label: item, checked: false, onChange: this.makeChangeHandler(item) });
            }
        });
        return (
            <div>
                <div>Hello</div>
                <Dialog
                    hidden={isHideDialog} // required field!
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: 'Change table column',
                        subText: 'Your can chose which columns you want to see in the table.'
                    }}
                    modalProps={{
                        isBlocking: false,
                        styles: { main: { maxWidth: 450 } }
                    }}
                >
                    <div>
                        {renderOptions.map(item => {
                            return <Checkbox key={item.label} {...item} styles={{ root: { marginBottom: 8 } }} />
                        })}
                    </div>
                    <DialogFooter>
                        <PrimaryButton text="Save" onClick={this.saveUserSelectColumn} />
                        <DefaultButton text="Cancel" onClick={this.cancelOption} />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }
}

export default ChangeColumnComponent;