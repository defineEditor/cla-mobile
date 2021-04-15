import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import CdiscLibraryMain from '../components/cdiscLibrary/cdiscLibraryMain.js';
import { CdiscLibraryContext, FilterContext, CtContext } from '../constants/contexts.js';
import { initCdiscLibrary } from '../utils/cdiscLibraryUtils.js';

export default function App () {
    const clSettings = useSelector(state => state.present.settings.cdiscLibrary);
    const [cdiscLibrary, setCdiscLibrary] = useState(initCdiscLibrary({
        apiKey: clSettings.apiKey,
        baseUrl: clSettings.baseUrl,
    }));
    const [ct, setCt] = useState({});

    const [filterString, setFilterString] = useState('');

    return (
        <CdiscLibraryContext.Provider value={{ cdiscLibrary, setCdiscLibrary }}>
            <CtContext.Provider value={{ ct, setCt }}>
                <FilterContext.Provider value={{ filterString, setFilterString }}>
                    <Container maxWidth="sm" disableGutters>
                        <CdiscLibraryMain />
                    </Container>
                </FilterContext.Provider>
            </CtContext.Provider>
        </CdiscLibraryContext.Provider>
    );
}
