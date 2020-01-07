import * as React from 'react';
import { IconButton, initializeIcons } from 'office-ui-fabric-react';
initializeIcons();

const a = <IconButton iconProps={{ iconName: 'info' }}/>
const warining = <IconButton iconProps={{ iconName: 'Warning' }}/>
const errorBadge = <IconButton iconProps={{ iconName: 'ErrorBadge' }}/>
const completed = <IconButton iconProps={{ iconName: 'Completed' }}/>
const blocked = <IconButton iconProps={{ iconName: 'Completed' }}/>
const copy = <IconButton iconProps={{ iconName: 'Copy' }}/>

export { a, warining, errorBadge, completed, blocked, copy };
