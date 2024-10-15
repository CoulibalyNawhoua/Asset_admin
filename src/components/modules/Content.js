import { useContext, useEffect } from "react";
import BaseUrl from "../utils/BaseUrl";
import HeaderSection from "./layouts/Header";
import SidebarSection from "./layouts/Sidebar";
import { UserContext } from "../utils/User_check";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";




const url = BaseUrl();
function ContentSection({children,navactive,ulShownav}){
    const {user, setUsers} = useContext(UserContext);
    const token = localStorage.getItem('_token_') !== null ? localStorage.getItem('_token_') : null;
    const exp = token !== null ? jwtDecode(token).exp : null;
    const isExpired =exp !==null ? new Date() > new Date(exp * 1000) : true;
    const navigate = useNavigate();

    // console.log(user);

    useEffect(()=>{

        if(isExpired){ 
            localStorage.removeItem('_token_');
            navigate('/');
        }

    },[isExpired]);


    return (
        <>
        <main id="main-wrapper" className="main-wrapper">


            <HeaderSection />
            <SidebarSection ulShownav={ulShownav} navactive={navactive} />  
            <div id="app-content">
                <div className="app-content-area">
                    {children}
                </div>   
            </div>
        </main>
        </>

    )
}

export default ContentSection;