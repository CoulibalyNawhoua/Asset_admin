import { useContext, useEffect } from "react";
import { UserContext } from "../../utils/User_check";
import { useNavigate } from "react-router-dom";

function HeaderSection(){
    const {user,role, permissions} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(()=>{

    },[user,permissions]);

    // console.log(permissions);
    return (
        <>
            <div className="header">

            <div className="navbar-custom navbar navbar-expand-lg">
                <div className="container-fluid px-0">
                <a className="navbar-brand d-block d-md-none" href="index.html">
                <img src="/assets/images/brand/logo/logo-2.svg" alt="Image" />
            </a>



                <a id="nav-toggle" href="#!" className="ms-auto ms-md-0 me-0 me-lg-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-text-indent-left text-muted" viewBox="0 0 16 16">
                    <path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708zM7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                </svg></a>

                <div className="d-none d-md-none d-lg-block">
            
                <form action="#">


                    <div className="input-group ">
                    <input className="form-control rounded-3" type="search" value="" id="searchInput" placeholder="Search"/>
                    <span className="input-group-append">
                        <button className="btn  ms-n10 rounded-0 rounded-end" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            className="feather feather-search text-dark">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        </button>
                    </span>
                    </div>
                </form>
                </div>
            {/* {user?.use_nom} */}
                <ul className="navbar-nav navbar-right-wrap ms-lg-auto d-flex nav-top-wrap align-items-center ms-4 ms-lg-0">
                    <a href="#" className="form-check form-switch theme-switch btn btn-ghost btn-icon rounded-circle mb-0 ">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                    <label className="form-check-label" for="flexSwitchCheckDefault"></label>

                        </a>
                    

                <li className="dropdown stopevent ms-2">
                    <a className="btn btn-ghost btn-icon rounded-circle" href="#!" role="button"
                    id="dropdownNotification" data-bs-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <i className="icon-xs" data-feather="bell"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end"
                    aria-labelledby="dropdownNotification">
                    <div>
                        <div className="border-bottom px-3 pt-2 pb-3 d-flex
                        justify-content-between align-items-center">
                        <p className="mb-0 text-dark fw-medium fs-4">Notifications</p>
                        <a href="#!" className="text-muted">
                            <span>
                            <i className="me-1 icon-xs" data-feather="settings"></i>
                            </span>
                        </a>
                        </div>
                        <div  data-simplebar style={{"height": "250px;"}}>
                    
                        <ul className="list-group list-group-flush notification-list-scroll">
                        
                        <li className="list-group-item bg-light">


                            <a href="#!" className="text-muted">
                                <h5 className=" mb-1">Rishi Chopra</h5>
                                <p className="mb-0">
                                Mauris blandit erat id nunc blandit, ac eleifend dolor pretium.
                                </p>
                            </a>



                    </li>
                        
                        <li className="list-group-item">


                        <a href="#!" className="text-muted">
                            <h5 className=" mb-1">Neha Kannned</h5>
                            <p className="mb-0">
                                Proin at elit vel est condimentum elementum id in ante. Maecenas et sapien metus.
                            </p>
                        </a>



                    </li>
                        
                        <li className="list-group-item">


                            <a href="#!" className="text-muted">
                                <h5 className=" mb-1">Nirmala Chauhan</h5>
                                <p className="mb-0">
                                Morbi maximus urna lobortis elit sollicitudin sollicitudieget elit vel pretium.
                                </p>
                            </a>



                    </li>
                        
                        <li className="list-group-item">


                                <a href="#!" className="text-muted">
                                    <h5 className=" mb-1">Sina Ray</h5>
                                    <p className="mb-0">
                                    Sed aliquam augue sit amet mauris volutpat hendrerit sed nunc eu diam.
                                    </p>
                                </a>



                        </li>
                        </ul>
                        </div>
                        <div className="border-top px-3 py-2 text-center">
                        <a href="#!" className="text-inherit ">
                            View all Notifications
                        </a>
                        </div>
                    </div>
                    </div>
                </li>
            
                <li className="dropdown ms-2">
                    <a className="rounded-circle" href="#!" role="button" id="dropdownUser"
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div className="avatar avatar-md avatar-indicators avatar-online">
                        <img alt="avatar" src="/assets/images/avatar/avatar-11.jpg" className="rounded-circle" />
                    </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="dropdownUser">
                    <div className="px-4 pb-0 pt-2">


                        <div className="lh-1 ">
                        <h5 className="mb-1">{user?.use_nom}</h5>
                        <a href="#!" className="text-inherit fs-6 badge bg-success">{role}</a>
                        </div>
                        <div className=" dropdown-divider mt-3 mb-2"></div>
                    </div>

                    <ul className="list-unstyled">
{/* 
                        <li>
                        <a className="dropdown-item d-flex align-items-center" href="#!">
                            <i className="me-2 icon-xxs dropdown-item-icon" data-feather="user"></i>Edit
                            Profile
                        </a>
                        </li>
                        <li>
                        <a className="dropdown-item"
                            href="#!">
                            <i className="me-2 icon-xxs dropdown-item-icon"
                            data-feather="activity"></i>Activity Log
                        </a>


                        </li>


                        <li>
                        <a className="dropdown-item d-flex align-items-center" href="#!">

                            <i className="me-2 icon-xxs dropdown-item-icon"
                            data-feather="settings"></i>Settings
                        </a>
                        </li> */}
                        <li>
                        <a className="dropdown-item" onClick={()=>{localStorage.removeItem('_token_');navigate('/')}}>
                            <i className="me-2 icon-xxs dropdown-item-icon"
                        ></i>Se Deconnecter
                        </a>
                        </li>
                    </ul>

                    </div>
                </li>
                </ul>
                </div>
            </div>
            </div>
        </>
    )
}

export default HeaderSection;