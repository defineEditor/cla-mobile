import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clone from 'clone';
import SettingTabs from './tabs.js';
import { CdiscLibraryContext } from '../../constants/contexts.js';
import { initCdiscLibrary, updateCdiscLibrarySettings } from '../../utils/cdiscLibraryUtils.js';
import { updateSettings } from '../../redux/slices/settings.js';
import { openSnackbar, openModal } from '../../redux/slices/ui.js';
import saveState from '../../utils/saveState.js';

const Settings = (props) => {
    const dispatch = useDispatch();
    const clContext = useContext(CdiscLibraryContext);
    const currentSettings = useSelector(state => state.present.settings);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        setSettings(clone(currentSettings));
    }, [currentSettings]);

    const handleChange = (category, name, type = 'flag') => (event, checked) => {
        if (type === 'flag') {
            setSettings({ ...settings, [category]: { ...settings[category], [name]: checked } });
        } else if (type === 'string') {
            setSettings({ ...settings, [category]: { ...settings[category], [name]: event.target.value } });
        }
    };

    const getSettingsDiff = () => {
        if (settings === null) {
            return {};
        }
        const result = {};
        const newSettings = clone(settings);
        Object.keys(newSettings).forEach(category => {
            Object.keys(newSettings[category]).forEach(setting => {
                if (Array.isArray(currentSettings[category][setting])) {
                    const array = currentSettings[category][setting];
                    const newArray = newSettings[category][setting];
                    if (array.length !== newArray.length || array.some((value, index) => value !== newArray[index])) {
                        result[category] = {
                            ...result[category],
                            [setting]: newArray
                        };
                    }
                } else if (
                    newSettings[category][setting] !==
                    currentSettings[category][setting]
                ) {
                    result[category] = {
                        ...result[category],
                        [setting]: newSettings[category][setting]
                    };
                }
            });
        });
        return result;
    };

    const save = () => {
        saveState();
        const diff = getSettingsDiff();
        if (Object.keys(diff).length > 0) {
            if (diff.cdiscLibrary) {
                // Update CDISC Library credentials
                diff.cdiscLibrary = updateCdiscLibrarySettings(diff.cdiscLibrary, currentSettings.cdiscLibrary, clContext);
            }
            dispatch(updateSettings(diff));
        }
    };

    const cancel = () => {
        setSettings(clone(currentSettings));
    };

    const checkCdiscLibraryConnection = async () => {
        // For the check, create a new instance of CDISC Library, because user may have not saved the changed settings
        const claSettings = clone(settings.cdiscLibrary);
        const newCl = initCdiscLibrary(claSettings);
        const check = await newCl.checkConnection();
        if (!check || check.statusCode === -1) {
            dispatch(openSnackbar({
                type: 'error',
                message: 'Failed to connected to CDISC Library.',
            }));
        } else if (check.statusCode !== 200) {
            dispatch(openSnackbar({
                type: 'error',
                message: `Failed to connected to CDISC Library. Status code ${check.statusCode}: ${check.description}`,
            }));
        } else {
            dispatch(openSnackbar({
                type: 'success',
                message: 'Successfully connected to the CDISC Library.',
            }));
        }
    };

    const cleanCdiscLibraryCache = () => {
        dispatch(openModal({
            type: 'CLEAN_CDISC_LIBRARY_CACHE',
        }));
    };

    const settingsNotChanged = Object.keys(getSettingsDiff()).length === 0;

    if (settings === null) {
        return null;
    }

    return (
        <SettingTabs
            settings={settings}
            handleChange={handleChange}
            checkCdiscLibraryConnection={checkCdiscLibraryConnection}
            cleanCdiscLibraryCache={cleanCdiscLibraryCache}
            save={save}
            cancel={cancel}
            settingsNotChanged={settingsNotChanged}
        />
    );
};

export default Settings;
