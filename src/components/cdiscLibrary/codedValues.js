import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ItemView from './itemView.js';
import { FilterContext, CtContext } from '../../constants/contexts.js';

const getStyles = makeStyles(theme => ({
    main: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        outline: 'none',
        flex: 1,
    },
    code: {
        overflow: 'hidden',
        display: 'box',
        lineClamp: 1,
        boxOrient: 'vertical',
    },
    label: {
        overflow: 'hidden',
        display: 'box',
        lineClamp: 2,
        boxOrient: 'vertical',
    },
}));

const CodedValues = (props) => {
    const [openedCodedValue, setOpenedCodedValue] = useState(null);
    const productId = useSelector(state => state.present.ui.codeLists.productId);
    const codeListId = useSelector(state => state.present.ui.codedValues.codeListId);
    const filterString = useContext(FilterContext).filterString;
    const { ct } = useContext(CtContext);
    const codeList = ct[productId].study.metaDataVersion.codeLists[codeListId];
    const classes = getStyles();

    const renderRow = (props) => {
        const item = props.data[props.index];

        return (
            <ListItem
                button
                disableGutters
                key={item.name}
                style={props.style}
                disabled={item.type === 'headerGroup'}
                onClick={() => { setOpenedCodedValue(item); }}
            >
                <ListItemText
                    primary={<span className={classes.code}>{item.codedValue}</span>}
                    secondary={<span className={classes.label}>{item.decodes[0].value}</span>}
                />
            </ListItem>
        );
    };

    const showList = () => {
        let codedValues = codeList.itemOrder.map(id => codeList.codeListItems[id]);

        if (filterString !== '') {
            codedValues = codedValues.filter(row => {
                return row.codedValue.toLowerCase().includes(filterString.toLowerCase()) || row.decodes[0].value.toLowerCase().includes(filterString.toLowerCase());
            });
        }

        return (
            <AutoSizer disableWidth>
                {({ height, width }) => (
                    <FixedSizeList height={height} itemSize={72} itemCount={codedValues.length} itemData={codedValues}>
                        {renderRow}
                    </FixedSizeList>
                )}
            </AutoSizer>
        );
    };

    const closeCodedValueView = () => {
        setOpenedCodedValue(null);
    };

    const openCodedValueView = () => {
        setOpenedCodedValue(null);
    };

    return (
        <React.Fragment>
            <SwipeableDrawer
                anchor='bottom'
                open={openedCodedValue !== null}
                onOpen={openCodedValueView}
                onClose={closeCodedValueView}
            >
                <ItemView item={openedCodedValue} type='codedValue'/>
            </SwipeableDrawer>
            <div className={classes.main}>
                {showList()}
            </div>
        </React.Fragment>
    );
};

export default CodedValues;
