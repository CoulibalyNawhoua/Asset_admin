import { Link, useNavigate } from "react-router-dom";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import BaseUrl from "../../../utils/BaseUrl";
import axios from "axios";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import can from "../../../utils/Can";
import { UserContext } from "../../../utils/User_check";

const url = BaseUrl();
const customStyles = CustomerStyle();
function ComptePage(){
    const [loading,setLoading] = useState(false);
    const [userList,setUserList] = useState([]);
     const [itemsListFilter,setItemsListFilter] = useState([]);

     const {user,permissions} = useContext(UserContext);
     const navigate = useNavigate();

    const columns = [
        {
            name: 'LOGO',
            selector: row => <img className="rounded-circle" src={`${url.public}logo/${row.logo}`} width={40} height={40}/>,
            sortable: true,
        },
        {
          name: 'SOCIETE',
          selector: row => row.name,
          sortable: true,
        },

        {
            name: 'REPRESENTANT',
            selector: row => row.lead_fullName,
            sortable: true,
          },
          {
            name: 'ADRESSE EMAIL',
            selector: row => row.email,
            sortable: true,
          },
          {
            name: 'TEL',
            selector: row => row.tel,
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
                   <Link className="btn btn-primary btn-sm mx-1" to={`/socite-view/${row.uuid}`}><i class="fa-solid fa-eye"></i>Voir</Link>
                    
                </>
            )
          },

    ];

    useEffect(()=>{
        if(!can(permissions,'societe-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);


    useEffect(()=>{
        fetchUserList();
    },[]);

    const fetchUserList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/list-societes',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setUserList(resp.data.data);
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
        setUserList(datas);
    }

    return (
        <>
            <ContentSection ulShownav={"cores"} navactive={"comptes"}>
            <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-12">
                    
                    <div class="mb-5">
                        <h3 class="mb-0 ">Gestion des Societes
                        <Link  class="btn btn-primary me-2 float-end btn-sm" to='/create-societes'>Ajouter</Link>
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
                                    data={userList} 
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

export default ComptePage;