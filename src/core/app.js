import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import CdiscLibraryMain from '../components/cdiscLibrary/cdiscLibraryMain.js';
import { CdiscLibraryContext, FilterContext, CtContext, MenuActionsContext } from '../constants/contexts.js';
import { initCdiscLibrary } from '../utils/cdiscLibraryUtils.js';
import saveState from '../utils/saveState.js';
import { changeBack } from '../redux/slices/ui.js';

export default function App () {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.present.settings);
    const [cdiscLibrary, setCdiscLibrary] = useState(initCdiscLibrary({
        apiKey: settings.cdiscLibrary.apiKey,
        baseUrl: settings.cdiscLibrary.baseUrl,
        useNciSiteForCt: settings.cdiscLibrary.useNciSiteForCt,
        nciSiteUrl: settings.cdiscLibrary.nciSiteUrl,
        contentEncoding: 'gzip',
    }));
    const [ct, setCt] = useState({});
    const [filterString, setFilterString] = useState('');
    const [menuActions, setMenuActions] = useState([]);

    useEffect(() => {
        // Save state when user closes the page
        window.addEventListener('beforeunload', saveState);
        window.addEventListener('freeze', saveState);
        // Add blank history and intercept back button action
        window.history.pushState({}, '');
        const goBack = () => {
            dispatch(changeBack());
        };
        window.addEventListener('popstate', goBack);
        return () => {
            window.removeEventListener('beforeunload', saveState);
            window.removeEventListener('popstate', goBack);
        };
    }, [dispatch]);

    return (
        <CdiscLibraryContext.Provider value={{ cdiscLibrary, setCdiscLibrary }}>
            <CtContext.Provider value={{ ct, setCt }}>
                <FilterContext.Provider value={{ filterString, setFilterString }}>
                    <MenuActionsContext.Provider value={{ menuActions, setMenuActions }}>
                        <Container maxWidth="sm" disableGutters>
                            <CdiscLibraryMain />
                        </Container>
                    </MenuActionsContext.Provider>
                </FilterContext.Provider>
            </CtContext.Provider>
        </CdiscLibraryContext.Provider>
    );
}
