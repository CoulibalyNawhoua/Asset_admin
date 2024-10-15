import { Link, useNavigate } from "react-router-dom";
import ContentSection from "../../../Content";
import moment from "moment";
import BaseUrl from "../../../../utils/BaseUrl";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CustomerStyle from "../../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import { UserContext } from "../../../../utils/User_check";
import can from "../../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function ListTourneeDeploiementPage()
{
    const [loading,setLoading] = useState(false);
    const [tranfertList,setTransfertList] = useState([]);

    const [itemsListFilter,setItemsListFilter] = useState([]);
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();
    
    const columns = [
        {
            name: 'CODE',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'DATE PREVUE',
            selector: row => moment(row.date).format('Do MMMM yy'),
            sortable: true,
        },
        {
            name: 'LIVREUR',
            selector: row => `${row.livreur.use_nom} ${row.livreur.use_prenom}`,
            sortable: true,
        },
        {
          name: 'VEHICULE',
          selector: row => row.vehicule.libelle,
          sortable: true,
        },
        // {
        //     name: 'DATE CLOTURE',
        //     selector: row => row?.date_cloture !==null ? moment(row?.date_cloture).format('Do MMMM yy HH:mm'):"",
        //     sortable: true,
        // },

    
        {
          name: "Statut",
          selector : row => (
            <>
                {row.status == 1 && <span class="badge bg-success">Terminé</span>}
                {row.status == 2 && <span class="badge bg-danger">Annulé</span>}
                {row.status == 0 && <span class="badge bg-warning">En cours</span>}
            
            </>
          )
        },
        {
            name: "ACTION",
            selector : row => (
                <>
                {can(permissions,'detail-tournee') && <Link className="btn btn-success btn-sm mx-1" to={`/tournee-deploiements-views/${row.uuid}`}><i class="fa-solid fa-eye"></i>Deploiement</Link>} 
                {row.status == 0 &&
                    <>
                {can(permissions,'add-update-tournee') &&  
                    <>
                        {                    
                            !moment(row.date).isBefore(moment()) && <Link className="btn btn-primary btn-sm mx-1" to={`/tournee-deploiements-update/${row.uuid}`}><i class="fa-solid fa-pencil"></i>Modifier</Link> 
                        }
                    </>
 
                }

                    </>
                   
                }
                    {/* <Link className="btn btn-danger btn-sm " to={`/update-materiel/${row.uuid}`}> <i className="fa fa-trash"></i> </Link> */}
                </>
            )
          },

    ];
            useEffect(()=>{
    if(!can(permissions,'tournee-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);
    useEffect(()=>{
        fetchTransfertList();
    },[]);

    const fetchTransfertList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/tournee-deploiements-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                setTransfertList(resp.data.data);
                setItemsListFilter(resp.data.data); 
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.code.toLowerCase().includes(event.target.value.toLowerCase()));
        setTransfertList(datas);
    }
    return (
        <ContentSection ulShownav={"tournees"} navactive={"tournee_list"}>
                       <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des tournées
                                {can(permissions,'add-update-tournee') &&
                                    <Link  class="btn btn-primary me-2 float-end btn-sm" to='/tournee-deploiements-create'><i className="fa fa-plus"></i>Nouvelle tournée</Link>
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
                                                <input type="search" class="form-control " placeholder="Code tournée..." onChange={handleFilter}/>

                                            </div>
                                            <div class="col-lg-4 col-md-6 d-flex align-items-center mt-3 mt-md-0">
                                            
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
                                    data={tranfertList}
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
        </ContentSection>
    )
}

export default ListTourneeDeploiementPage;