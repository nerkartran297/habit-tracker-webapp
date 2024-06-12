import React, { createContext, useState, useEffect } from 'react';

export const NoteContext = createContext(null);

const NoteContextProvider = (props) => {
    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState([]);

    useEffect(() => {
        if(localStorage.getItem('auth-token')){
            fetch('/getnotes', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => setNotes(data));

            fetch('/getnote', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => setNote(data)
            )
        }
    }, []);

    const contextValue = { notes, note };
    
    return (
        <NoteContext.Provider value={contextValue}>
            {props.children}
        </NoteContext.Provider>
    );
}

export default NoteContextProvider;
