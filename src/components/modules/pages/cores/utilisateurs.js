import { Link, useNavigate } from "react-router-dom";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import BaseUrl from "../../../utils/BaseUrl";
import axios from "axios";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customStyles = CustomerStyle();
function UsersPage(){
    const [loading,setLoading] = useState(false);
    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
     const {user,permissions} = useContext(UserContext);
     const navigate = useNavigate();


    const columns = [
        {
            name: 'NOM ET PRENOMS',
            selector: row => `${row.use_nom} ${row.use_prenom !== null ? row.use_prenom : ""}`,
            sortable: true,
        },
        {
            name: 'ROLE',
            selector: row => row?.roles[0].name,
            sortable: true,
          },
        {
          name: 'TELEPHONE',
          selector: row => row.phone,
          sortable: true,
        },

        {
            name: 'SOCIETE',
            selector: row => row.societe?.name,
            sortable: true,
          },
          {
            name: 'ADRESSE EMAIL',
            selector: row => row.email,
            sortable: true,
          },
          {
            name: "STATUT",
            selector : row => (
              <>
               {row.is_active == 1 && (
              <span className="badge bg-success">Actif</span>
              )}
              {row.is_active == 0 && (
                  <span className="badge bg-danger">Inactif</span>
              )}
              </>
            )
          },
    
        {
            name: "Action",
            selector : row => (
                <>
                    <Link className="btn btn-primary btn-sm mx-1" to={`/edit-users-info/${row.uuid}`}><i class="fa-solid fa-pen"></i></Link>
                    {row.is_active == 1 && <button className="btn btn-success btn-sm pb-0 mb-1" to="#" onClick={()=>DesactiveFunctionUser(row.id)}><i className="fa fa-unlock"></i></button>}
                    {row.is_active == 0 &&  <button className="btn btn-danger btn-sm pb-0 mb-1" to="#" onClick={()=>activeFunctionUser(row.id)}><i className="fa fa-lock"></i></button>}
                </>
            )
          },

    ];


    useEffect(()=>{
        if(!can(permissions,'utilisateurs-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);


    useEffect(()=>{
        fetchUserList();
    },[]);

    const fetchUserList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/users-listes',{
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

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.use_nom.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    const activeFunctionUser=(id)=>{
        Swal.fire({
          title: 'INFO !',
          text: 'Cette action va activer cet utilisateur.',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonText:"NON",
          confirmButtonText: 'OUI',
          cancelButtonColor:"red"
        }).then((result) => {
          if (result.isConfirmed) {
              try {
                  axios.get(url.base+'/activate-or-desactivate-users/'+id,
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
                 
                        Swal.fire({
                            icon: 'success',
                            title:  `Le compte a été activé avec success`,
                          });
                         
                      }
                      fetchUserList();
                  })
              } catch (error) {
                  console.log(error);
              }
    
          
          }
        }); 
    }

    const DesactiveFunctionUser=(id)=>{
    Swal.fire({
        title: 'INFO !',
        text: "Cette action va désactiver cet utilisateur.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText:"NON",
        confirmButtonText: 'OUI',
        cancelButtonColor:"red"
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                axios.get(url.base+'/activate-or-desactivate-users/'+id,
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
                
                    Swal.fire({
                        icon: 'success',
                        title:  `Le compte a été désactivé avec success`,
                        });
                        
                    }
                    fetchUserList();
                })
            } catch (error) {
                console.log(error);
            }

        
        }
    }); 
    }
    return (
        <>
            <ContentSection ulShownav={"cores"} navactive={"users"}>
            <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-12">
                    
                    <div class="mb-5">
                        <h3 class="mb-0 ">Gestion des Utilisateurs
                        <Link  class="btn btn-primary me-2 float-end btn-sm" to='/create-users'>Ajouter</Link>
                        </h3>

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
                                    {/* <label class="form-label me-2 mb-0">Société: </label>
                                    <select class="form-select" aria-label="Default select example">
                                        <option selected>Shipped</option>
                                        <option value="1">In Progress</option>
                                        <option value="2">Delivered</option>
                                      </select> */}
                                    </div>




                                <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">

                                    {/* <a href="#!" class="btn btn-primary me-2">+ Add New Order</a> */}
                                    <a href="#!" class="btn btn-light " >Export</a>
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
            </ContentSection>
        </>
    )
}

export default UsersPage;