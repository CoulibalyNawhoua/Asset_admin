import axios from "axios";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import can from "../../../utils/Can";
import { UserContext } from "../../../utils/User_check";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function TransfertDepotPage(){
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
          name: 'QUANTITE',
          selector: row => <b className="text-danger">{row.detail_transferts_count}</b>,
          sortable: true,
        },
        {
            name: 'DESTINATION',
            selector: row => row.depot?.name,
            sortable: true,
        },

        {
            name: 'DATE DE CLOTURE',
            selector: row => row.date_cloture ? moment(row.date_cloture).format('Do MMMM yy') : "",
            sortable: true,
        },
         

    
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
            name: "Action",
            selector : row => (
                <>
                  <Link className="btn btn-primary btn-sm mx-1" to={`/tranfert-detail/${row.uuid}`}><i class="fa-solid fa-eye"></i>Voir</Link> 
                </>
            )
          },

    ];
    // useEffect(()=>{
    //     if(!can(permissions,'transfert-list')){
    //         navigate('/tableau-de-bord');
    //     }
    // },[user,permissions]);
    useEffect(()=>{
        fetchTransfertList();
    },[]);

    const fetchTransfertList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/transfert-materiels-depot',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                setTransfertList(resp.data.data);
                setItemsListFilter(resp.data.data);  
                setLoading(false);
            });
            
        } catch (error) {
            setLoading(false);
        }
    }

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.code.toLowerCase().includes(event.target.value.toLowerCase()));
        setTransfertList(datas);
    }

    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"transfert-mat"}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Mes transferts 
                                {/* {can(permissions,'add-transfert') && <Link  class="btn btn-primary me-2 float-end btn-sm" to='/transfert/create'>Ajouter un transfert</Link> } */}
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
                                                <input type="search" class="form-control " placeholder="Code..." onChange={handleFilter} />
                                            </div>
                                            <div class="col-lg-4 col-md-6 d-flex align-items-center mt-3 mt-md-0">
                                            
                                            </div>




                                        <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">
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
        </>
    )
}

export default TransfertDepotPage;