import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../../utils/BaseUrl";
import ListeFournisseur from "../../composants/listeFournisseur";
import CreateFournisseurComponent from "../../composants/createFournisseur";
import { UserContext } from "../../../utils/User_check";
import { useNavigate } from "react-router-dom";
import can from "../../../utils/Can";

const url = BaseUrl();

function FournisseurPage(){
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();
    const [nameComponent,setNameComponent] = useState('liste');


    useEffect(()=>{
        if(!can(permissions,'fournisseur-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);


    return (
        <>
            <ContentSection ulShownav={"parametres"} navactive={"fournisseur"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                                
                                <div class="mb-5">
                                    {nameComponent == "liste" &&
                                        <h3 class="mb-0 ">Liste des fournisseurs
                                        {can(permissions,"add-update-fournisseur") && 
                                            <button  class="btn btn-primary me-2 float-end btn-sm" onClick={()=>setNameComponent("create")}>Ajouter</button>
                                        }
                                        </h3>
                                    }
                                    {nameComponent == "create" &&
                                        <h3 class="mb-0 ">Ajouter un fournisseur
                                            <button  class="btn btn-danger me-2 float-end btn-sm" onClick={()=>setNameComponent("liste")}>Retour sur la liste</button>
                                        </h3>
                                    }                                

                                </div>
                            </div> 
                        </div>

                        <div>                   
                            {nameComponent == "liste" &&
                                <ListeFournisseur />
                            }

                            {nameComponent == "create" &&
                                <CreateFournisseurComponent />
                            }
                        </div>
                </div>
        
            </ContentSection>
        </>
    )
}

export default FournisseurPage;