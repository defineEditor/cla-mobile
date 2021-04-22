import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDB } from 'idb';
import Jszip from 'jszip';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ButtonBase from '@material-ui/core/ButtonBase';
import AutoSizer from 'react-virtualized-auto-sizer';
import { CdiscLibraryContext, FilterContext, CtContext } from '../../constants/contexts.js';
import Loading from '../utils/loading.js';
import saveCtFromCdiscLibrary from '../../utils/saveCtFromCdiscLibrary.js';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ItemView from './itemView.js';
import { changePage } from '../../redux/slices/ui.js';
import { updateCt } from '../../redux/slices/ct.js';

const getStyles = makeStyles(theme => ({
    row: {
        marginLeft: theme.spacing(3),
    },
    item: {
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
    },
    main: {
        outline: 'none',
        flex: 1,
    },
    groupDescription: {
        overflow: 'hidden',
        display: 'box',
        lineClamp: 2,
        boxOrient: 'vertical',
    },
    codeListButton: {
        color: theme.palette.primary.main,
        padding: 0,
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        fontWeight: 500,
        lineHeight: 1.75,
        borderRadius: '4px',
        letterSpacing: '0.02857em',
    },
}));

const CodeLists = (props) => {
    const [codeLists, setCodeLists] = useState([]);
    const [openedCodeListDetails, setOpenedCodeListDetails] = useState(null);
    const dispatch = useDispatch();
    const cdiscLibrary = useContext(CdiscLibraryContext).cdiscLibrary;
    const productId = useSelector(state => state.present.ui.codeLists.productId);
    const { filterString, setFilterString } = useContext(FilterContext);
    const { ct, setCt } = useContext(CtContext);
    const classes = getStyles();

    const getCodeLists = useCallback(async () => {
        // Check if CT is alreaded loaded
        if (ct[productId] !== undefined) {
            return;
        }
        // Check if CT is in cached data
        const db = await openDB('ct-store', 1, {
            upgrade (db) {
                db.createObjectStore('controlledTerminology', {});
            },
        });

        // Search for the response in cache
        let loadedCt;
        const response = await db.get('controlledTerminology', productId);
        if (response !== undefined) {
            const zippedData = response.data;
            const zip = new Jszip();
            await zip.loadAsync(zippedData);
            if (Object.keys(zip.files).includes('ct.json')) {
                loadedCt = JSON.parse(await zip.file('ct.json').async('string'));
            }
        } else {
            const ctRaw = await cdiscLibrary.getFullProduct(productId);
            loadedCt = await saveCtFromCdiscLibrary(ctRaw);
        }
        if (loadedCt?.study === undefined) {
            // CT was not loaded
            return;
        }

        const mdv = loadedCt.study.metaDataVersion;
        dispatch(updateCt({
            ct: {
                codeListNum: Object.keys(mdv.codeLists).length,
            },
            productId,
        }));
        setCt({ [productId]: loadedCt });
    }, [cdiscLibrary, productId, dispatch, ct, setCt]);

    useEffect(() => {
        getCodeLists();
    }, [getCodeLists]);

    useEffect(() => {
        if (ct[productId] !== undefined) {
            const mdv = ct[productId].study.metaDataVersion;
            setCodeLists(mdv.codeLists);
        }
    }, [ct, productId]);

    const selectCodeList = (codeList) => (event) => {
        if (event.target.id === 'codeListButton') {
            // If the button was clicked, open details and not the coded values
            return;
        }
        setFilterString('');
        dispatch(changePage({ page: 'codedValues', codeListId: codeList.oid }));
    };

    const showCodeListDetails = (codeList) => (event) => {
        event.stopPropagation();
        setOpenedCodeListDetails(codeList);
    };

    const closeCodeListDetailsView = () => {
        setOpenedCodeListDetails(null);
    };

    const renderRow = (props) => {
        const codeList = props.data[props.index];

        return (
            <ListItem
                button
                key={codeList.cdiscSubmissionValue}
                disabled={codeList.type === 'headerGroup'}
                onClick={selectCodeList(codeList)}
                className={classes.item}
                style={props.style}
            >
                <ListItemText
                    primary={
                        <ButtonBase
                            id='codeListButton'
                            onClick={showCodeListDetails(codeList)}
                            className={classes.codeListButton}
                        >
                            {codeList.cdiscSubmissionValue}
                        </ButtonBase>
                    }
                    secondary={<span className={classes.groupDescription}>{codeList.preferredTerm}</span>}
                    className={classes.row}
                />
            </ListItem>
        );
    };

    const showList = () => {
        let codeListsNew = Object.values(codeLists);

        if (filterString !== '') {
            codeListsNew = codeListsNew.filter(row =>
                row.cdiscSubmissionValue.toLowerCase().includes(filterString) || row.preferredTerm.toLowerCase().includes(filterString)
            );
        }

        return (
            <AutoSizer disableWidth>
                {({ height, width }) => (
                    <FixedSizeList height={height} itemSize={72} itemCount={codeListsNew.length} itemData={codeListsNew}>
                        {renderRow}
                    </FixedSizeList>
                )}
            </AutoSizer>
        );
    };

    return (
        <React.Fragment>
            <div className={classes.main}>
                { codeLists.length === 0 ? (<Loading onRetry={getCodeLists} />) : (showList()) }
            </div>
            <SwipeableDrawer
                anchor='bottom'
                open={openedCodeListDetails !== null}
                onOpen={closeCodeListDetailsView}
                onClose={closeCodeListDetailsView}
            >
                <ItemView item={openedCodeListDetails} type='codeList'/>
            </SwipeableDrawer>
        </React.Fragment>
    );
};

export default CodeLists;
