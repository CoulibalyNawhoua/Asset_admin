import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../../utils/BaseUrl";
import ContentSection from "../../Content";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import Select from "react-select";
import SwalTopEnd from "../../../utils/swal_top_end";
import { UserContext } from "../../../utils/User_check";
import { useNavigate } from "react-router-dom";
import can from "../../../utils/Can";



const url = BaseUrl();
const customerStyle = CustomerStyle();
function EntrepotPage(){
    const [errors,setErrors] = useState({});
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loadingf, setLoadingf] = useState(false);
    const [itemData,setItemData] = useState({
        "name":"",
        "dep_adresse":"",
        "ville":"",
        "dep_lieu":"",
        "dep_identifiant":"",
        "tel":"",
        "longitude":"",
        "latitude":"",
        "territoire_id":""
    });

    const [itemDataEdit,setItemDataEdit] = useState({
        "name":"",
        "adresse":"",
        "ville":"",
        "dep_lieu":"",
        "dep_identifiant":"",
        "tel":"",
        "longitude":"",
        "latitude":"",
        "territoire_id":""
    });
    const [item,setItem] = useState([]);

    const [itemsList,setItemsList] = useState([]);
    const [territoires,setTerritoires] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [selectOptionterritoire,setSelectionTerritoire] = useState(null);
    const [users,setUsers] = useState([]);
    const [selectUsers,setSelectUsers] = useState(null);

    const columns = [
        {
            name: 'CODE',
            selector: row => row.code,
            sortable: true,
        },
        {
          name: 'NOM DU DEPOT',
          selector: row => row.name,
          sortable: true,
        },
        {
            name: 'TELEPHONE',
            selector: row => row.tel,
            sortable: true,
        },

        {
            name: 'TERRITOIRE',
            selector: row => row.territoire?.libelle,
            sortable: true,
        },

        {
            name: 'ADRESSE',
            selector: row => row.adresse !=="undefined" ? row.adresse : "",
            sortable: true,
          },
          {
            name: 'LATITUDE',
            selector: row => row.latitude,
            sortable: true,
          },
          {
            name: 'LONGITUDE',
            selector: row => row.longitude !=="null" ? row.longitude : "",
            sortable: true,
          },

    
        {
          name: "Statut",
          selector : row => ( 
            <>
             {row.status == 1 && (
            <span className="badge bg-success">Actif</span>
            )}
            {row.status == 0 && (
                <span className="badge bg-danger">Inactif</span>
            )}
            </>
          )
        },
        {
            name: "Action",
            selector : row => (
                <>
                  {can(permissions,"add-update-depot") && 
                    <button className="btn btn-primary btn-sm mx-1" onClick={()=>update_modal(row)}><i class="fa-solid fa-pen"></i></button>
                  }
                  {can(permissions,"supprimer-depot") && 
                    <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button>
                  }

                <button className="btn btn-info btn-sm mx-1" onClick={()=>add_gest_modal(row)}><i class="fa-solid fa-person"></i></button>
                </>
            )
          },

    ];

    useEffect(()=>{
        if(!can(permissions,'depot-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);


    useEffect(()=>{
        fetchItemsList();
        TerritoireFunctionList();
        fetchUserList();
    },[]);


    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/setting/entrepot-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setItemsList(resp.data.data);
                    setItemsListFilter(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const fetchUserList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/users-gest-depots',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setUsers(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const handleChange=(e)=>{
        setItemData({
            ...itemData,
            [e.target.name]:e.target.value
        });
    }

    const handleChangeEdit=(e)=>{
        setItemDataEdit({
            ...itemDataEdit,
            [e.target.name]:e.target.value
        });
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
                    setTerritoires(resp.data.data);
                }
            })
        } catch (error) {
          console.log(error);
        }
       
      }
    const optionterritoire = territoires?.map((option)=>({
        label:`${option.libelle}`,
        value:`${option.id}`
    }));


      const handleChangeSelectTerritoire=(selectOption)=>{
        setSelectionTerritoire(selectOption.value);
      }
    const submitForm= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('name',itemData.name);
        _formData.append('adresse',itemData.adresse);
        _formData.append('ville',itemData.ville);
        _formData.append('tel',itemData.tel);
        _formData.append('longitude',itemData.longitude);
        _formData.append('latitude',itemData.latitude);
        _formData.append('territoire_id',selectOptionterritoire);

        setLoadingf(true);
        try {
            axios.post(url.base+'/setting/entrepot-store',_formData,
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
                        "adresse":"",
                        "ville":"",
                        "tel":"",
                        "longitude":"",
                        "latitude":"",
                    });
                      fetchItemsList();
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

    const deleteItem = async (id) => {
     
        Swal.fire({
            title: 'ATTENTION !',
            text: 'Êtes-vous sûre de vouloir supprimer cet élément.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText:"NON",
            confirmButtonText: 'OUI',
            cancelButtonColor:"red"
          }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.get(url.base+'/setting/entrepot-delete/?depot_id='+id,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`                                
                            },
                        }
                    ).then((resp)=>{
                        // console.log(resp.data);
                        if(resp.status == 200)
                        {
                            if(resp.data.status == 600)
                            {
                                Swal.fire(
                                    'Attention',
                                    resp.data.message,
                                    'error'
                                  )
                            }else{
                                Swal.fire(
                                    'Supprimé',
                                    resp.data.message,
                                    'success'
                                  )
                            }
                           
                        }
                        fetchItemsList();
                    })
                } catch (error) {
                    console.log(error);
                }

            
            }
          }); 
    }
    
    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.name.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    const update_modal=(item)=>{
        setItem(item);
        setSelectionTerritoire(item.territoire_id)
        setItemDataEdit({
            "name":item.name,
            "dep_adresse":item.dep_adresse,
            "ville":item.ville,
            "dep_lieu":item.dep_lieu,
            "dep_identifiant":item.dep_identifiant,
            "tel":item.tel,
            "longitude":item.longitude,
            "latitude":item.latitude,
            "territoire_id":item.territoire_id
        })
        window.$("#exampleModalUpdate").modal("show")
    }

    const add_gest_modal=(item)=>{
        setItem(item);
        window.$("#exampleModal-3").modal("show");
    } 


    const submitFormEdit= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('name',itemDataEdit.name);
        _formData.append('adresse',itemDataEdit.adresse);
        _formData.append('ville',itemDataEdit.ville);
        _formData.append('tel',itemDataEdit.tel);
        _formData.append('longitude',itemDataEdit.longitude);
        _formData.append('latitude',itemData.latitude);
        _formData.append('territoire_id',selectOptionterritoire);

        setLoadingf(true);
        try {
            axios.post(url.base+'/depot-update/'+item.id,_formData,
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
                    setSelectionTerritoire(null);
                    setErrors({});
                  SwalTopEnd({icon:"success",title:"Modification effectué avec succès."})
                  window.$("#exampleModalUpdate").modal("hide")
                      fetchItemsList();
                }else{
                     SwalTopEnd({icon:"error",title:"Un problème est subvenu."})
                }
            }).catch((error)=>{                
                setLoadingf(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoadingf(false);

        }
    }

    const optionusers = users?.map((option)=>({
        label:`${option.use_nom} ${option.use_prenom}`,
        value:`${option.id}`
    }));

    const handleChangeUsers=(selectoption)=>{
        setSelectUsers(selectoption.value);
    }

    const submitFormGestionnaire=(e)=>{
        e.preventDefault();
        const _formData = new FormData();
        _formData.append("user_id",selectUsers !== null ? selectUsers : "");

        setLoading(true);
        try {
            axios.post(url.base+'/gestionnaire-entrepot/'+item?.id,_formData,
           {
               headers:{
                   'Content-Type':'multipart/form-data',
                   "Authorization": `Bearer ${localStorage.getItem('_token_')}`                   
               },
               credentials:'include'
           }
           ).then((resp)=>{          
               setLoading(false);
               
               if(resp.data.code == 400){
                    SwalTopEnd({icon:"error",title:resp.data.msg});
               }else {
                Swal.fire({
                    icon: 'success',
                    title:  `Opération effectué avec succès.`,
                  });
               }
               setSelectUsers(null);
               window.$("#exampleModal-3").modal('hide');
               fetchItemsList();
           }).catch((error)=>{
            setLoading(false);
            setErrors(error.response.data.error);
           });
       } catch (error) {
           console.log(error.response);
       } 
    }


    return (
        <>
            <ContentSection ulShownav={"parametres"} navactive={"entrepot"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des depôts</h3>

                            </div>
                        </div>
                    </div>
                    <div>
                    
                    <div class="row">
                        <div class="col-12">
                            
                            <div class="card mb-4">
                                <div class="card-header  ">
                                    <div class="row">
                                        <div class=" col-lg-3 col-md-6">
                                            <input type="search" class="form-control " placeholder="Nom du depot" onChange={handleFilter}/>

                                        </div>
                                        <div class="col-lg-4 col-md-6 d-flex align-items-center mt-3 mt-md-0">
                                            {/* <label class="form-label me-2 mb-0">Statut</label>
                                        <select class="form-select" aria-label="Default select example">
                                            <option selected>Tous</option>
                                            <option value="1">In Progress</option>
                                            <option value="2">Delivered</option>
                                        </select> */}
                                        </div>




                                    <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">
                                    {can(permissions,"add-update-depot") && 
                                        <button a href="#!" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal-2">Ajouter</button>
                                    }
                                        <a href="#!" class="btn btn-light " >Exporter</a>
                                    </div>
                                </div>
                                </div>
                    <div class="card-body">
                        <div class="table-responsive">
                        <DataTable 
                                columns={columns} 
                                data={itemsList}
                                customStyles={customerStyle}
                                pagination
                                selectableRows
                                progressPending={loading}
                                progressComponent={
                                    <>
                                    <div class="text-center">
                                        <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    </>
                                } 
                            />
                        </div>
                    </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div> 

            <div class="modal fade" id="exampleModal-2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Ajouter un depot</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div class="modal-body">
                            
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Nom du dépot</label>
                                    <input type="text"  class="form-control" name="name" onChange={handleChange} value={itemData.name} placeholder="Saisissez la raison social" />
                                    {errors && errors.name && (
                                        <span className="text-danger">{errors.name[0]}</span>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label" for="selectOne">Territoire <span
                                                class="text-secondary">(Obligatoire)</span></label>
                                                <Select options={optionterritoire} onChange={handleChangeSelectTerritoire}/>

                                                {errors && errors.territoire_id && (
                                                <span className="text-danger">{errors.territoire_id[0]}</span>
                                            )}
                                        </div>
                                    </div>
                           
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Ville</label>
                                            <input type="text"  class="form-control" name="ville" onChange={handleChange} value={itemData.ville}  />
                                            {errors && errors.ville && (
                                                <span className="text-danger">{errors.ville[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Adresse</label>
                                            <input type="text"  class="form-control" name="adresse" onChange={handleChange} value={itemData.adresse}  />
                                            {errors && errors.adresse && (
                                                <span className="text-danger">{errors.adresse[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Contacts</label>
                                            <input type="text"  class="form-control" name="tel" onChange={handleChange} value={itemData.tel}  />
                                            {errors && errors.tel && (
                                                <span className="text-danger">{errors.tel[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Latitude</label>
                                            <input type="text"  class="form-control" name="latitude" onChange={handleChange} value={itemData.latitude} placeholder="Ex: 57766927"/>
                                            {errors && errors.latitude && (
                                                <span className="text-danger">{errors.latitude[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Longitude</label>
                                            <input type="text"  class="form-control" name="longitude" onChange={handleChange} value={itemData.longitude}  placeholder="Ex: -50408474"/>
                                            {errors && errors.longitude && (
                                                <span className="text-danger">{errors.longitude[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                       
                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fermer</button>
                                
                                {!loadingf && <button type="submit" class="btn btn-primary btn-sm">Enregistrer</button>}
                                {loadingf && <button class="btn btn-primary btn-sm" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Chargement...
                                </button>}
                                
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            <div class="modal fade" id="exampleModalUpdate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modifier le depot</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitFormEdit}>
                            <div class="modal-body">
                            
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Nom du dépot</label>
                                    <input type="text"  class="form-control" name="name" onChange={handleChangeEdit} value={itemDataEdit.name} placeholder="Saisissez la raison social" />
                                    {errors && errors.name && (
                                        <span className="text-danger">{errors.name[0]}</span>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label" for="selectOne">Territoire <span
                                                class="text-secondary">(Obligatoire)</span></label>
                                                <Select 
                                                        options={optionterritoire} 
                                                        onChange={handleChangeSelectTerritoire}
                                                        value={optionterritoire.find(obj => obj.value == selectOptionterritoire)}
                                                        defaultValue={[{label: selectOptionterritoire == selectOptionterritoire ? optionterritoire.find(obj => obj.value === selectOptionterritoire) : ""}]}
                                                />

                                                {errors && errors.territoire_id && (
                                                <span className="text-danger">{errors.territoire_id[0]}</span>
                                            )}
                                        </div>
                                    </div>
                           
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Ville</label>
                                            <input type="text"  class="form-control" name="ville" onChange={handleChangeEdit} value={itemDataEdit.ville}  />
                                            {errors && errors.ville && (
                                                <span className="text-danger">{errors.ville[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Adresse</label>
                                            <input type="text"  class="form-control" name="adresse" onChange={handleChangeEdit} value={itemDataEdit.adresse}  />
                                            {errors && errors.adresse && (
                                                <span className="text-danger">{errors.adresse[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Contacts</label>
                                            <input type="text"  class="form-control" name="tel" onChange={handleChangeEdit} value={itemDataEdit.tel}  />
                                            {errors && errors.tel && (
                                                <span className="text-danger">{errors.tel[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Latitude</label>
                                            <input type="text" class="form-control" name="latitude" onChange={handleChangeEdit} value={itemDataEdit.latitude} placeholder="Ex: 57766927"/>
                                            {errors && errors.latitude && (
                                                <span className="text-danger">{errors.latitude[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Longitude</label>
                                            <input type="text"  class="form-control" name="longitude" onChange={handleChangeEdit} value={itemDataEdit.longitude}  placeholder="Ex: -50408474"/>
                                            {errors && errors.longitude && (
                                                <span className="text-danger">{errors.longitude[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                       
                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fermer</button>
                                
                                {!loadingf && <button type="submit" class="btn btn-primary btn-sm">Enregistrer</button>}
                                {loadingf && <button class="btn btn-primary btn-sm" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Chargement...
                                </button>}
                                
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            
            <div class="modal fade" id="exampleModal-3" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Ajouter un gestionnaire depot</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitFormGestionnaire}>
                            <div class="modal-body">
                            
                                <div class="mb-3">
                                    <h4 class="form-label fw-bold" for="textInput">Gestionnaire actuel : {item?.users?.length > 0 ? <b className="text-success">{`${item?.users[0]?.gestionnaire?.use_nom} ${item?.users[0]?.gestionnaire?.use_prenom}`}</b> : <b className="text-danger">Aucun gestionnaire</b>}</h4>
                                 
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                            <div class="mb-3">
                                                <label class="form-label" for="selectOne">Selectionnez un utilisateur <span
                                                class="text-secondary">(Obligatoire)</span></label>
                                                <Select options={optionusers} onChange={handleChangeUsers}/>

                                                {errors && errors.user_id && (
                                                <span className="text-danger">{errors.user_id[0]}</span>
                                            )}
                                        </div>
                                    </div>
                           
                                </div>



                       
                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fermer</button>
                                
                                {!loading && <button type="submit" class="btn btn-primary btn-sm">Enregistrer</button>}
                                {loading && <button class="btn btn-primary btn-sm" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Chargement...
                                </button>}
                                
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            </ContentSection>
        </>
    )
}

export default EntrepotPage;