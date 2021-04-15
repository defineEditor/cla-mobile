import React from 'react';
import { useSelector } from 'react-redux';
import ModalGeneral from './modalGeneral.js';
import ModalCleanCdiscLibraryCache from './modalCleanCdiscLibraryCache.js';

const MODAL_COMPONENTS = {
    GENERAL: ModalGeneral,
    CLEAN_CDISC_LIBRARY_CACHE: ModalCleanCdiscLibraryCache,
};

const ModalRoot = () => {
    const modal = useSelector(state => state.present.ui.modal);
    if (modal.type.length === 0) {
        return null;
    }

    const result = [];
    modal.type.forEach(modalType => {
        const Modal = MODAL_COMPONENTS[modalType];
        result.push(<Modal key={modalType} type={modalType} { ...modal.props[modalType] } />);
    });
    return result;
};

export default ModalRoot;
