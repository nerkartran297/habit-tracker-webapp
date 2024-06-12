import React, { createContext, useState } from 'react'
import { useEffect } from 'react';
export const UserContext = createContext(null);

const UserContextProvider = (props) => {
    const [User,setUser] = useState({});
    useEffect(()=>{

        if(localStorage.getItem('auth-token')){
        fetch('/getdescription',{
        method:'POST',
        headers:{
            Accept:'application/json',
            'auth-token':`${localStorage.getItem('auth-token')}`,
            'Content-Type':'application/json',
        },
    }).then((response)=>response.json())
    .then((data)=>setUser(data));
        }
},[])
const contextValue = {User};
    return(
        <UserContext.Provider value={contextValue}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider