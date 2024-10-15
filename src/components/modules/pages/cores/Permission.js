import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../../utils/BaseUrl";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import SwalTopEnd from "../../../utils/swal_top_end";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";
import { useNavigate } from "react-router-dom";

const url = BaseUrl();
const customStyles = CustomerStyle();
function PermissionPage(){
    const [errors,setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [permission,setPermission]  = useState([])
    const [permissionData,setPermissionData] = useState({
        'name':''
    });
    const [name,setName] = useState('');
    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const columns = [
        {
            name: 'ID',
            selector: (row,index) => index+1,
            sortable: true,
        },
        {
          name: 'LIBELLE',
          selector: row => row.name,
          sortable: true,
        },
    
        {
            name: "Action",
            selector : row => (
                <>
                    <button className="btn btn-primary btn-sm mx-1" onClick={()=>update_modal(row)}><i class="fa-solid fa-pen"></i></button>
                    {/* <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button> */}
                </>
            )
          },

    ];

    useEffect(()=>{
    if(!can(permissions,'permissions-page')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);
    
    useEffect(()=>{
        fetchPermissionList();
    },[]);

    const fetchPermissionList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/permission-list',{
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
        setPermissionData({
            ...permissionData,
            [e.target.name]:e.target.value
        });
    }

    const submitForm= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('name',permissionData.name);

        setLoading(true);
        try {
            axios.post(url.base+'/permission-store',_formData,
            {
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
                // credentials:'include'
            }
            ).then((resp)=>{
                setLoading(false);
                if(resp.status == 200){
                    // console.log(resp.data);
                    setErrors({});

                    SwalTopEnd({icon:'success',title:"Enregistrement effectué avec succès!"})
                    //   window.$("#exampleModal-2").modal('hide');
                      setPermissionData({
                        'name':''
                      });
                      fetchPermissionList();
                }else{
                    SwalTopEnd({icon:'error',title:"Désolé un problème est subvenu."})
                }
            }).catch((error)=>{                
                setLoading(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const submitFormUpdate= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('name',name);

        setLoading(true);
        try {
            axios.post(url.base+'/permission-update/'+permission.id,_formData,
            {
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
                // credentials:'include'
            }
            ).then((resp)=>{
                setLoading(false);
                if(resp.status == 200){
                    // console.log(resp.data);
                    setErrors({});

                    SwalTopEnd({icon:'success',title:"Modification effectué avec succès!"})
                    //   window.$("#exampleModalUpdate-2").modal('hide');
                      setPermissionData({
                        'name':''
                      });
                      fetchPermissionList();
                }else{
                    SwalTopEnd({icon:'error',title:"Désolé un problème est subvenu."})
                }
            }).catch((error)=>{                
                setLoading(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoading(false);
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
                    axios.get(url.base+'/cores/permission-delete/?permission_id='+id,
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
                        fetchPermissionList();
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
        setPermission(item);
        setName(item.name)
        window.$("#exampleModalUpdate-2").modal("show")
    }

    return (
        <>
            <ContentSection ulShownav={"cores"} navactive={"permissions"}>
                <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-12">
                        
                        <div class="mb-5">
                            <h3 class="mb-0 ">Liste des permissions</h3>

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
                                        <div class="col-lg-4 col-md-6 d-flex align-items-center mt-3 mt-md-0"></div>

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
                                    customStyles={customStyles}
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
                                <h5 class="modal-title" id="exampleModalLabel">Ajouter une permission</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                    {/* <span aria-hidden="true">&times;</span> */}
                                </button>
                            </div>
                            <form onSubmit={submitForm}>
                                <div class="modal-body">
                                
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Libelle de la permission</label>
                                    <input type="text" id="textInput" class="form-control" name="name" onChange={handleChange} value={permissionData.name} placeholder="Saisissez le libelle " />
                                    {errors && errors.per_libelle && (
                                        <span className="text-danger">{errors.name[0]}</span>
                                    )}
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

            <div class="modal fade" id="exampleModalUpdate-2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Modfier permission</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                    {/* <span aria-hidden="true">&times;</span> */}
                                </button>
                            </div>
                            <form onSubmit={submitFormUpdate}>
                                <div class="modal-body">
                                
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Libelle de la permission</label>
                                    <input type="text" class="form-control" onChange={(e)=>setName(e.target.value)} value={name} placeholder="Saisissez le libelle " />
                                    {errors && errors.per_libelle && (
                                        <span className="text-danger">{errors.name[0]}</span>
                                    )}
                                </div>
                                
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fermer</button>
                                    
                                    {!loading && <button type="submit" class="btn btn-primary btn-sm">Modifier</button>}
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

export default PermissionPage;