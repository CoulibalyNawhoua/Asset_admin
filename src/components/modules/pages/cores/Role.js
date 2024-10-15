import { useContext, useEffect, useState } from "react";
import BaseUrl from "../../../utils/BaseUrl";
import ContentSection from "../../Content";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import { Link, useNavigate } from "react-router-dom";
import can from "../../../utils/Can";
import { UserContext } from "../../../utils/User_check";


const url = BaseUrl();
const customStyles = CustomerStyle();

function RolePage(){
    const [errors,setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [roleData,setRoleData] = useState({
        'name':''
    });
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
                    <Link className="btn btn-primary btn-sm mx-1" to={`/edit-role-page/${row.id}`}><i class="fa-solid fa-pen"></i></Link>
                    {/* <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button> */}
                </>
            )
          },

    ];

    useEffect(()=>{
    if(!can(permissions,'roles-page')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        fetchRoleList();
    },[]);

    const fetchRoleList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/role-list',{
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
        setRoleData({
            ...roleData,
            [e.target.name]:e.target.value
        });
    }
    const submitForm= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('rol_libelle',roleData.rol_libelle);

        setLoading(true);
        try {
            axios.post(url.base+'/cores/role-store',_formData,
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
                      setRoleData({
                        'rol_libelle':''
                      });
                      fetchRoleList();
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
                setLoading(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoading(false);

        }
    }


    const deleteItem = async (roleID) => {
     
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
                    axios.get(url.base+'/cores/role-delete/?role_id='+roleID,
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
                        fetchRoleList();
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
    return (
        <>
            <ContentSection ulShownav={"cores"} navactive={"roles"}>

                <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-12">

                    <div class="mb-5">
                        <h3 class="mb-0">
                            Liste des rôles
                            <Link to="/create-role-page" class="btn btn-primary float-end" >+ Ajouter</Link>
                        </h3>
                       

                    </div>
                    </div>
                </div>
                <div>

                    <div class="row">
                    <div class="col-12">
                        <div class="card">
                        <div class="card-header d-md-flex border-bottom-0">
                        <div class=" col-lg-3 col-md-6">
                            <input type="search" class="form-control " placeholder="Libelle" onChange={handleFilter}/>
                        </div>
                        <div class="col-lg-4 col-md-6 d-flex align-items-center mt-3 mt-md-0"></div>
                            <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">
                                <a href="#!" class="btn btn-outline-white ms-2">Import</a>
                                <a href="#!" class="btn btn-outline-white ms-2">Export</a>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive table-card">
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
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                <div class="modal fade" id="exampleModal-2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Ajouter un rôle</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                    {/* <span aria-hidden="true">&times;</span> */}
                                </button>
                            </div>
                            <form onSubmit={submitForm}>
                                <div class="modal-body">
                                
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Libelle du rôle</label>
                                    <input type="text" id="textInput" class="form-control" name="rol_libelle" onChange={handleChange} value={roleData.rol_libelle} placeholder="Saisissez le libelle " />
                                    {errors && errors.rol_libelle && (
                                        <span className="text-danger">{errors.rol_libelle[0]}</span>
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
            </ContentSection>
        </>
    )
}

export default RolePage;