import { useEffect, useState } from "react";
import ContentSection from "../../Content";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import { Link } from "react-router-dom";
import moment from "moment";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function StockByMaterielPage(){
    const [loading,setLoading] = useState(false);
    const [itemsList,setItemsList] = useState([]);

    const [itemsListFilter,setItemsListFilter] = useState([]);
    const columns = [
        {
            name: 'CODE',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'NOM DU DEPOT',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'TERRITOIRE',
            selector: row => row?.territoire?.libelle,
            sortable: true,
        },
        {
            name: 'ADRESSE',
            selector: row => row.adresse,
            sortable: true,
        },
        {
          name: 'LATITUDE',
          selector: row => row.latitude,
          sortable: true,
        },
        {
            name: 'LONGITUDE',
            selector: row => row.longitude,
            sortable: true,
        },

        {
            name: 'NBRES MATERIAUX',
            selector: row => (
                <b className="text-danger">{row.materiels_count}</b>
            ),
            sortable: true,
          },
          
        {
            name: "Action",
            selector : row => (
                <>
                    {/* <Link className="btn btn-primary btn-sm ps-1" to={`/update-materiel/${row.uuid}`}> <i className="fa fa-pencil"></i> </Link> */}
                    <Link className="btn bg-warning-soft btn-sm  mx-1" to={`/stock-by-depots/${row.uuid}/${row.name}`}> <i className="fa fa-eye"></i> </Link>
                </>
            )
          },

    ];
    useEffect(()=>{
        fetchItemsList();
    },[]);

    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/materiels-stock-by-depot',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                setItemsList(resp.data.data);
                setItemsListFilter(resp.data.data); 
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
            <ContentSection ulShownav={"managements"} navactive={"in-stock-dept"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Stock des matériaux par dépôts
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
                                    customStyles={customerStyle}
                                    pagination
                                    selectableRows
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

export default StockByMaterielPage;