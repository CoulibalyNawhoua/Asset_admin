import { useEffect, useState } from "react";
import ContentSection from "../../Content";
import Select from "react-select";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const url = BaseUrl();
function CreateDemandeAffectationWebApp()
{
    const [errors, setErrors] = useState({});
    const [error,setError] = useState();
    const navigate = useNavigate();

    const [pdvList,setPdvList] = useState([]);
    const [secteursList,setSecteursList] = useState([]);
    const [image, setImage] = useState([]);
    const [selectSecteur,setSelectSecteur]= useState(null);
    const [selectPdv,setSelectPdv]= useState(null);
    const [description,setDescription] = useState('');
    const [loading,setLoading] = useState(false);
    const [categorieList,setCategorieList] = useState([]);
    const [selectCategorie,setSelectCategorie] = useState(null);

    useEffect(()=>{
        get_pdv_all();
        get_secteurs_list();
        get_categorie_materiel();
    },[]);

    function get_pdv_all()
    {
        try {
            axios.get(url.base+'/setting/pointdevente-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setPdvList(resp.data.data);
                } else {
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    function get_secteurs_list()
    {
        try {
            axios.get(url.base+'/setting/territoire-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setSecteursList(resp.data.data);
                } else {
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    function get_categorie_materiel()
    {
        try {
            axios.get(url.base+'/setting/category-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setCategorieList(resp.data.data);
                }
                // setLoading(false);
            })
        } catch (error) {
            console.log(error);
            // setLoading(false);
        }
    }


    const optioncategories = categorieList?.map((option)=>({
        label : `${option.libelle}`,
        value : `${option.id}`
    }));


    const optionSecteurs = secteursList?.map((option)=>({
        label:`${option.libelle}`,
        value:`${option.id}`
    }));

    const optionPdvs = pdvList?.map((option)=>({
        label: `${option.NomPdv} ${option.Contact}`,
        value: `${option.Id}`
    }))

    const onSelectFile = (event) => {
        if(image?.length + 1 <= 2){
            setImage((image)=>image.concat(event.target.files[0]));   
        }
             
    };

    function deleteHandler(index) {
        const updatedImage = [...image];
        updatedImage.splice(index, 1);
        setImage(updatedImage);
    }

    const handleChangeSecteur=(selectOption)=>{
        setSelectSecteur(selectOption.value);
    }

    const handleChangePdv=(selectOption)=>{
        setSelectPdv(selectOption.value);
    }

    const handleChangeCategorie=(selectOption)=>{
        setSelectCategorie(selectOption.value);
    }



    const submitForm=(e)=>{
        e.preventDefault();
        const _formData = new FormData();
        

        if(selectPdv !== null && selectSecteur !== null && selectCategorie !== null && description !== "" && image.length > 0)
        {
            _formData.append("description",description);
            _formData.append("territoire_id",selectSecteur !== null ? selectSecteur : "");
            _formData.append("pointdevente_id",selectPdv !== null ? selectPdv : "");
            _formData.append("categorie_id",selectCategorie !== null ? selectCategorie : "");
    
            Array.from(image).forEach((item, index) => {
                const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
                const originalExtension = item.name.split('.').pop();
                const newFileName = `${currentTimeInSeconds}_${index}.${originalExtension}`;
                const photo = new File([item], newFileName, { type: item.type });
                _formData.append('images[]', photo);
            });
            setLoading(true);
            try {
                axios.post(url.base+'/affectation-demande-store',_formData,
               {
                   headers:{
                       'Content-Type':'multipart/form-data',
                       "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                       
                   },
                   credentials:'include'
               }
               ).then((resp)=>{          
                   setLoading(false);
                   
                   if(resp.data.code == 400)
                    {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title:  resp.data.msg,
                            showConfirmButton: false,
                            timer: 5000,
                            toast:true,
                            position:'top-right',
                            timerProgressBar:true
                          });
                    }else{
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title:  "La demande d'affectation a été prise en compte",
                            showConfirmButton: false,
                            timer: 5000,
                            toast:true,
                            position:'top-right',
                            timerProgressBar:true
                          });
                          navigate('/affectations/list');
                          setErrors({});
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
        else
        {
            if(selectSecteur == null)
            {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title:  "Veuillez selectionner le secteur",
                    showConfirmButton: false,
                    timer: 3000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                    });
            }else if(selectPdv == null){
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title:  "Veuillez selectionner un PDV",
                    showConfirmButton: false,
                    timer: 3000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                  });
            }else if(selectCategorie == null){
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title:  "Veuillez selectionner une catégorie",
                    showConfirmButton: false,
                    timer: 3000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                  });
            }else if(description == "")
            {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title:  "La description est obligatoire",
                    showConfirmButton: false,
                    timer: 3000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                    });
            }else if(image.length == 0)
            {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title:  "Veuillez ajouter une pièce s'il vous plait",
                    showConfirmButton: false,
                    timer: 3000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                });
            }


        }



    }

    return (
        <>
            <ContentSection ulShownav={"gest-affectations"} navactive={"list-affectation"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                            
                                <div class="mb-5">
                                    <h3 class="mb-0 text-center card ">Enregistrer une demande d'affectation</h3>

                                </div>
                            </div>
                        </div>
                        <div>
                            

                            <form class="row" onSubmit={submitForm}>
                            <div class="col-lg-2 col-2"></div>
                                <div class="col-lg-8 col-8">
                                    
                             
                                    <div class="card mb-4">
                                        
                                        <div class="card-body">
                                        <div>
                                            <div class="mb-4">
                                                
                                            <h4 class="mb-4">Information de la demande</h4>
                                            
                                            </div>
                                            <div className="row">

                                               
                                                <div class="mb-3 col-md-6">
                                                    <label class="form-label">Selectionner un territoire <span className="text-danger">*</span></label>
                                                    <Select options={optionSecteurs} onChange={handleChangeSecteur}/>
                                                
                                                </div>
                                                
                                                <div className="col-md-6">
                                                    <div class="mb-3">
                                                        <label class="form-label">Choisissez un PDV<span className="text-danger">*</span></label>
                                                       <Select options={optionPdvs} onChange={handleChangePdv}/>
                                                        
                                                    
                                                    </div>
                                                </div>
                                            </div> 

                                            <div class="mb-3 col-12">
                                                <label class="form-label" for="textInput">Catégorie de matériel {error !== "" && selectCategorie == null && <span className="text-danger">{error}</span>}</label>
                                                <Select options={optioncategories} onChange={handleChangeCategorie}/>
                                            
                                            </div>
                                            
                                            <div className="row">

                                                <div className="col-md-12">
                                                    <div class="mb-3">
                                                        <label class="form-label">Description<span className="text-danger">*</span></label>
                                                        <textarea class="form-control" onChange={(e)=>setDescription(e.target.value)}></textarea>
                                                        
                                                    
                                                    </div>
                                                </div>
                                                
                                        
                                            </div>
                                            <div class="col-12 ">
                                                <h5 class="card-title mb-0 col-6">Associé une pièce recto-verso <span className="text-danger col-6">(vous ne pouvez ajouter que 2 images)</span></h5>
                                            </div>
                                            <div class="container">
                            
                                                <div class="card mt-3">
                                                    <div class="card-body">

                                                        <div class="row mb-3">
                                                            <div class="col-sm-10">
                                                            <div class="tab-pane fade show active" id="tab-1">
                                                                <div class="row g-3">

                                                                
                                                                    <div class="col-6 col-lg-3">
                                                                        <div class=" rounded text-center d-flex align-items-center justify-content-center position-relative">
                                                                            <label class="btn " >
                                                                            <input className="input-none"
                                                                                type="file"
                                                                                onChange={onSelectFile}
                                                                                multiple
                                                                                accept="image/png , image/jpeg, image/webp"
                                                                                />
                                                                                <i class="fa-solid fa-camera-retro fs-1"></i>
                                                                                <h6>Ajouter une Pièce</h6>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    
                                        
                                                                {image &&
                                                                    image.map((img, index) => {
                                                                        return (
                                                                    <div class="col-6 col-lg-3 position-relative" key={index}>
                                                                        <div class="position-absolute top-0 center-0">
                                                                        
                                                                            <div class="dropdown mb-2 me-1">
                                                                                <button type="button" class="btn icon-sm  text-white rounded-circle" id="photoActionEdit3" onClick={() => deleteHandler(index)}>
                                                                                    <i class="bi bi-trash-fill bg-danger"></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    
                                                                            <img class="rounded img-fluid" src={img ? URL.createObjectURL(img): null}  alt="" width={100} height={50} style={{"border":"solid"}}/>
                                                                        
                                                                    </div> 

                                                                    );
                                                                    })}
                                                                    
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>

                                            {/* <div class="mb-3">
                                                <label class="form-label">Registre de commerce</label>
                                                <input type="text" class="form-control"   name="registre_num"/>
                                            
                                            </div> */}
                                            {/* <div class="mb-3">
                                                <label class="form-label">Adresse de la société</label>
                                                <input type="text" class="form-control"   name="adresse"/>
                                            
                                            </div> */}
                                        

                                            {/* <div>
                                                
                                            <h5 class="mb-1">Logo de la société</h5>
                                            <div action="#" class="d-block dropzone border-dashed rounded-2">
                                                <div class="fallback">
                                                <input name="logo" type="file"  />
                                                </div>
                                            </div>
                                    

                                            </div> */}
                                        </div>
                                        </div>
                                    </div>

                                    <div class="d-grid">

                                        <button type="submit" class={!loading ? "btn btn-primary" : "btn btn-primary disabled"}>
                                            Enregistrer une nouvelle demande
                                        </button>
                                        {/* <button class="btn btn-primary" type="button" disabled>
                                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                            Enregistrement en cours...
                                        </button> */}
                                    
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
                                
                            </form>
                        </div>
                </div>
            </ContentSection>
        </>
    )
}

export default CreateDemandeAffectationWebApp;