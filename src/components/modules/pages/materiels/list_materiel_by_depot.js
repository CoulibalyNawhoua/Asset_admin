import axios from "axios";
import ContentSection from "../../Content";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function DepotPageMateriel(){
    const {uuid} = useParams();
    const {depotLibelle} = useParams();

    const [loading,setLoading] = useState(false);
    const [tranfertList,setTransfertList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);

    const columns = [
        {
            name: 'CODE',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'DATE ACQUISITION',
            selector: row => moment(row.date_acquisition).format('Do MMMM yy'),
            sortable: true,
        },
        {
            name: 'LIBELLE',
            selector: row => row.libelle,
            sortable: true,
        },
        {
          name: 'N°SERIE',
          selector: row => row.num_serie,
          sortable: true,
        },
        {
            name: 'FOURNISSEUR',
            selector: row => row?.fournisseur?.name,
            sortable: true,
        },

        {
            name: 'DEPOT',
            selector: row => row?.depot?.name,
            sortable: true,
          },
          {
            name: 'CATERGORIE',
            selector: row => row?.categorie?.libelle,
            sortable: true,
          },
          {
            name: 'MARQUE',
            selector: row => row?.marque?.libelle,
            sortable: true,
          },
        

    
        {
          name: "Statut",
          selector : row => (
            <>
            {row.status == 0 && <span class="badge badge-warning-soft text-warning">disponible</span>}
            {row.status == 1 && <span class="badge badge-danger-soft text-danger">en attent d'affectation</span>}
            {row.status == 2 && <span class="badge badge-success-soft text-success">Deployé</span>}
            {row.status == 3 && <span class="badge badge-danger-soft text-danger">Déclassé</span>}
            </>
          )
        },
        {
            name: "Action",
            selector : row => (
                <>
                    <Link className="btn btn-primary btn-sm ps-1" to={`/update-materiel/${row.uuid}`}> <i className="fa fa-pencil"></i> </Link>
                    <Link className="btn bg-warning-soft btn-sm ps-1 mx-1" to={`/materiel/${row.uuid}`}> <i className="fa fa-eye"></i> </Link>
                </>
            )
          },

    ];


    useEffect(()=>{
        fetchTransfertList();
    },[]);

    const fetchTransfertList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/materiels-stock-depot/'+uuid,{
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
        <>
            <ContentSection ulShownav={"managements"} navactive={"in-stock-dept"}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des materiels du depôt {depotLibelle}
                                {/* <Link  class="btn btn-primary me-2 float-end btn-sm" to='/transfert/create'>Ajouter un transfert</Link> */}
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
                                                <input type="search" class="form-control " placeholder="Recherche..." onChange={handleFilter} />

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
                                    data={tranfertList}
                                    customStyles={customerStyle}
                                    pagination
                                    selectableRows
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

export default DepotPageMateriel;