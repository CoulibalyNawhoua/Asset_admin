import { useContext, useEffect, useState } from "react";
import CustomerStyle from "../../../../utils/customerStyle";
import BaseUrl from "../../../../utils/BaseUrl";
import axios from "axios";
import Swal from "sweetalert2";
import ContentSection from "../../../Content";
import DataTable from "react-data-table-component";
import moment from "moment";
import { UserContext } from "../../../../utils/User_check";
import { useNavigate } from "react-router-dom";
import can from "../../../../utils/Can";


const url = BaseUrl();
const customerStyle = CustomerStyle();
function ListVehiculeTransportPage()
{
    const [errors,setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingf, setLoadingf] = useState(false);
    const [itemData,setItemData] = useState({
        "libelle":"",
        "matricule":"",
        "date_acquisition":"",
        "type_vehicule":"",
        "image":""

    });

    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);

        const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const columns = [
        {
            name: 'MATRICULE',
            selector: row => row.matricule,
            sortable: true,
        },
        {
          name: 'LIBELLE',
          selector: row => row.libelle,
          sortable: true,
        },
        {
            name: 'CATEGORIE OU TYPE',
            selector: row => row.type_vehicule,
            sortable: true,
        },

        {
            name: 'DATE ACQUISITION',
            selector: row => moment(row.date_acquisition).format("Do MMMM YYYY H:m"),
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
        // {
        //     name: "Action",
        //     selector : row => (
        //         <>
        //             <button className="btn btn-primary btn-sm mx-1"><i class="fa-solid fa-pen"></i></button>
        //             <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button>
        //         </>
        //     )
        //   },

    ];

        useEffect(()=>{
    if(!can(permissions,'vehicule-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        fetchItemsList();
    },[]);


    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/vehicule-available',{
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
        _formData.append('matricule',itemData.matricule);
        _formData.append('date_acquisition',itemData.date_acquisition);
        _formData.append('type_vehicule',itemData.type_vehicule);


        setLoadingf(true);
        try {
            axios.post(url.base+'/vehicule-store',_formData,
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
                        "libelle":"",
                        "matricule":"",
                        "date_acquisition":"",
                        "type_vehicule":"",
                        "image":""
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
          })
        //   .then((result) => {
        //     if (result.isConfirmed) {
        //         try {
        //             axios.get(url.base+'/setting/entrepot-delete/?depot_id='+id,
        //                 {
        //                     headers:{
        //                         'Content-Type':'application/json',
        //                         "Authorization": `Bearer ${localStorage.getItem('_token_')}`                                
        //                     },
        //                 }
        //             ).then((resp)=>{
        //                 // console.log(resp.data);
        //                 if(resp.status == 200)
        //                 {
        //                     if(resp.data.status == 600)
        //                     {
        //                         Swal.fire(
        //                             'Attention',
        //                             resp.data.message,
        //                             'error'
        //                           )
        //                     }else{
        //                         Swal.fire(
        //                             'Supprimé',
        //                             resp.data.message,
        //                             'success'
        //                           )
        //                     }
                           
        //                 }
        //                 fetchItemsList();
        //             })
        //         } catch (error) {
        //             console.log(error);
        //         }

            
        //     }
        //   }); 
    }

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.matricule.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }
    return (
        <>
        <ContentSection ulShownav={"tournees"} navactive={"vehicule_list"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des Véhicules</h3>

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
                                        </div>




                                    <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">

                                        <button a href="#!" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal-2">Ajouter</button>
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
                            <h5 class="modal-title" id="exampleModalLabel">Ajouter un vehicule</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div class="modal-body">
                            
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Nom du vehicule</label>
                                    <input type="text"  class="form-control" name="libelle" onChange={handleChange} value={itemData.libelle} placeholder="Saisissez le nom du vehicule" />
                                    {errors && errors.libelle && (
                                        <span className="text-danger">{errors.libelle[0]}</span>
                                    )}
                                </div>


                                <div className="row">
                                    <div className="col-md-12">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Matricule</label>
                                            <input type="text"  class="form-control" name="matricule" onChange={handleChange} value={itemData.matricule}  />
                                            {errors && errors.matricule && (
                                                <span className="text-danger">{errors.matricule[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Type de vehicule</label>
                                            <input type="text"  class="form-control" name="type_vehicule" onChange={handleChange} value={itemData.type_vehicule} />
                                            {errors && errors.type_vehicule && (
                                                <span className="text-danger">{errors.type_vehicule[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="textInput">Date d'acquisition</label>
                                            <input type="date"  class="form-control" name="date_acquisition" onChange={handleChange} value={itemData.date_acquisition} />
                                            {errors && errors.date_acquisition && (
                                                <span className="text-danger">{errors.date_acquisition[0]}</span>
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
            </ContentSection>
        </>
    )
}

export default ListVehiculeTransportPage;