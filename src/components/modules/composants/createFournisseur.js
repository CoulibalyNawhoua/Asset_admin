import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../utils/BaseUrl";
import ContentSection from "../Content";
import Select from "react-select";

const url = BaseUrl();
function CreateFournisseurComponent(){
    const [errors,setErrors] = useState({});
    const [errorMarque,setErrorMarque] = useState(null);
    const [loadingf, setLoadingf] = useState(false);
    const [itemData,setItemData] = useState({
        "name":"",
        "desciption":"",
        "siege":"",
        "adresse":"",
        "tel":"",
        "email":"",
    });

    const [marqueList,setMarqueList] = useState([]);
    const [selectedOptionMarques, setSelectedOptionMarques] = useState([]);

    useEffect(()=>{
        try {
            axios.get(url.base+'/setting/marque-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setMarqueList(resp.data.data);
                }
                // setLoading(false);
            })
        } catch (error) {
            // setLoading(false);
        }
    },[]);

    const handleChange=(e)=>{
        setItemData({
            ...itemData,
            [e.target.name]:e.target.value
        });
    }

    const handleChangeMarque=(selectedOption)=>{
        setSelectedOptionMarques(selectedOption);
      }

      const options = marqueList?.map((item)=>({
        value: item.id,
        label:`${item.libelle}`
      }));

    const submitForm= (e)=>{
        e.preventDefault();

         const MarquesValue = selectedOptionMarques.map(option =>option.value);
        const _formData = new FormData();
        _formData.append('name',itemData.name);
        _formData.append('desciption',itemData.desciption);
        _formData.append('siege',itemData.siege);
        _formData.append('adresse',itemData.adresse);
        _formData.append('tel',itemData.tel);
        _formData.append('email',itemData.email);
        _formData.append('marqueTab',MarquesValue);
       
        // console.log(_formData);
        setLoadingf(true);
        try {
            axios.post(url.base+'/setting/fournisseur-store',_formData,
            {
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
                // credentials:'include'
            }
            ).then((resp)=>{
                setLoadingf(false);
                if(resp.status == 200){
                    // console.log(resp.data);
                    setErrors({});
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title:  resp.data.message,
                        showConfirmButton: false,
                        timer: 3000,
                        toast:true,
                        position:'top-right',
                        timerProgressBar:true
                      });
                      setItemData({
                        "name":"",
                        "desciption":"",
                        "siege":"",
                        "adresse":"",
                        "tel":"",
                        "email":"",
                    });
                    setSelectedOptionMarques(null);
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
            }).catch((error)=>{                
                setLoadingf(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoadingf(false);

        }
    }




    return (
        <>
     
          
            <div class="row">
              <form class="col-xl-9 col-md-12 col-12" onSubmit={submitForm}>
              
                <div class="card mb-5">
                 
                  <div class="card-body">
                 
                    <div class="row" >
                      
                      <div class="mb-3 col-12">
                        <label class="form-label">Nom du fournisseur</label>
                        <input type="text" class="form-control" name="name" onChange={handleChange} value={itemData.name}/>
                        {errors && errors.name && (
                            <span className="text-danger">{errors.name[0]}</span>
                        )}
                      </div>
                      
                      <div class="mb-3 col-12">
                            <div class="mb-3">
                                <label for="textarea-input" class="form-label">Description du fournisseur</label>
                                <textarea class="form-control" id="textarea-input" rows="2" name="desciption" onChange={handleChange} value={itemData.desciption}></textarea>
                                {errors && errors.desciption && (
                                    <span className="text-danger">{errors.desciption[0]}</span>
                                )}
                            </div>
                       </div>
                      
                      <div class="mb-4 col-md-6 col-12">
                      <label class="form-label">Ville</label>
                        <input type="text" class="form-control" name="siege" onChange={handleChange} value={itemData.siege}/>
                        {errors && errors.siege && (
                                    <span className="text-danger">{errors.siege[0]}</span>
                                )}
                      </div>
                      
                      <div class="mb-4 col-md-6 col-12">
                      <label class="form-label">Adresse</label>
                        <input type="text" class="form-control" name="adresse" onChange={handleChange} value={itemData.adresse}/>
                        {errors && errors.adresse && (
                                    <span className="text-danger">{errors.adresse[0]}</span>
                                )}
                      </div>
                      
                      
                      <div class="mb-4 col-md-6 col-12">
                      <label class="form-label">E-mail</label>
                        <input type="text" class="form-control" name="email" onChange={handleChange} value={itemData.email}/>
                        {errors && errors.email && (
                                    <span className="text-danger">{errors.email[0]}</span>
                                )}
                      </div>
                    
                      <div class="mb-4 col-md-6 col-12">
                        <label class="form-label">Contacts</label>
                        <input type="text" class="form-control" name="tel" onChange={handleChange} value={itemData.tel}/>
                        {errors && errors.tel && (
                                    <span className="text-danger">{errors.tel[0]}</span>
                                )}
                      </div>

                      <div class="mb-3 col-12">
                        <label class="form-label">Marques associées</label>
                        <Select value={selectedOptionMarques} options={options}  onChange={handleChangeMarque} isMulti />
                      </div>



                      {/* <div class="col-md-3 col-12 mb-4">
                        <div>
                    
                          <h5 class="mb-2">Project Logo </h5>
                          <div class="icon-shape icon-xxl border rounded position-relative">
                            <span class="position-absolute"> <i class="bi bi-image fs-3  text-muted"></i></span>
                            <input class="form-control border-0 opacity-0" type="file" />

                          </div>

                        </div>
                      </div> */}
                      {/* <div class="col-12 mb-4">
                        <h5 class="mb-2">Cover Image </h5>
                        <form action="#" class="d-block dropzone border-dashed min-h-0 rounded-2 dz-clickable">
                          
                        <div class="dz-default dz-message"><button class="dz-button" type="button">Drop files here to upload</button></div></form>
                      </div> */}
                    </div>
                  </div>
                </div>
                {/* <div class="card mb-5 ">
                  <div class="card-header">
                    <h4 class="mb-0">Attached files</h4>
                  </div>
                  <div class="card-body">
                    <div>
                      <h5>Add Attached files here.</h5>
                      <div class=" p-10  border-dashed mb-4 text-center">
                        <span>Drop files here to upload</span>
                      </div>
                      <div class="card card-bordered  mb-4 ">
                        <div class="card-body">
                          <div class="d-flex justify-content-between">
                            <div class="d-flex align-items-center">
                              <img src="../assets/images/background/profile-bg.jpg" alt="" class="icon-shape icon-xxl rounded-3" />
                              <div class="ms-3">
                                <h6 class="mb-0">Uploaded Image Title 02-08-2023 at 4:35:56 PM.png</h6>
                                <small>0.8 MB</small>
                              </div>
                            </div>
                            <div>
                              <a href="#!" class="link-danger"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card card-bordered  mb-4 ">
                        <div class="card-body">
                          <div class="d-flex justify-content-between">
                            <div class="d-flex align-items-center">
                              <img src="../assets/images/background/profile-bg.jpg" alt="" class="icon-shape icon-xxl rounded-3" />
                              <div class="ms-3">
                                <h6 class="mb-0">Uploaded Image Title 02-08-2023 at 4:35:56 PM.png</h6>
                                <small>0.8 MB</small>
                              </div>
                            </div>
                            <div>
                              <a href="#!" class="link-danger"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div class="mt-4 d-flex justify-content-end">
                {!loadingf && <button type="submit" class="btn btn-primary btn-sm">Enregistrer</button>}
                {loadingf && <button class="btn btn-primary btn-sm" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Chargement...
                </button>}
                </div>
              </form>
              {/* <div class="col-xl-3">
                <div class="card mb-5">
                  <div class="card-header">
                    <h4 class="mb-0">Members</h4>
                  </div>
                  <div class="card-body">
                    <h5>Team Lead</h5>
                    <select class="form-select">
                      <option selected="">Select Team Lead</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                    <div class="mt-6">
                      <h5 class="mb-4">Team Members</h5>
                      <div class="d-flex align-items-center">
                        
                        <div class="avatar-group">
                          <span class="avatar avatar-sm">
                          
                            <img alt="avatar" src="../assets/images/avatar/avatar-11.jpg" class="rounded-circle
                imgtooltip" data-template="one" />
                            <span id="one" class="d-none">
                              <span>Paul Haney</span>
                            </span>
                          </span>
                        
                          <span class="avatar avatar-sm">
                            <img alt="avatar" src="../assets/images/avatar/avatar-2.jpg" class="rounded-circle
                imgtooltip" data-template="two" />
                            <span id="two" class="d-none">
                              <span>Gali Linear</span>
                            </span>
                          </span>
                        
                          <span class="avatar avatar-sm">
                            <img alt="avatar" src="../assets/images/avatar/avatar-3.jpg" class="rounded-circle
                imgtooltip" data-template="three" />
                            <span id="three" class="d-none">
                              <span>Mary Holler</span>
                            </span>
                          </span>
                       
                          <span class="avatar avatar-sm">
                            <img alt="avatar" src="../assets/images/avatar/avatar-4.jpg" class="rounded-circle
                imgtooltip" data-template="four" />
                            <span id="four" class="d-none">
                              <span>Lio Nordal</span>
                            </span>
                          </span>
                      
                          <span class="avatar avatar-sm">
                            <span class="avatar-initials
                rounded-circle bg-light
                text-dark">5+</span>
                          </span>
                        </div>
                  
                        <a href="#!" class="btn btn-icon btn-white btn-sm border border-2 rounded-circle btn-dashed ms-2">

                          +

                        </a>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="card ">
                  <div class="card-header">
                    <h4 class="mb-0">Meta</h4>
                  </div>
                  <div class="card-body">
                    <label class="form-label">Categories</label>
                    <select class="form-select">
                      <option selected="">Select Categories</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                    <div class="mt-4">
                      <label class="form-label">Tags</label>
                      <div class="choices" data-type="text" aria-haspopup="true" aria-expanded="false"><div class="choices__inner">
                        <input class="form-control choices__input" id="choices-text-input" data-choices="" data-choices-limit="Required Limit" placeholder="Enter Skills" type="text" value="Creative,Dash ui" hidden="" tabindex="-1" data-choice="active" />
                        <div class="choices__list choices__list--multiple">
                        <div class="choices__item choices__item--selectable" data-item="" data-id="1" data-value="Creative" data-custom-properties="[object Object]" aria-selected="true">Creative</div><div class="choices__item choices__item--selectable" data-item="" data-id="2" data-value="Dash ui" data-custom-properties="[object Object]" aria-selected="true">Dash ui</div></div><input type="search" name="search_terms" class="choices__input choices__input--cloned" autocomplete="off" autocapitalize="none" spellcheck="false" role="textbox" aria-autocomplete="list" aria-label="null" /></div><div class="choices__list choices__list--dropdown" aria-expanded="false"></div></div>
                    </div>
                  </div>

                </div>
              </div> */}
            </div>
        </>
    )
}

export default CreateFournisseurComponent;