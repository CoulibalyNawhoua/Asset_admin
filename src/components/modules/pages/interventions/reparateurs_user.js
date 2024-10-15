import { useContext, useEffect, useState } from "react";
import ContentSection from "../../Content";
import axios from "axios";
import CustomerStyle from "../../../utils/customerStyle";
import BaseUrl from "../../../utils/BaseUrl";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customStyles = CustomerStyle();
function ReparateurUserList()
{
    const [loading,setLoading] = useState(false);
    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);

    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const columns = [
        {
            name: 'CODE',
            selector: row => `${row.code}`,
            sortable: true,
        },
        {
            name: 'NOM DU REPARATEUR',
            selector: row => `${row.name}`,
            sortable: true,
        },
        {
          name: 'TELEPHONE',
          selector: row => row.phone,
          sortable: true,
        },

        {
            name: 'MANAGER',
            selector: row => row.manager,
            sortable: true,
        },
        {
            name: 'EMAIL',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'CANAL',
            selector: row => row.canal?.libelle,
            sortable: true,
        },
        {
            name: 'TERRITOIRE',
            selector: row => row.territoire?.libelle,
            sortable: true,
        },
        {
            name: "STATUT",
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
                    {can(permissions,'add-update-reparateur') &&
                        <Link className="btn btn-primary btn-sm mx-1" to={`/update-reparateur-info/${row.uuid}`}><i class="fa-solid fa-pen"></i></Link>
                    }
                    <Link className="btn btn-success btn-sm" to={`/view-reparateur-info/${row.uuid}`}><i class="fa-solid fa-eye"></i></Link>
                </>
            )
          },

    ];

        useEffect(()=>{
    if(!can(permissions,'reparateur-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        fetchUserList();
    },[]);

    const fetchUserList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/raparateurs-list',{
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
        const datas = itemsListFilter.filter(row => row.name.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    return (
        <>
        <ContentSection ulShownav={"interventions"} navactive={"reparateur_list"}>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-12">
                        
                        <div class="mb-5">
                            <h3 class="mb-0 ">Gestion des Reparateurs
                                {can(permissions,'add-update-reparateur') &&
                                        <Link  class="btn btn-primary me-2 float-end btn-sm" to='/create-reparateurs'>Ajouter</Link>
                                }
                                
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

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ContentSection>
        </>
    )
}

export default ReparateurUserList;