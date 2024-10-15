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
function InterventionPageList()
{
    const [loading,setLoading] = useState(false);
    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);

    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const columns = [
        {
            name: 'CODE DU TICKET',
            selector: row => `${row.code}`,
            sortable: true,
        },
        {
            name: 'REPARATEUR AFFECTE',
            selector: row => row.reparateur_first.length > 0 ? row.reparateur_first[0].reparateur?.name : "",
            sortable: true,
        },
        // {
        //   name: 'MATERIEL',
        //   selector: row => row.materiel ? `${row.materiel?.categorie?.libelle} ${row.materiel?.marque?.libelle}` : "",
        //   sortable: true,
        // },

        // {
        //     name: 'CANAL',
        //     selector: row => row.d_canal,
        //     sortable: true,
        // },
        {
            name: 'TERRITOIRE',
            selector: row => row.d_territoire,
            sortable: true,
        },
        {
            name: 'CATEGORIE',
            selector: row => row.d_pdv_categorie,
            sortable: true,
        },
        {
            name: 'PDV',
            selector: row => row.d_pdv,
            sortable: true,
        },
      
        {
            name: "STATUT",
            selector : row => (
              <>
                {row.status == 1 && (
                    <span className="badge bg-warning">En attente de devis</span>
                )}
                {row.status == 0 && (
                  <span className="badge bg-danger">Inactif</span>
                )}
                {row.status == 2 && (
                  <span className="badge bg-warning">En attente de facture</span>
                )}
                {row.status == 3 && (
                  <span className="badge bg-danger">Echec du traitement</span>
                )}

                {row.status == 4 && (
                  <span className="badge bg-success">Terminé</span>
                )}
              </>
            )
        },
    
        {
            name: "Action",
            selector : row => (
                <>
                    {/* <Link className="btn btn-primary btn-sm mx-1" to={`/update-reparateur-info/${row.uuid}`}><i class="fa-solid fa-pen"></i></Link> */}
                    {can(permissions,'intervention-detail') &&
                            <Link className="btn btn-success btn-sm" to={`/views-intervention/${row.uuid}`}><i class="fa-solid fa-eye"></i>Detail</Link>
                    }
                </>
            )
          },

    ];

    useEffect(()=>{
    if(!can(permissions,'intervention-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        fetchList();
    },[]);

    const fetchList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/intervention-list',{
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
        const datas = itemsListFilter.filter(row => row.code.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    return (
        <>
        <ContentSection ulShownav={"interventions"} navactive={"intervention_list"}>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-12">
                        
                        <div class="mb-5">
                            <h3 class="mb-0 ">Gestion des interventions
                            {can(permissions,'add-intervention') &&
                                <Link  class="btn btn-primary me-2 float-end btn-sm" to='/create-interventions'>Ajouter une intervention</Link>
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

export default InterventionPageList;