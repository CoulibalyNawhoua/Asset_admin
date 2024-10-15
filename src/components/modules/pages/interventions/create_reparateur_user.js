import Swal from "sweetalert2";
import ContentSection from "../../Content";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Select from 'react-select'
import SwalTopEnd from "../../../utils/swal_top_end";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";


const url = BaseUrl();
function CreateReparateurUser()
{
    const navigate = useNavigate();

    const [TerritoireList,setTerritoireList] = useState([]);
    const [errors,setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [error,setError] = useState();

        const {user,permissions} = useContext(UserContext);


    
    const [canalList,setCanalList] = useState([]);
    const [selectTerritoire,setSelectTerritoire] = useState(null);
    const [selectCanal,setSelectCanal] = useState(null);

    const [compteData,setCompteData] = useState({
        "name":"",
        "manager":"",
        "phone":"",
        "email":"",
        "ville":"",
        "rccm":"",
        "dfe":"",
        "password":"",
        "cpm_passwrod":""
    });

    useEffect(()=>{
    if(!can(permissions,'add-update-reparateur')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        fetchCanalList();
        TerritoireFunctionList();
    },[]);

    const fetchCanalList = async ()=>{

        try {
            axios.get(url.base+'/setting/canal-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setCanalList(resp.data.data);
                }
                // setLoading(false);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const TerritoireFunctionList=()=>{
        try {
          axios.get(url.base+'/setting/territoire-list',{
              headers:{
                  'Content-Type':'application/json',
                  "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                  
              },
          }).then((resp)=>{
  
                if(resp.status == 200){
                    setTerritoireList(resp.data.data);
                }
            })
        } catch (error) {
          console.log(error);
        }
       
      }


    const handleChange=(e)=>{
        setCompteData({
            ...compteData,
            [e.target.name]:e.target.value
        });
    }

    const handleChangeCanal=(selectoption)=>{
        setSelectCanal(selectoption.value);
      }
    
      const handleChangeTerritoire=(selectoption)=>{
        setSelectTerritoire(selectoption.value);
      }
    
      const optioncanals = canalList?.map((opt)=>({
        value: opt.id,
        label:`${opt.libelle}`
      }));
    
      const optionterritoires = TerritoireList?.map((option)=>({
        label:`${option.libelle}`,
        value:`${option.id}`
      }));
    



    const submitForm= async(e)=>{
        e.preventDefault();
        const _formData = new FormData();


        if(compteData.password !=="" && compteData.cpm_passwrod !== "" && compteData.password == compteData.cpm_passwrod)
        {
            _formData.append("name",compteData.name);
            _formData.append("phone",compteData.phone);
            _formData.append("email",compteData.email);
            _formData.append("manager",compteData.manager);
    
            _formData.append("ville",compteData.ville);
            _formData.append("rccm",compteData.rccm);
            _formData.append("dfe",compteData.dfe);
            _formData.append("password",compteData.password);
    
            _formData.append("canal_id",selectCanal !== null ? selectCanal : "");
            _formData.append("territoire_id",selectTerritoire !== null ? selectTerritoire : "");
    
    
            console.log(_formData);
    
            setLoading(true);
            try {
                axios.post(url.base+'/users-reparateurs-store',_formData,
               {
                   headers:{
                       'Content-Type':'multipart/form-data',
                       "Authorization": `Bearer ${localStorage.getItem('_token_')}`                   
                   },
                   credentials:'include'
               }
               ).then((resp)=>{          
                   setLoading(false);
                   if(resp.status == 200)
                   {
                    SwalTopEnd({icon:"success", title: "Enregistrement effectué avec succès."});    
                    navigate('/list-reparateurs');
                    setErrors({});
                   }else{
                    SwalTopEnd({icon:"error", title: "Un problème est subvenu"});
                   }

               }).catch((error)=>{
                   setLoading(false);
                   setError(error.response.data.message);
                   setErrors(error.response.data.error);
    
               })
           } catch (error) {
               console.log(error.response);
           } 
        }else{ 
            if(compteData.password ==""){
                SwalTopEnd({icon:"error", title: "Le mot de passe est obligatoire"});
            }else if(compteData.cpm_passwrod ==""){
                SwalTopEnd({icon:"error", title: "Vous devez confirmé le mot de passe."});
            }
            if(compteData.cpm_passwrod !== compteData.password)
            {
                SwalTopEnd({icon:"error", title: "Le mot de passe ne correspond pas."});
            }
        }


    }
    return (
        <>
            <ContentSection ulShownav={"interventions"} navactive={"reparateur_list"}>
            <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                            
                                <div class="mb-5">
                                    <h3 class="mb-0 text-center"><u>Crée un compte du reparateur</u></h3>

                                </div>
                            </div>
                        </div>
                        <div>
                            

                            <form class="row" onSubmit={submitForm}>

                                <div class="col-lg-2 col-12"></div>
                                <div class="col-lg-8 col-12">
                                    
                                <div class="card mb-4">
                                    
                                    <div class="card-body">
                                        
                                    <div class="form-check form-switch mb-4">
                                        {/* <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchStock" checked /> */}
                                        <i class="fa-solid fa-user fa-lg"></i>
                                        <label class="form-check-label text-info" for="flexSwitchStock">Veuillez renseigner les informations de l'utilisateur</label>
                                    </div>
                                        
                                    <div>
                                        
                                        <div className="row">

                                            <div class="mb-3 col-md-6">
                                                <label class="form-label">Canal <span className="text-danger">*</span></label>
                                                <Select options={optioncanals} onChange={handleChangeCanal}/>
                                                {errors && errors.canal_id && (
                                                    <span className="text-danger">{errors.canal_id[0]}</span>
                                                )}
                                            </div>

                                            <div class="mb-3 col-md-6">
                                                <label class="form-label">Térritoire <span className="text-danger">*</span></label>
                                                <Select options={optionterritoires} onChange={handleChangeTerritoire}/>
                                                {errors && errors.territoire_id && (
                                                    <span className="text-danger">{errors.territoire_id[0]}</span>
                                                )}
                                            </div>

                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Nom du reparateur<span className="text-danger">*</span></label>
                                            <input type="text" class="form-control" onChange={handleChange} name="name"/>
                                                {errors && errors.name && (
                                                    <span className="text-danger">{errors.name[0]}</span>
                                                )}
                                        </div>
                                        
                                        <div className="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Email<span className="text-danger">*</span></label>
                                                <input type="email" name='email' onChange={handleChange} class="form-control w-100"  />
                                                {errors && errors.email && (
                                                    <span className="text-danger">{errors.email[0]}</span>
                                                )}
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Contact<span className="text-danger">*</span></label>
                                                <input name='phone' type="text" onChange={handleChange} class="form-control w-100"  max={10}/>
                                                {errors && errors.phone && (
                                                    <span className="text-danger">{errors.phone[0]}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Manager </label>
                                            <input type="text"  class="form-control" onChange={handleChange} name="manager"/>
                                            {errors && errors.manager && (
                                                <span className="text-danger">{errors.manager[0]}</span>
                                            )}
                                        </div>

                                    <div class="mb-3">
                                            <label class="form-label">Ville </label>
                                            <input type="text"  class="form-control" onChange={handleChange} name="ville"/>
                                            {errors && errors.ville && (
                                                <span className="text-danger">{errors.ville[0]}</span>
                                            )}
                                        </div>
                            

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">N°RCCM</label>
                                                    <input type="text" class="form-control"  onChange={handleChange} name="rccm"/>
                                                    {errors && errors.rccm && (
                                                        <span className="text-danger">{errors.rccm[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">N°DFE</label>
                                                    <input type="text" class="form-control"  onChange={handleChange} name="dfe"/>
                                                    {errors && errors.dfe && (
                                                        <span className="text-danger">{errors.dfe[0]}</span>
                                                    )}
                                                </div>
                                            </div>                                    

                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Mot de passe</label>
                                                    <input type="password" class="form-control"  onChange={handleChange} name="password"/>
                                                    {errors && errors.password && (
                                                        <span className="text-danger">{errors.password[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Confirmer le mot de passe</label>
                                                    <input type="password" class="form-control"  onChange={handleChange} name="cpm_passwrod"/>
                                                    {errors && errors.cpm_passwrod && (
                                                        <span className="text-danger">{errors.cpm_passwrod[0]}</span>
                                                    )}
                                                </div>
                                            </div>                                    

                                        </div>

                                    </div>
                                    </div>

                                    
                                </div>
                                    
                            
                                    <div class="d-grid">
                                    {!loading &&
                                        <button type="submit" class="btn btn-primary">
                                            Enregistrer 
                                        </button>
                                    }
                                    {loading &&
                                    <button class="btn btn-primary" type="button" disabled>
                                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        Enregistrement en cours...
                                    </button>
                                    }
                                   
                                </div>
                             
                                </div>
                            
                            </form>
                        </div>
                </div>
            </ContentSection>
        </>
    )
}

export default CreateReparateurUser;