import { useEffect, useState } from "react";
import ContentSection from "../Content";
import BaseUrl from "../../utils/BaseUrl";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// import {DataGrid, GridColDef} from '@mui/material';
 
const url = BaseUrl();
function CreateCompte(){
    const navigate = useNavigate();

    const [roleList,setRoleList] = useState([]);
    const [errors,setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState();

    const [compteData,setCompteData] = useState({
        "logo":"",
        "name":"",
        "adresse":"",
        "email":"",
        "fax":"",
        "registre_num":"",
        "tel":"",
        "lead_fullName":""
        // 'name':"",
        // 'last_name':"",
        // 'tel':"",
        // 'birthplace':"",
        // 'date_of_birth':"",
        // 'sexe':"",
        // 'email':"",
        // "role_id":""
    })
    useEffect(()=>{
        // fetchRoleList();
    },[]);

    const fetchRoleList = async ()=>{

        try {
            axios.get(url.base+'/cores/role-list',{
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

    const handleChange=(e)=>{
        setCompteData({
            ...compteData,
            [e.target.name]:e.target.value
        });
    }

    const handleFileChangeLogo=(event)=>{
        setCompteData({
            ...compteData,
            [event.target.name]:event.target.files[0]
        });
    }


    const submitForm= async(e)=>{
        e.preventDefault();
        const _formData = new FormData();
        _formData.append("name",compteData.name);
        _formData.append("adresse",compteData.adresse);
        _formData.append("email",compteData.email);
        _formData.append("fax",compteData.fax);
        _formData.append("registre_num",compteData.registre_num);
        _formData.append("tel",compteData.tel);

        _formData.append("lead_fullName",compteData.lead_fullName);
        // _formData.append("use_prenom",compteData.use_prenom);
        // _formData.append("phone",compteData.phone);
        // _formData.append("use_lieu_naissance",compteData.use_lieu_naissance);
        // _formData.append("use_date_naissance",compteData.use_date_naissance);
        // _formData.append("sexe",compteData.sexe);
        // _formData.append("email",compteData.email);
        // _formData.append("role_id",compteData.role_id);

        if(compteData.logo !=""){
            const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
            const originalExtension = compteData.logo.name.split('.').pop();
            const newFileName = `${currentTimeInSeconds}_logo_.${originalExtension}`;
            const photo = new File([compteData.logo], newFileName, { type: compteData.logo.type });
            
            _formData.append("logo",photo);
        }

        console.log(_formData);

        setLoading(true);
        try {
            axios.post(url.base+'/create-societes',_formData,
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

                  navigate('/cores/comptes')
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


    return(
        <>
            <ContentSection ulShownav={"cores"} navactive={"create-compte"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                            
                                <div class="mb-5">
                                    <h3 class="mb-0 ">Ajouter une société</h3>

                                </div>
                            </div>
                        </div>
                        <div>
                            

                            <form class="row" onSubmit={submitForm}>
                                <div class="col-lg-12 col-12">
                                    
                                <div class="card mb-4">
                                    
                                    <div class="card-body">
                                        <div>
                                                
                                            <div class="mb-3">
                                                <label class="form-label">Nom de la société <span className="text-danger">*</span></label>
                                                <input type="text" class="form-control" placeholder="Entrer le nom de la societe"  name="name" onChange={handleChange} value={compteData.name} required/>
                                                {errors && errors.name && (
                                                    <span className="text-danger">{errors.name[0]}</span>
                                                )}
                                            </div>
                                            
                                        
                                        </div>
                                    </div>
                                </div>
                                    
                                <div class="card mb-4">
                                    
                                    <div class="card-body">
                                    <div>
                                        <div class="mb-4">
                                            
                                        <h4 class="mb-4">Information de la société</h4>
                                        
                                        </div>
                                        <div className="row">

                                            <div class="mb-3 col-md-6">
                                                <label class="form-label">Adresse E-mail <span className="text-danger">*</span></label>
                                                <input type="text" class="form-control"  required onChange={handleChange} value={compteData.email} name="email"/>
                                                {errors && errors.email && (
                                                    <span className="text-danger">{errors.email[0]}</span>
                                                )}
                                            </div>
                                            <div class="mb-3 col-md-6">
                                                <label class="form-label">Manager <span className="text-danger">*</span></label>
                                                <input type="text" class="form-control"  required onChange={handleChange} value={compteData.lead_fullName} name="lead_fullName"/>
                                                {errors && errors.lead_fullName && (
                                                    <span className="text-danger">{errors.lead_fullName[0]}</span>
                                                )}
                                            </div>

                                        </div>
                                        
                                        <div className="row">

                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Télephone<span className="text-danger">*</span></label>
                                                    <input type="text"  class="form-control"  required onChange={handleChange} name="tel" max="10"/>
                                                    
                                                    {errors && errors.tel && (
                                                        <span className="text-danger">{errors.tel[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label">Fax</label>
                                                    <input type="text" class="form-control" name="fax"  onChange={handleChange} />
                                                    {errors && errors.fax && (
                                                        <span className="text-danger">{errors.fax[0]}</span>
                                                    )}
                                                </div>
                                            </div>                                    
                                    
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Registre de commerce</label>
                                            <input type="text" class="form-control"  onChange={handleChange} name="registre_num"/>
                                            {errors && errors.registre_num && (
                                                <span className="text-danger">{errors.registre_num[0]}</span>
                                            )}
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Adresse de la société</label>
                                            <input type="text" class="form-control"  onChange={handleChange} name="adresse"/>
                                            {errors && errors.adresse && (
                                                <span className="text-danger">{errors.adresse[0]}</span>
                                            )}
                                        </div>
                                    

                                        <div>
                                            
                                        <h5 class="mb-1">Logo de la société</h5>
                                        <div action="#" class="d-block dropzone border-dashed rounded-2">
                                            <div class="fallback">
                                            <input name="logo" type="file" onChange={handleFileChangeLogo} />
                                            </div>
                                        </div>
                                            {errors && errors.logo && (
                                                <span className="text-danger">{errors.logo[0]}</span>
                                            )}

                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                {/* <div class="col-lg-6 col-12">
                                    
                                <div class="card mb-4">
                                    
                                    <div class="card-body">
                                        
                                    <div class="form-check form-switch mb-4">
                                        <i class="fa-solid fa-user fa-lg"></i>
                                        <label class="form-check-label text-info" for="flexSwitchStock">Veuillez renseigner les informations de d'administrateur de ce compte</label>
                                    </div>
                                        
                                    <div>
                                        <div class="mb-3">
                                        <label class="form-label">Nom<span className="text-danger">*</span></label>
                                        <input type="text" class="form-control" onChange={handleChange} name="use_nom"/>
                                            {errors && errors.use_nom && (
                                                <span className="text-danger">{errors.use_nom[0]}</span>
                                            )}
                                        </div>
                                        
                                        <div class="mb-3">
                                        <label class="form-label">Prénoms<span className="text-danger">*</span></label>
                                        <input type="text"  class="form-control" onChange={handleChange} name="use_prenom"/>
                                            {errors && errors.use_prenom && (
                                                <span className="text-danger">{errors.use_prenom[0]}</span>
                                            )}
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
                                        
                                    
                                        <div class="mb-3">
                                            <label class="form-label">Email<span className="text-danger">*</span></label>
                                            <input type="email" name='email' onChange={handleChange} class="form-control w-100" required />
                                            {errors && errors.email && (
                                                <span className="text-danger">{errors.email[0]}</span>
                                            )}
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Contact<span className="text-danger">*</span></label>
                                            <input name='phone' type="text" onChange={handleChange} class="form-control w-100" required max={10}/>
                                            {errors && errors.phone && (
                                                <span className="text-danger">{errors.phone[0]}</span>
                                            )}
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

                                    </div>
                                    </div>
                                </div>
                                    
                                 <div class="card mb-4">
                                    
                                    <div class="card-body">
                                        
                                    <div class="mb-3">
                                        <label class="form-label">Rôle<span className="text-danger">*</span></label>
                                        <select class="form-select" aria-label="Default select example" onChange={handleChange} name="role_id">
                                            <option selected>---</option>
                                            {roleList?.map((role,index)=>
                                                <option value={role.id}>{role.rol_libelle}</option>
                                            )}
                                            
                                        </select>
                                        {errors && errors.role_id && (
                                            <span className="text-danger">{errors.role_id[0]}</span>
                                        )}
                                    </div>
                                        
                                
                                    </div>
                                </div> 
                                    
                            
                                    
                             
                                </div> */}
                                <div class="d-grid">
                                    {!loading &&
                                        <button type="submit" class="btn btn-primary">
                                            Creer un nouveau compte
                                        </button>
                                    }
                                    {loading &&
                                    <button class="btn btn-primary" type="button" disabled>
                                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        Enregistrement en cours...
                                    </button>
                                    }
                                   
                                </div>
                            </form>
                        </div>
                </div>
            </ContentSection>
        </>
    )
}

export default CreateCompte;