import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import getCt from '../../utils/getCt.js';
import Loading from '../utils/loading.js';
import ItemView from './itemView.js';
import { FilterContext, CtContext, CdiscLibraryContext } from '../../constants/contexts.js';
import { updateCt } from '../../redux/slices/ct.js';

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
    const dispatch = useDispatch();
    const [openedCodedValue, setOpenedCodedValue] = useState(null);
    const [codeList, setCodeList] = useState(null);
    const productId = useSelector(state => state.present.ui.codeLists.productId);
    const codedValuesUi = useSelector(state => state.present.ui.codedValues);
    const filterString = useContext(FilterContext).filterString;
    const cdiscLibrary = useContext(CdiscLibraryContext).cdiscLibrary;
    const { ct, setCt } = useContext(CtContext);
    const classes = getStyles();

    const getCodeList = useCallback(async () => {
        // Check if CT is alreaded loaded
        if (ct[productId] === undefined) {
            const loadedCt = await getCt(productId, { cdiscLibrary });

            const mdv = loadedCt.study.metaDataVersion;
            dispatch(updateCt({
                ct: {
                    codeListNum: Object.keys(mdv.codeLists).length,
                },
                productId,
            }));
            setCt({ [productId]: loadedCt });
            // No need to set codelist here as after CT update the component will be rerendered
        } else {
            if (ct[productId]?.study?.metaDataVersion) {
                let { codeListId, alias } = codedValuesUi;
                // In case only alias was provided, find codelist OID first
                if (!codeListId && alias) {
                    codeListId = ct[productId].study.metaDataVersion.nciCodeOids[alias];
                }
                if (ct[productId]?.study?.metaDataVersion?.codeLists[codeListId]) {
                    setCodeList(ct[productId].study.metaDataVersion.codeLists[codeListId]);
                }
            }
        }
    }, [cdiscLibrary, productId, dispatch, ct, setCt, setCodeList, codedValuesUi]);

    useEffect(() => {
        getCodeList();
    }, [getCodeList]);

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
                {codeList === null ? (<Loading onRetry={getCodeList} />) : showList()}
            </div>
        </React.Fragment>
    );
};

export default CodedValues;
