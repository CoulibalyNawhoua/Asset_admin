import { Link, useParams } from "react-router-dom";
import ContentSection from "../Content";
import { useEffect, useState } from "react";
import BaseUrl from "../../utils/BaseUrl";
import axios from "axios";

const url = BaseUrl();
function ViewsSociete(){
    const {uuid} = useParams();
    const [societe, setSociete] = useState([]);
    const [loading,setLoading] = useState(false);


    useEffect(()=>{
        fetchItem();
    },[]);

    const fetchItem = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/view-societe/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setSociete(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }


    return (
        <>
            <ContentSection ulShownav={"cores"} navactive={"comptes"}>
                <div class="container-fluid">
                    <div class="col-xxl-12 col-12">
                        <div class="card mt-5 mt-xxl-0">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">Information de la societe</h4>
                            <div>
                                <Link to="/cores/comptes" class="btn btn-primary btn-sm mx-1">Retour</Link>
                                {/* <a href="#!" class="btn btn-info btn-sm mx-1">Modifier</a>
                                <a href="#!" class="btn btn-danger btn-sm">Supprimer</a> */}

                            </div>
                            {/* <a href="#!" class="btn btn-primary btn-sm">Edit Cart</a> */}
                        </div>
                        <div class="card-body">


                            <div class="d-md-flex">
                            <div>
                                <img src={`${url.public}logo/${societe.logo}`} alt="logo societe" class="img-4by3-md " />
                            </div>
                            {/* <div class="ms-md-4 mt-2">
                                <h4 class="mb-1 ">
                                <a href="#!" class="text-inherit">
                                    Women Shoes
                                </a>
                                </h4>
                                <h5>$49.00</h5>



                            </div> */}

                            </div>
                            {/* <hr class="my-3"/> */}

                        </div>
                        <div class="card-body border-top pt-2">
                            {/* <div className="col-6"></div>
                            <div className="col-6"></div> */}
                            <div className="row">
                            <ul class="list-group list-group-flush mb-0 col-5">
                                <li class="d-flex justify-content-between list-group-item px-0">
                                    <span>Raison sociale</span>
                                    <span class="text-dark fw-bold">{societe.name}</span>
                                </li>
                                <li class="d-flex justify-content-between list-group-item px-0">
                                    <span>Adresse</span>
                                    <span class="text-dark fw-bold">{societe.adresse}</span>
                                </li>
                                <li class="d-flex justify-content-between list-group-item px-0">
                                    <span>Email</span>
                                    <span class="text-dark fw-bold">{societe.email}</span>
                                </li>
                                <li class="d-flex justify-content-between list-group-item px-0 pb-0">
                                    <span>Telephone</span>
                                    <span class="text-dark fw-bold">{societe.tel}</span>
                                </li>

                            </ul>
                            <div className="col-1"></div>
                             <ul class="list-group list-group-flush mb-0 col-5">
                                <li class="d-flex justify-content-between list-group-item px-0">
                                    <span>Représentant</span>
                                    <span class="text-dark fw-bold">{societe.lead_fullName}</span>
                                </li>
                                <li class="d-flex justify-content-between list-group-item px-0">
                                    <span>Registre de commerce</span>
                                    <span class="text-dark fw-bold">{societe.registre_num}</span>
                                </li>
                                <li class="d-flex justify-content-between list-group-item px-0">
                                    <span>Fax</span>
                                    <span class="text-dark fw-bold">{societe.fax}</span>
                                </li>
                                {/* <li class="d-flex justify-content-between list-group-item px-0 pb-0">
                                    <span>Tax</span>
                                    <span class="text-dark ">$0.00</span>
                                </li> */}

                            </ul> 
                            </div>
                           
                        </div>
                        {/* <div class="card-footer">
                            <div class="d-flex justify-content-between list-group-item px-0 pb-0">
                            <span class="fs-4  text-dark">Grand Total</span>
                            <span class=" text-dark">$128.00</span>
                            </div>
                        </div> */}

                        </div>

                    </div>
                </div>
            </ContentSection>
        </>
    );
}

export default ViewsSociete;