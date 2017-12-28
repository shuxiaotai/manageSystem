import React, { Component } from 'react';
import LogTable from './LogTable';

class Log extends Component {
    render() {
        return(
            <div style={{ paddingLeft:29, marginRight: 25, marginTop: 5 }}>
                <LogTable />
            </div>
        );
    }
}

export default Log;