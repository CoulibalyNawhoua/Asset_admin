import BaseUrl from "../../../utils/BaseUrl";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ContentSection from "../../Content";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import SwalTopEnd from "../../../utils/swal_top_end";
import { UserContext } from "../../../utils/User_check";
import { useNavigate } from "react-router-dom";
import can from "../../../utils/Can";


const url = BaseUrl();
const customerStyle = CustomerStyle();
function TerritoirePage() {

    const [errors,setErrors] = useState({});
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loadingf, setLoadingf] = useState(false);
    const [itemData,setItemData] = useState({
        'libelle':'',
        'zone_id':''
    });
    const [itemsList,setItemsList] = useState([]);
    const [zoneData,setZoneData] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [item,setItem] = useState([]);
    const [libelle,setLibelle] = useState('');
    const [ZoneId,setZoneId] = useState('');

    const columns = [
        {
            name: 'ID',
            selector: (row,index) => index+1,
            sortable: true,
        },
        {
            name: 'CANAL',
            selector: row => row.zone.libelle,
            sortable: true,
          },

          {
            name: 'ZONE',
            selector: row => row.zone.canal.libelle,
            sortable: true,
          },
      
        {
          name: 'LIBELLE',
          selector: row => row.libelle,
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
                {can(permissions,"add-update-territoire") &&
                    <button className="btn btn-primary btn-sm mx-1" onClick={()=>update_modal(row)}><i class="fa-solid fa-pen"></i></button>
                }
                {can(permissions,"supprimer-territoire") &&
                    <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button>
                }
                    
                </>
            )
          },

    ];

    useEffect(()=>{
        if(!can(permissions,'territoire-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions])


    useEffect(()=>{
        fetchItemsList();
    },[]);

    useEffect(()=>{
        try {
            axios.get(url.base+'/setting/zone-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setZoneData(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    },[]);

    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/setting/territoire-list',{
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

    const handleChange=(e)=>{
        setItemData({
            ...itemData,
            [e.target.name]:e.target.value
        });
    }

    const submitForm= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('libelle',itemData.libelle);
        _formData.append('zone_id',itemData.zone_id);

        setLoadingf(true);
        try {
            axios.post(url.base+'/setting/territoire-store',_formData,
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
                        'libelle':'',
                        'zone_id':''
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
                    axios.get(url.base+'/setting/territoire-delete/?ter_id='+id,
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
        const datas = itemsListFilter.filter(row => row.libelle.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    const update_modal=(item)=>{
        setItem(item);
        setLibelle(item.libelle)
        setZoneId(item.zone_id)
        window.$("#exampleModalUpdate").modal("show")
    }

    const submitFormEdit= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('libelle',libelle);
        _formData.append('zone_id',ZoneId);

        setLoadingf(true);
        try {
            axios.post(url.base+'/territoire-update/'+item.id,_formData,
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
                    SwalTopEnd({icon:"success",title:"Modification effectué avec succès."});
                      setLibelle('');
                      setZoneId('');
                      fetchItemsList();
                      window.$("#exampleModalUpdate").modal("hide")
                }
            }).catch((error)=>{                
                setLoadingf(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoadingf(false);

        }
    }

 return(
    <>
        <ContentSection ulShownav={"parametres"} navactive={"territoire"}>
        <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des térritoires</h3>

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
                                            <input type="search" class="form-control " placeholder="Recherche..." onChange={handleFilter}/>

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
                                        {can(permissions,"add-update-territoire") &&
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
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Ajouter un territoire</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Libelle</label>
                                <input type="text" id="textInput" class="form-control" name="libelle" onChange={handleChange} value={itemData.libelle} placeholder="Saisissez le libelle " />
                                {errors && errors.libelle && (
                                    <span className="text-danger">{errors.libelle[0]}</span>
                                )}
                            </div>

                            <div class="mb-3">
                                    <label class="form-label" for="selectOne">Selectionnez une zone <span
                                    class="text-secondary">(Obligatoire)</span></label>
                                    <select class="form-select" aria-label="Default select example" name="zone_id" onChange={handleChange} value={itemData.zone_id}>
                                        <option value="" selected>----</option>
                                        {zoneData?.map((zone,index)=>
                                            <option value={zone.id} >{zone.libelle}</option>
                                        )}
                                    </select>

                                    {errors && errors.zone_id && (
                                    <span className="text-danger">{errors.zone_id[0]}</span>
                                )}
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
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modifier le territoire</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitFormEdit}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Libelle</label>
                                <input type="text" id="textInput" class="form-control" name="libelle" onChange={(e)=>setLibelle(e.target.value)} value={libelle} placeholder="Saisissez le libelle " />
                                {errors && errors.libelle && (
                                    <span className="text-danger">{errors.libelle[0]}</span>
                                )}
                            </div>

                            <div class="mb-3">
                                    <label class="form-label" for="selectOne">Selectionnez une zone <span
                                    class="text-secondary">(Obligatoire)</span></label>
                                    <select class="form-select" aria-label="Default select example" name="zone_id" onChange={(e)=>setZoneId(e.target.value)} value={ZoneId}>
                                        <option value="" selected>----</option>
                                        {zoneData?.map((zone,index)=>
                                            <option value={zone.id} >{zone.libelle}</option>
                                        )}
                                    </select>

                                    {errors && errors.zone_id && (
                                    <span className="text-danger">{errors.zone_id[0]}</span>
                                )}
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
        </ContentSection>
    </>
 )   
}

export default TerritoirePage;