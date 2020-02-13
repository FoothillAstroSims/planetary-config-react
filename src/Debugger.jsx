import React from 'react';


let debugvar = null;

const classNameForTable = `floating_debug_table`;
const classNameForTableHead = `floating_debug_thead`;
const classNameForTableBody = `floating_debug_tbody`
const classNameForTableData = `floating_debug_td`;
const classNameForTableDataNames = `${classNameForTableData} floating_debug_td_names`;
const classNameForTableDataValues = `${classNameForTableData} floating_debug_td_values`;
const classNameForTableRow = `floating_debug_tr`;
const classNameForTableHeadCell = `floating_debug_th`;


export default class GlobalDebugger
{
    static set(name, val) {
        if (debugvar == null) {
            console.warn("GlobalDebugger does not have a reference to a DebuggerTable");
            return;
        }
        debugvar.set(name, val);
    }
}


export class DebuggerTable extends React.Component
{
    constructor(props) {
        super(props);
        this.set = this.set.bind(this);
        this.state = {
            table : {}
        }
    }

    render() {
        const entrylist = Object.entries(this.state.table).map((entry) => {
            return (
                <DebuggerEntry
                    key={entry[0]}
                    name={entry[0]}
                    value={entry[1]} />
            );
        });
        return (
            <table className={classNameForTable}>
                <thead className={classNameForTableHead}>
                    <tr className={classNameForTableRow}>
                        <th className={classNameForTableHeadCell} colSpan="2">
                            The Global Debugger
                        </th>
                    </tr>
                </thead>
                <tbody className={classNameForTableBody}>
                    {entrylist}
                </tbody>
            </table>
        );
    }

    componentDidMount() {
        debugvar = this;
        console.log("Global Debugger component has been mounted can now be used.");
    }

    set(name, val) {
        let nextTable = {...this.state.table};
        nextTable[`${name}`] = `${val}`;
        this.setState({table: nextTable});
    }
}


class DebuggerEntry extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr className={classNameForTableRow}>
                <td className={classNameForTableDataNames}>
                    {this.props.name}
                </td>
                <td className={classNameForTableDataValues}>
                    {this.props.value}
                </td>
            </tr>
        );
    }
}
