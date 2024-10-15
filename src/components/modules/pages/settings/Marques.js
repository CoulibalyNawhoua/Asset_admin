import ContentSection from "../../Content";
import BaseUrl from "../../../utils/BaseUrl";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import SwalTopEnd from "../../../utils/swal_top_end";
import { UserContext } from "../../../utils/User_check";
import { useNavigate } from "react-router-dom";
import can from "../../../utils/Can";


const url = BaseUrl();
const customerStyle = CustomerStyle();
function MarquesPage(){

    const [errors,setErrors] = useState({});
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);
    const [loadingf, setLoadingf] = useState(false);
    const [itemData,setItemData] = useState({
        'libelle':''
    });
    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [item,setItem] = useState([]);
    const [libelle,setLibelle] = useState('');

    const columns = [
        {
            name: '',
            selector: (row,index) => index+1,
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
                {can(permissions,"add-update-modele") && 
                    <button className="btn btn-primary btn-sm mx-1" onClick={()=>update_modal(row)}><i class="fa-solid fa-pen"></i></button>
                }
                {can(permissions,"supprimer-marque") && 
                    <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button>
                }
                </>
            )
          },

    ];


    useEffect(()=>{
        if(!can(permissions,'marque-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);


    useEffect(()=>{
        fetchItemsList();
    },[]);

    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/setting/marque-list',{
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

        setLoadingf(true);
        try {
            axios.post(url.base+'/setting/marque-store',_formData,
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
                    SwalTopEnd({icon:"success",title:resp.data.message})
                      setItemData({
                        'libelle':''
                      });
                      fetchItemsList();
                }else{
                    SwalTopEnd({icon:"error",title:resp.data.message})
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
                    axios.get(url.base+'/setting/marque-delete/?marque_id='+id,
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
        window.$("#exampleModalUpdate").modal("show")
    }
    const submitFormEdit= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('libelle',libelle);

        setLoadingf(true);
        try {
            axios.post(url.base+'/marque-update/'+item.id,_formData,
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
                        window.$("#exampleModalUpdate").modal("hide")
                        SwalTopEnd({icon:"success",title:"Modification effectué avec succès."})
                      setItem('');
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
    return (
        <>
            <ContentSection ulShownav={"parametres"} navactive={"marques"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des marques</h3>

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
                                            <input type="search" class="form-control " placeholder="Libelle" onChange={handleFilter}/>

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
                                {can(permissions,"add-update-modele") && 
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
                            {/* <table id="example" class="table text-nowrap table-centered mt-0" style={{"width": "100%"}}>
                                <thead class="table-light">
                                    <tr>

                                        <th className="text-center">LIBELLE</th>
                                        <th className="text-center">STATUT</th>
                                        <th className="text-center">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {loading &&                                 
                                          
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                      
                                     
                                    } 
                                    {!loading &&
                                       
                                       itemsList?.map((item,index)=>
                                            <tr>


                                                <td className="text-center">{item.libelle} </td>
                                                <td className="text-center">
                                                    {item.status && <span className="badge bg-success">actif</span>}
                                                    {!item.status && <span className="badge bg-danger">supprimé</span>}
                                                </td>

                                                <td className="text-center">                                           
                                                    <button className="btn btn-primary btn-sm mx-1"><i class="fa-solid fa-pen"></i></button>
                                                    <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(item.id)}><i class="fa-solid fa-trash"></i></button>
                                                </td>
                                            </tr>
                               
                                       )
                                        
                                    
                                    }
                                   
                            





                                </tbody>
                            </table> */}
                        </div>
                    </div>
                        {/* <div
                            class="card-footer d-md-flex justify-content-between align-items-center">
                            <span>Showing 1 to 8 of 12 entries</span>
                            <nav class="mt-2 mt-md-0">
                                <ul class="pagination mb-0">
                                    <li class="page-item"><a class="page-link" href="#!">Previous</a></li>
                                    <li class="page-item"><a class="page-link active" href="#!">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">3</a></li>
                                    <li class="page-item"><a class="page-link" href="#!">Next</a></li>
                                </ul>
                            </nav>
                        </div> */}

                            </div>
                        </div>

                    </div>
                </div>
                </div>

            <div class="modal fade" id="exampleModal-2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Ajouter une marque</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Libelle de la marque</label>
                                <input type="text" id="textInput" class="form-control" name="libelle" onChange={handleChange} value={itemData.libelle} placeholder="Saisissez le libelle " />
                                {errors && errors.libelle && (
                                    <span className="text-danger">{errors.libelle[0]}</span>
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
                            <h5 class="modal-title" id="exampleModalLabel">Modifier la marque</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitFormEdit}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Libelle de la marque</label>
                                <input type="text" id="textInput" class="form-control" name="libelle" onChange={(e)=>setLibelle(e.target.value)} value={libelle} placeholder="Saisissez le libelle " />
                                {errors && errors.libelle && (
                                    <span className="text-danger">{errors.libelle[0]}</span>
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

export default MarquesPage;