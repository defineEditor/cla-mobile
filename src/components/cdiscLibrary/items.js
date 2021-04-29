import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import Loading from '../utils/loading.js';
import ItemView from './itemView.js';
import { CdiscLibraryContext, FilterContext } from '../../constants/contexts.js';

const getStyles = makeStyles(theme => ({
    main: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        outline: 'none',
        flex: 1,
    },
    label: {
        overflow: 'hidden',
        display: 'box',
        lineClamp: 2,
        boxOrient: 'vertical',
    },
    subheader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subheaderText: {
        textAlign: 'center',
    },
}));

const addVariableSetDescription = (items) => {
    items.forEach(item => {
        if (item.variableSet) {
            if (item.variableSet === '__default') {
                item.variableSetDescription = 'Default';
            } else {
                item.variableSetDescription = item.variableSet.replace(/([A-Z](?=[a-z]))/g, ' $1');
            }
        }
    });
};

const Items = (props) => {
    const [data, setData] = useState({
        product: null,
        itemGroup: null,
        items: [],
        currentVariableSet: '',
        variableSets: {},
    });
    const [openedItem, setOpenedItem] = useState(null);
    const cdiscLibrary = useContext(CdiscLibraryContext).cdiscLibrary;
    const productId = useSelector(state => state.present.ui.itemGroups.productId);
    const itemType = useSelector(state => state.present.ui.items.itemType);
    const itemGroupId = useSelector(state => state.present.ui.items.itemGroupId);
    const showSubheader = useSelector(state => state.present.settings.cdiscLibrary.itemsShowSetSubheader);
    const filterString = useContext(FilterContext).filterString;
    const classes = getStyles();

    const getItems = useCallback(async () => {
        const cl = cdiscLibrary;
        let itemGroup = null;
        if (itemType === 'itemGroup') {
            const product = await cl.getFullProduct(productId);
            itemGroup = await product.getItemGroup(itemGroupId);
            if (product.model === 'ADaM') {
                let variableSets = itemGroup.getVariableSetList({ descriptions: true });
                // Make variable set an additional category
                let items = [];
                Object.keys(variableSets).forEach((set, index) => {
                    const setItems = Object.values(itemGroup.analysisVariableSets[set].getItems())
                        .map(item => ({ ...item, ordinal: index + '.' + item.ordinal, variableSet: set }));
                    if (showSubheader) {
                        items.push({
                            type: 'subheader',
                            name: variableSets[set],
                        });
                        items = items.concat(setItems);
                    } else {
                        items = items.concat(setItems);
                    }
                });
                // Add variable set all to show all values;
                variableSets = { __all: 'All', ...variableSets };
                addVariableSetDescription(items);
                setData({ itemGroup, items, product, variableSets, currentVariableSet: '__all' });
            } else if (product.model === 'CDASH' && itemGroup.scenarios) {
                let variableSets = {};
                Object.keys(itemGroup.scenarios).forEach(id => {
                    variableSets[id] = itemGroup.scenarios[id].scenario;
                });
                let items = [];
                // Make variable set an additional category
                Object.keys(variableSets).forEach((set, index) => {
                    const setItems = Object.values(itemGroup.scenarios[set].getItems())
                        .map(item => ({ ...item, ordinal: index + '.' + item.ordinal, variableSet: set }));
                    items = items.concat(setItems);
                });
                // Add default category (itemGroup.fields, non-scenario)
                if (itemGroup.fields && Object.keys(itemGroup.fields).length > 0) {
                    // Add variable set all to show default fields;
                    variableSets = { __default: 'Default', ...variableSets };
                    items = items.concat(Object.values(itemGroup.getItems())
                        .map(item => ({ ...item, ordinal: 'def.' + item.ordinal, variableSet: '__default' }))
                    );
                }
                addVariableSetDescription(items);
                setData({ itemGroup, items, product, variableSets, currentVariableSet: Object.keys(variableSets)[0] });
            } else {
                setData({ itemGroup, items: Object.values(itemGroup.getItems()), product });
            }
        } else if (itemType === 'dataClass') {
            const product = await cl.getFullProduct(productId);
            itemGroup = product.dataClasses[itemGroupId];
            setData({ itemGroup, items: Object.values(itemGroup.getItems({ immediate: true })), product });
        }
    }, [cdiscLibrary, productId, itemGroupId, itemType, showSubheader]);

    useEffect(() => {
        getItems();
    }, [getItems]);

    const renderRow = (props) => {
        const item = props.data[props.index];

        if (item.type === 'subheader') {
            return (
                <div
                    key={item.name}
                    style={props.style}
                    className={classes.subheader}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        align="left"
                        color='textSecondary'
                        className={classes.subheaderText}
                    >
                        {item.name}
                    </Typography>
                </div>
            );
        } else {
            return (
                <ListItem
                    button
                    disableGutters
                    key={item.name}
                    style={props.style}
                    disabled={item.type === 'headerGroup'}
                    onClick={() => { setOpenedItem(item); }}
                >
                    <ListItemText
                        primary={item.name}
                        secondary={<span className={classes.label}>{item.label || item.prompt}</span>}
                    />
                </ListItem>
            );
        }
    };

    const showList = () => {
        let items = data.items.slice();

        if (filterString !== '') {
            items = items.filter(row => row.type !== 'subheader').filter(row => {
                return row.name.toLowerCase().includes(filterString.toLowerCase()) || (row.label || row.prompt).toLowerCase().includes(filterString.toLowerCase());
            });
        }

        return (
            <AutoSizer disableWidth>
                {({ height, width }) => (
                    <FixedSizeList height={height} itemSize={72} itemCount={items.length} itemData={items}>
                        {renderRow}
                    </FixedSizeList>
                )}
            </AutoSizer>
        );
    };

    const closeItemView = () => {
        setOpenedItem(null);
    };

    const openItemView = () => {
        setOpenedItem(null);
    };

    return (
        <React.Fragment>
            <SwipeableDrawer
                anchor='bottom'
                open={openedItem !== null}
                onOpen={openItemView}
                onClose={closeItemView}
            >
                <ItemView item={openedItem} type={data?.product?.model === 'CDASH' ? 'field' : 'variable'}/>
            </SwipeableDrawer>
            <div className={classes.main}>
                { data.product === null ? (<Loading onRetry={getItems} />) : (showList()) }
            </div>
        </React.Fragment>
    );
};

export default Items;
