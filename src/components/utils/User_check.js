import { useEffect, useState ,createContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BaseUrl from "./BaseUrl";

const url = BaseUrl();
const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user,setUsers] = useState(null);
    const [permissions,setPermissions] = useState([]);
    const [role,setRole] = useState([]);
    const navigate = useNavigate();


    useEffect(()=>{
        if(localStorage.getItem('_token_') !== null){
            try {
                axios.get(url.base+'/me',
            {
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
                // credentials:'include'
            }
                ).then((resp)=>{
                    if(resp.status == 200){
                        if(resp.data.error){
                            localStorage.removeItem('_token_');
                            navigate('/');
                        }
                        setUsers(resp.data.user);
                        setPermissions(resp.data.permissions);
                        setRole(resp.data.role);
                    }else{
                        localStorage.removeItem('_token_');
                        navigate('/');
                    }
                })
            } catch (error) {
                console.log(error.response.status);
               
            }
            
        }else{
            localStorage.removeItem('_token_');
            navigate('/');
        }


    },[]);

    useEffect(()=>{
        // if(user == null){
        //     localStorage.removeItem('_token_');
        //     navigate('/');
        // }
    },[user]);

    return (
        <UserContext.Provider value={{ user , role, permissions }}>
            {children}
        </UserContext.Provider>
    );

}

export { UserContext, UserProvider };