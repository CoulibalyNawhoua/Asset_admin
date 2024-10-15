import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
// import {DataGrid, GridColDef} from '@mui/material';
import Select from 'react-select';
import ContentSection from "../../Content";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import SwalTopEnd from "../../../utils/swal_top_end";

const url = BaseUrl();
function EditUserInfo(){
    const navigate = useNavigate();
    const {uuid} = useParams();

    const [roleList,setRoleList] = useState([]);
    const [errors,setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState();
    const [societeList,setSocieteList] = useState([]);
    const [selectRole,setSelectRole] = useState(null);
    const [selectSociete,setSelectSociete] = useState(null);
    const [moyen_reception_pass,setMoyenReceptionPass] = useState("email");

    const [compteData,setCompteData] = useState({
        'use_nom':"",
        'use_prenom':"",
        'phone':"",
        'use_lieu_naissance':"",
        'use_date_naissance':"",
        'sexe':"",
        'email':"",
        "password":"",
        "cpm_passwrod":""
    });

    useEffect(()=>{
        fetchRoleList();
        fetchSocieteList();
        fetchUserInfo();
    },[]);

    const fetchUserInfo=()=>{
        try {
            axios.get(url.base+'/users-detail/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                setCompteData({
                    'use_nom':resp.data.data.use_nom,
                    'use_prenom':resp.data.data.use_prenom,
                    'phone':resp.data.data.phone,
                    'use_lieu_naissance':resp.data.data.use_lieu_naissance,
                    'use_date_naissance': moment(resp.data.data.use_date_naissance).format('YYYY-MM-DD'),
                    'sexe':resp.data.data.sexe,
                    'email':resp.data.data.email,
                });
                
                setSelectRole(resp.data.roles[0]);
                setSelectSociete(resp.data.data.societe_id);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const fetchRoleList = async ()=>{

        try {
            axios.get(url.base+'/role-list',{
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
        _formData.append("password",compteData.password);

        _formData.append("roles",selectRole);
        _formData.append("societe_id",selectSociete);

        console.log(_formData);

        setLoading(true);
        try {
            axios.post(url.base+'/users-update/'+uuid,_formData,
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

                // navigate('/cores/users-comptes');
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
               setError(error.response.data.message);
               setErrors(error.response.data.error);

           })
       } catch (error) {
           console.log(error.response);
       } 

    }


    const modal_edit_passsword=()=>{
        window.$("#add-edit-modal").modal('show');
    }

    const submitFormNewPass=()=>{
        const _formData = new FormData();
        _formData.append("moyen_reception",moyen_reception_pass);

        setLoading(true);
        try {
            axios.post(url.base+'/reset-pass-user/'+uuid,_formData,
           {
               headers:{
                   'Content-Type':'multipart/form-data',
                   "Authorization": `Bearer ${localStorage.getItem('_token_')}`                   
               },
               credentials:'include'
           }
           ).then((resp)=>{          
               setLoading(false);
               
               if(resp.data.data == "email" || resp.data.data == "sms"){
                    SwalTopEnd({icon:"success",title:"Mot de passe reinitialisé avec succès."});
               }else {
                Swal.fire({
                    icon: 'success',
                    title:  `Votre nouveau mot de passe est : ${resp.data.pass}`,
                  });
               }
               window.$("#add-edit-modal").modal('hide');
             
           }).catch((error)=>{
            setLoading(false);
            console.log(error);
           });
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
                                    <h3 class="mb-0 text-center"><u>Modification des informations</u></h3>

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
                                        <button type="button" class="btn btn-danger btn-sm mx-1 float-end" onClick={()=>modal_edit_passsword()}>Reinitialiser le mot de passe</button>
                                    </div>
                                        
                                    <div>
                                        
                                        <div className="row">
{/* 
                                            <div class="mb-3 col-md-6">
                                                <label class="form-label">Société<span className="text-danger">*</span></label>
                                                <Select 
                                                    options={optionSocietes} 
                                                    onChange={handleChangeSociete}
                                                    value={optionSocietes.find(obj => obj.value == selectSociete)}
                                                    defaultValue={[{label: selectSociete == selectSociete ? optionSocietes.find(obj => obj.value === selectSociete) : ""}]}
                                                />
                                                {errors && errors.societe_id && (
                                                    <span className="text-danger">{errors.societe_id[0]}</span>
                                                )}
                                            </div> */}

                                            <div class="mb-3 col-md-6">
                                                <label class="form-label">Rôles<span className="text-danger">*</span></label>
                                                <Select 
                                                    options={optionsroles} 
                                                    onChange={handleChangeRole}
                                                    value={optionsroles.find(obj => obj.value == selectRole)}
                                                    defaultValue={[{label: selectRole == selectRole ? optionsroles.find(obj => obj.value === selectRole) : ""}]}
                                                />
                                                {errors && errors.roles && (
                                                    <span className="text-danger">{errors.roles[0]}</span>
                                                )}
                                            </div>

                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Nom<span className="text-danger">*</span></label>
                                            <input type="text" class="form-control" onChange={handleChange} name="use_nom" value={ compteData.use_nom }/>
                                                {errors && errors.use_nom && (
                                                    <span className="text-danger">{errors.use_nom[0]}</span>
                                                )}
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">Prénoms<span className="text-danger">*</span></label>
                                            <input type="text"  class="form-control" onChange={handleChange} name="use_prenom" value={ compteData.use_prenom }/>
                                            {errors && errors.use_prenom && (
                                                <span className="text-danger">{errors.use_prenom[0]}</span>
                                            )}
                                        </div>
                                        
                                        <div class="mb-3">
                                        <label class="form-label" id="productSKU">Genre  {errors && errors.sexe && (<span className="text-danger">{errors.sexe[0]}</span>
                                            )}
                                            <span className="text-danger">*</span></label><br />
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="sexe" id="inlineRadio1" value="H" onChange={handleChange} checked={compteData.sexe == "H" ? "checked" : ""}/>
                                            <label class="form-check-label" for="inlineRadio1">HOMME</label>
                                        </div>
                                            
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="sexe" id="inlineRadio2" value="F" onChange={handleChange} checked={compteData.sexe == "F" ? "checked" : ""} />
                                            <label class="form-check-label" for="inlineRadio2">FEMME</label>
                                        </div>
                                            
                                        
                                        </div>
                                        
                                        <div className="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Email<span className="text-danger">*</span></label>
                                                <input type="email" name='email' onChange={handleChange} class="form-control w-100" required  value={ compteData.email }/>
                                                {errors && errors.email && (
                                                    <span className="text-danger">{errors.email[0]}</span>
                                                )}
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Contact<span className="text-danger">*</span></label>
                                                <input name='phone' type="text" onChange={handleChange} class="form-control w-100" required max={10} value={ compteData.phone }/>
                                                {errors && errors.phone && (
                                                    <span className="text-danger">{errors.phone[0]}</span>
                                                )}
                                            </div>
                                        </div>
                            

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Date de naissance</label>
                                                    <input type="date" class="form-control"  onChange={handleChange} name="use_date_naissance" value={ compteData.use_date_naissance }/>
                                                    {errors && errors.use_date_naissance && (
                                                        <span className="text-danger">{errors.use_date_naissance[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Lieu de naissance</label>
                                                    <input type="text" class="form-control"  onChange={handleChange} name="use_lieu_naissance" value={ compteData.use_lieu_naissance }/>
                                                    {errors && errors.use_lieu_naissance && (
                                                        <span className="text-danger">{errors.use_lieu_naissance[0]}</span>
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
                                            Enregistrer la modification
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

                <div class="modal fade" id="add-edit-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div class="modal-dialog modal-md" role="document">
                        <div class="modal-content" >
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalScrollableTitle">Modifier le mot de passe</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"></span>
                                </button>
                            </div>
                            <div class="modal-body">
                        
                                    <div class="modal-body">                 
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Moyen de reception du nouveau mot de passe </label>
                                            <select class="form-select" aria-label="Default select example" onChange={(e)=>setMoyenReceptionPass(e.target.value)}>
                                                <option value="email" selected>Recevoir par e-mail</option>
                                                <option value="sms">Recevoir par sms</option>
                                                <option value="other">Autres</option>
                                            </select>                            
                                        </div>   
                                    </div>                          
                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                {!loading && <button type="button"  class="btn btn-danger " onClick={()=>submitFormNewPass()}>Reinitialiser le mot de passe</button> }
                                {loading && <button type="button" class="btn btn-primary disabled">En Chargement...</button> }
                            </div>
                        </div>
                    </div>
            </div>
            </ContentSection>
        </>
    )
}

export default EditUserInfo;