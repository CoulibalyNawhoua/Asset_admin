import { useContext, useEffect, useState } from "react";
import ContentSection from "../Content";
import BaseUrl from "../../utils/BaseUrl";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// import {DataGrid, GridColDef} from '@mui/material';
import Select from 'react-select';
import { UserContext } from "../../utils/User_check";
import can from "../../utils/Can";

const url = BaseUrl();
function CreateWithoutAdminUsers(){
    const navigate = useNavigate();

    const [roleList,setRoleList] = useState([]);
    const [errors,setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState();
    const [societeList,setSocieteList] = useState([]);
    const [selectRole,setSelectRole] = useState(null);
    const [selectSociete,setSelectSociete] = useState(null);

    const [compteData,setCompteData] = useState({
        'use_nom':"",
        'use_prenom':"",
        'phone':"",
        'use_lieu_naissance':"",
        'use_date_naissance':"",
        'sexe':"",
        'email':"",
        'codeDistriforce':"",
        "password":"",
        "cpm_passwrod":""
    });

    const {user,permissions} = useContext(UserContext);
   useEffect(()=>{
       if(!can(permissions,'compte-user')){
           navigate('/tableau-de-bord');
       }
   },[user,permissions]);



    useEffect(()=>{
        fetchRoleList();
        fetchSocieteList();
    },[]);

    const fetchRoleList = async ()=>{

        try {
            axios.get(url.base+'/get-roles',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setRoleList(resp.data.data);
                }
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const fetchSocieteList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/list-societes',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setSocieteList(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }


    const handleChange=(e)=>{
        setCompteData({
            ...compteData,
            [e.target.name]:e.target.value
        });
    }

    const handleChangeRole=(selectoption)=>{
        setSelectRole(selectoption.value);
      }
    
      const handleChangeSociete=(selectoption)=>{
        setSelectSociete(selectoption.value);
      }
    
      const optionSocietes = societeList?.map((opt)=>({
        value: opt.id,
        label:`${opt.name}`
      }));
    
      const optionsroles = roleList.map((opt)=>({
        value: opt.name,
        label:`${opt.name}`
      }));
    



    const submitForm= async(e)=>{
        e.preventDefault();
        const _formData = new FormData();


        _formData.append("use_nom",compteData.use_nom);
        _formData.append("use_prenom",compteData.use_prenom);
        _formData.append("phone",compteData.phone);

        _formData.append("use_lieu_naissance",compteData.use_lieu_naissance);
        _formData.append("use_date_naissance",compteData.use_date_naissance);
        _formData.append("sexe",compteData.sexe);
        _formData.append("email",compteData.email);
        _formData.append("codeDistriforce",compteData.codeDistriforce);
        // _formData.append("password",compteData.password);
        // _formData.append("password_confirmation",compteData.cpm_passwrod);

        _formData.append("roles",selectRole);
        _formData.append("societe_id",user?.societe_id !==null ? user?.societe_id : "");

        console.log(_formData);

        setLoading(true);
        try {
            axios.post(url.base+'/users-store',_formData,
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
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title:  resp.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                  });

                navigate('/cores/users-comptes');
                setErrors({});
               }else{
                   Swal.fire({
                       position: 'top-end',
                       icon: 'error',
                       title:  resp.data.message,
                       showConfirmButton: false,
                       timer: 3000,
                       toast:true,
                       position:'top-right',
                       timerProgressBar:true
                     });
               }
            //    fetchRibList();
             
           }).catch((error)=>{
               setLoading(false);
               setError(error?.response?.data.message);
               setErrors(error?.response?.data.error);

           })
       } catch (error) {
           console.log(error.response);
       } 

    }


    return(
        <>
            <ContentSection ulShownav={"cores"} navactive={"users"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                            
                                <div class="mb-5">
                                    <h3 class="mb-0 text-center"><u>Enregistrer un utilisateur</u></h3>

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

                                        {/* <div class="mb-3 col-md-6">
                                                <label class="form-label">Société </label>
                                                <Select options={optionSocietes} onChange={handleChangeSociete}/>
                                                {errors && errors.societe_id && (
                                                    <span className="text-danger">{errors.societe_id[0]}</span>
                                                )}
                                            </div> */}

                                            <div class="mb-3 col-md-6">
                                                <label class="form-label">Rôles<span className="text-danger">*</span></label>
                                                <Select options={optionsroles} onChange={handleChangeRole}/>
                                                {errors && errors.roles && (
                                                    <span className="text-danger">{errors.roles[0]}</span>
                                                )}
                                            </div>

                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Nom<span className="text-danger">*</span></label>
                                            <input type="text" class="form-control" onChange={handleChange} name="use_nom"/>
                                                {errors && errors.use_nom && (
                                                    <span className="text-danger">{errors.use_nom[0]}</span>
                                                )}
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Prénoms<span className="text-danger">*</span></label>
                                                    <input type="text"  class="form-control" onChange={handleChange} name="use_prenom"/>
                                                    {errors && errors.use_prenom && (
                                                        <span className="text-danger">{errors.use_prenom[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Code Distriforce</label>
                                                    <input type="text"  class="form-control" onChange={handleChange} name="codeDistriforce"/>
                                                    {errors && errors.codeDistriforce && (
                                                        <span className="text-danger">{errors.codeDistriforce[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        
                                        <div class="mb-3">
                                        <label class="form-label" id="productSKU">Genre  {errors && errors.sexe && (<span className="text-danger">{errors.sexe[0]}</span>
                                            )}
                                            <span className="text-danger">*</span></label><br />
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="sexe" id="inlineRadio1" value="H" onChange={handleChange}/>
                                            <label class="form-check-label" for="inlineRadio1">HOMME</label>
                                        </div>
                                            
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="sexe" id="inlineRadio2" value="F" onChange={handleChange}/>
                                            <label class="form-check-label" for="inlineRadio2">FEMME</label>
                                        </div>
                                            
                                        
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
                            

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Date de naissance</label>
                                                    <input type="date" class="form-control"  onChange={handleChange} name="use_date_naissance"/>
                                                    {errors && errors.use_date_naissance && (
                                                        <span className="text-danger">{errors.use_date_naissance[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Lieu de naissance</label>
                                                    <input type="text" class="form-control"  onChange={handleChange} name="use_lieu_naissance"/>
                                                    {errors && errors.use_lieu_naissance && (
                                                        <span className="text-danger">{errors.use_lieu_naissance[0]}</span>
                                                    )}
                                                </div>
                                            </div>                                    

                                        </div>

                                        {/* <div className="row">
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

                                        </div> */}

                                    </div>
                                    </div>

                                    
                                </div>
                                    
                            
                                    <div class="d-grid">
                                    {!loading &&
                                        <button type="submit" class="btn btn-primary">
                                            Creer un utilisateur
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

export default CreateWithoutAdminUsers;