import { useContext, useEffect, useState } from "react";
import ContentSection from "../Content";
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';
import axios from "axios";
import BaseUrl from "../../utils/BaseUrl";
import Swal from "sweetalert2";
import SwalTopEnd from "../../utils/swal_top_end";
import { UserContext } from "../../utils/User_check";
import can from "../../utils/Can";

const url = BaseUrl();
function CreateMaterielComponent(){
  const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [error,setError] = useState();
    const [loading,setLoading] = useState(false);
    const [categories,setCategories] = useState([]);
    const [marques,setMarques] = useState([]);
    const [modeles,setModeles] = useState([]);
    const [capacites,setDepots] = useState([]);
    const [fournisseurs,setFournisseurs] = useState([]);

    const [selectOptionCat,setSelectionCat] = useState(null);
    const [selectOptionMarque,setSelectionMarque] = useState(null);
    const [selectOptionModel,setSelectionModel] = useState(null);
    const [selectOptioncapacity,setSelectionDepot] = useState(null);
    const [selectOptionFournisseur,setSelectionFournisseur] = useState(null);
    const {user,permissions} = useContext(UserContext);
    const [materielData,setMaterielData] = useState({
      "libelle":"",
      "num_serie":"",
      "date_acquisition":"",
      "image":"",
      "description":"",
      "prix_achat":0
    });
      useEffect(()=>{
        if(!can(permissions,'add-update-article')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);

    useEffect(()=>{
      categorieFunctionList();
      marquesFunctionList();
      depotFunctionList();
      fournisseurFunctionList();
    },[]);

    const categorieFunctionList=()=>{
      try {
        axios.get(url.base+'/setting/category-list',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

              if(resp.status == 200){
                setCategories(resp.data.data);
              }
          })
      } catch (error) {
        console.log(error);
      }
     
    }

    const marquesFunctionList=()=>{
      try {
        axios.get(url.base+'/setting/marque-list',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

              if(resp.status == 200){
                setMarques(resp.data.data);
              }
          })
      } catch (error) {
        console.log(error);
      }
     
    }


    const depotFunctionList=()=>{
      try {
        axios.get(url.base+'/capacites-list',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

              if(resp.status == 200){
                setDepots(resp.data.data);
              }
          })
      } catch (error) {
        console.log(error);
      }
     
    }

    const fournisseurFunctionList=()=>{
      try {
        axios.get(url.base+'/setting/fournisseur-list',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

              if(resp.status == 200){
                setFournisseurs(resp.data.data);
              }
          })
      } catch (error) {
        console.log(error);
      }
     
    }

    const optionCategories = categories?.map((option)=>({
      label:`${option.libelle}`,
      value:`${option.id}`
    }));

    const optionmarques = marques?.map((option)=>({
      label:`${option.libelle}`,
      value:`${option.id}`
    }));

    const optionmodels = modeles?.map((option)=>({
      label:`${option.libelle}`,
      value:`${option.id}`
    }));

    const optiondepots = capacites?.map((option)=>({
      label:`${option.libelle}`,
      value:`${option.id}`
    }));

    const optionfournisseurs = fournisseurs?.map((option)=>({
      label:`${option.name}`,
      value:`${option.id}`
    }));


    const handleChange=(event)=>{
      setMaterielData({
        ...materielData,
        [event.target.name]:event.target.value
      })
    }

    const handleChangeCategories=(selectOption)=>{
      setSelectionCat(selectOption.value);
    }

    const handleChangeMarques=(selectOption)=>{
      setSelectionMarque(selectOption.value);
      try {
        axios.get(url.base+'/modele-marqueView/'+selectOption.value,{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

              if(resp.status == 200){
                setModeles(resp.data.data);
              }
          })
      } catch (error) {
        console.log(error);
      }
    }

    const handleChangeModels=(selectOption)=>{
      setSelectionModel(selectOption.value);
    }

    const handleChangeDepots=(selectOption)=>{
      setSelectionDepot(selectOption.value);
    }

    const handleChangeFournisseurs=(selectOption)=>{
      setSelectionFournisseur(selectOption.value);
    }

    const handleFileChange=(event)=>{
      setMaterielData({
          ...materielData,
          [event.target.name]:event.target.files[0]
      });
      }


      const submitForm=async(e)=>{
        e.preventDefault();
        const _formData = new FormData();
        
        _formData.append("libelle",materielData.libelle);
        _formData.append("prix_achat",materielData.prix_achat);
        _formData.append("description",materielData.description);
        _formData.append("capacite_id",selectOptioncapacity !== null ? selectOptioncapacity : "");
        _formData.append("categorie_id",selectOptionCat !== null ? selectOptionCat : "");
        _formData.append("modele_id",selectOptionModel !== null ? selectOptionModel : "");
        _formData.append("marque_id",selectOptionMarque !== null ? selectOptionMarque : "");
        _formData.append("fournisseur_id",selectOptionFournisseur !== null ? selectOptionFournisseur : "");

        if(materielData.image !=""){
          const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
          const originalExtension = materielData.image.name.split('.').pop();
          const newFileName = `${currentTimeInSeconds}_image_.${originalExtension}`;
          const photo = new File([materielData.image], newFileName, { type: materielData.image.type });
          
          _formData.append("image",photo);
      }

      console.log(_formData);

      setLoading(true);
      try {
          axios.post(url.base+'/materials-store',_formData,
         {
             headers:{
                 'Content-Type':'multipart/form-data',
                 "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                 
             },
             credentials:'include'
         }
         ).then((resp)=>{          
             setLoading(false);
             
              SwalTopEnd({icon:"success",title:"Matériel enregistré avec succès !"})

              navigate('/materiels/list');
              setErrors({});

         }).catch((error)=>{
             setLoading(false);
             setError(error.response.data.message);
             setErrors(error.response.data.error);

         })
     } catch (error) {
         console.log(error.response);
     } 


      }


    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"gest-materiel"}>
                  <div className="row">
                      <div className="col-lg-12 col-md-12 col-12">
                          
                          <div className="mb-5">
                              <h3 className="mb-0 ">Ajouter un article
                                  <Link  className="btn btn-primary me-2 float-end btn-sm" to="/materiels/list">Afficher la liste</Link>
                              </h3>
                          </div>
                      </div> 
                  </div>
                  <div className="row">
                    <form className="col-xl-12 col-md-12 col-12" onSubmit={submitForm}>
                    
                      <div className="card mb-5">
                      
                        <div className="card-body">
                      
                          <div className="row" >
                            
                            <div className="mb-3 col-12">
                              <label className="form-label">Libelle</label>
                              <input type="text" className="form-control" name="libelle" onChange={handleChange} />
                              {errors && errors.libelle && (
                                  <span className="text-danger">{errors.libelle[0]}</span>
                              )}
                            </div>
                            
                             <div className="mb-3 col-12">
                                  <div className="mb-3">
                                      <label for="textarea-input" className="form-label">Prix d'achat du matériel</label>
                                      <input type="number" className="form-control" name="prix_achat" onChange={handleChange} value={materielData.prix_achat}/>
                                      
                                  </div>
                            </div> 

                            <div className="mb-4 col-md-6 col-12">
                            <label className="form-label">Catégories</label>
                            <Select  options={optionCategories} onChange={handleChangeCategories}/>
                            
                            {errors && errors.categorie_id && (
                                  <span className="text-danger">{errors.categorie_id[0]}</span>
                              )}
                            </div>
                            <div className="mb-4 col-md-6 col-12">
                            <label className="form-label">Marques</label>
                            <Select  options={optionmarques} onChange={handleChangeMarques}/>
                            {errors && errors.marque_id && (
                                  <span className="text-danger">{errors.marque_id[0]}</span>
                              )}
                            </div>
                            
                            
                            <div className="mb-4 col-md-4 col-12">
                            <label className="form-label">Modeles</label>
                            <Select  options={optionmodels} onChange={handleChangeModels}/>
                          
                            {errors && errors.modele_id && (
                                  <span className="text-danger">{errors.modele_id[0]}</span>
                              )}
                            </div>
                          
                            

               

                            <div className="mb-3 col-md-4 col-12">
                              <label className="form-label">Fournisseurs</label>
                              <Select options={optionfournisseurs} onChange={handleChangeFournisseurs}/>
                              
                              {errors && errors.fournisseur_id && (
                                  <span className="text-danger">{errors.fournisseur_id[0]}</span>
                              )}
                            </div>
                            <div className="mb-3 col-md-4 col-12">
                                <label className="form-label">Capacité du matériel</label>
                                <Select options={optiondepots} onChange={handleChangeDepots}/>
                                
                                {errors && errors.capacite_id && (
                                    <span className="text-danger">{errors.capacite_id[0]}</span>
                                )}
                            </div>

                            <div className="mb-4 col-md-12 col-12">
                              <label className="form-label">Description du matériel (facultatif)</label>
                                <textarea className="form-control" name="description" onChange={handleChange}></textarea>
                                {errors && errors.description && (
                                    <span className="text-danger">{errors.description[0]}</span>
                                )}
                            </div>


                            {/* <div className="col-md-3 col-12 mb-4">
                              <div>
                          
                                <h5 className="mb-2">Project Logo </h5>
                                <div className="icon-shape icon-xxl border rounded position-relative">
                                  <span className="position-absolute"> <i className="bi bi-image fs-3  text-muted"></i></span>
                                  <input className="form-control border-0 opacity-0" type="file" />

                                </div>

                              </div>
                            </div>  */}
                            <div className="col-lg-12">
                                          <div className="form-group">
                                          <h4>Associer une image au matériel</h4>

                                              <div className="image-upload">
                                                  <input type="file" name='image' onChange={handleFileChange}/>
                                                  <div className="image-uploads">
                                                    
                                                  </div>
                                                {materielData.image &&  <img src={materielData.image ? URL.createObjectURL(materielData.image): null} width="20%" height="30%" className='border'/>} 
                                              </div>
                                              {errors && errors.image && (
                                                    <span className="text-danger">{errors.image[0]}</span>
                                                )}
                                          </div>
                                      </div>
                          </div>
                          <hr />
                          <div className="mt-4 d-flex justify-content-end">
                            {!loading && <button type="submit" className="btn btn-primary">Enregistrer</button>}
                            {loading && <button className="btn btn-primary " type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Chargement...
                            </button>}
                          </div> 
                        </div>
                      </div>
                      {/* <div className="card mb-5 ">
                        <div className="card-header">
                          <h4 className="mb-0">Attached files</h4>
                        </div>
                        <div className="card-body">
                          <div>
                            <h5>Add Attached files here.</h5>
                            <div className=" p-10  border-dashed mb-4 text-center">
                              <span>Drop files here to upload</span>
                            </div>
                            <div className="card card-bordered  mb-4 ">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <img src="../assets/images/background/profile-bg.jpg" alt="" className="icon-shape icon-xxl rounded-3" />
                                    <div className="ms-3">
                                      <h6 className="mb-0">Uploaded Image Title 02-08-2023 at 4:35:56 PM.png</h6>
                                      <small>0.8 MB</small>
                                    </div>
                                  </div>
                                  <div>
                                    <a href="#!" className="link-danger"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="card card-bordered  mb-4 ">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <img src="../assets/images/background/profile-bg.jpg" alt="" className="icon-shape icon-xxl rounded-3" />
                                    <div className="ms-3">
                                      <h6 className="mb-0">Uploaded Image Title 02-08-2023 at 4:35:56 PM.png</h6>
                                      <small>0.8 MB</small>
                                    </div>
                                  </div>
                                  <div>
                                    <a href="#!" className="link-danger"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    
                    </form>
                    {/* <div className="col-xl-3">
                      <div className="card mb-5">
                        <div className="card-header">
                          <h4 className="mb-0">Members</h4>
                        </div>
                        <div className="card-body">
                          <h5>Team Lead</h5>
                          <select className="form-select">
                            <option selected="">Select Team Lead</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                          <div className="mt-6">
                            <h5 className="mb-4">Team Members</h5>
                            <div className="d-flex align-items-center">
                              
                              <div className="avatar-group">
                                <span className="avatar avatar-sm">
                                
                                  <img alt="avatar" src="../assets/images/avatar/avatar-11.jpg" className="rounded-circle
                      imgtooltip" data-template="one" />
                                  <span id="one" className="d-none">
                                    <span>Paul Haney</span>
                                  </span>
                                </span>
                              
                                <span className="avatar avatar-sm">
                                  <img alt="avatar" src="../assets/images/avatar/avatar-2.jpg" className="rounded-circle
                      imgtooltip" data-template="two" />
                                  <span id="two" className="d-none">
                                    <span>Gali Linear</span>
                                  </span>
                                </span>
                              
                                <span className="avatar avatar-sm">
                                  <img alt="avatar" src="../assets/images/avatar/avatar-3.jpg" className="rounded-circle
                      imgtooltip" data-template="three" />
                                  <span id="three" className="d-none">
                                    <span>Mary Holler</span>
                                  </span>
                                </span>
                            
                                <span className="avatar avatar-sm">
                                  <img alt="avatar" src="../assets/images/avatar/avatar-4.jpg" className="rounded-circle
                      imgtooltip" data-template="four" />
                                  <span id="four" className="d-none">
                                    <span>Lio Nordal</span>
                                  </span>
                                </span>
                            
                                <span className="avatar avatar-sm">
                                  <span className="avatar-initials
                      rounded-circle bg-light
                      text-dark">5+</span>
                                </span>
                              </div>
                        
                              <a href="#!" className="btn btn-icon btn-white btn-sm border border-2 rounded-circle btn-dashed ms-2">

                                +

                              </a>
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="card ">
                        <div className="card-header">
                          <h4 className="mb-0">Meta</h4>
                        </div>
                        <div className="card-body">
                          <label className="form-label">Categories</label>
                          <select className="form-select">
                            <option selected="">Select Categories</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                          <div className="mt-4">
                            <label className="form-label">Tags</label>
                            <div className="choices" data-type="text" aria-haspopup="true" aria-expanded="false"><div className="choices__inner">
                              <input className="form-control choices__input" id="choices-text-input" data-choices="" data-choices-limit="Required Limit" placeholder="Enter Skills" type="text" value="Creative,Dash ui" hidden="" tabindex="-1" data-choice="active" />
                              <div className="choices__list choices__list--multiple">
                              <div className="choices__item choices__item--selectable" data-item="" data-id="1" data-value="Creative" data-custom-properties="[object Object]" aria-selected="true">Creative</div><div className="choices__item choices__item--selectable" data-item="" data-id="2" data-value="Dash ui" data-custom-properties="[object Object]" aria-selected="true">Dash ui</div></div><input type="search" name="search_terms" className="choices__input choices__input--cloned" autocomplete="off" autocapitalize="none" spellcheck="false" role="textbox" aria-autocomplete="list" aria-label="null" /></div><div className="choices__list choices__list--dropdown" aria-expanded="false"></div></div>
                          </div>
                        </div>

                      </div>
                    </div> */}
                  </div>
            </ContentSection>
        </>
    )
}

export default CreateMaterielComponent;