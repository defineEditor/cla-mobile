import React from 'react';

export const CdiscLibraryContext = React.createContext({});

export const FilterContext = React.createContext({
    filterString: '',
    setFilterString: () => {},
});

export const CtContext = React.createContext({});
