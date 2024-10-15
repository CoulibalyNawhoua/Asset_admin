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
function DeclacementMaterielPage()
{
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
        fetchItemsList();
    },[]);

    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/materiels-declasses',{
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
        const datas = itemsListFilter.filter(row => row.libelle.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }
    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"declasse-mat"} >
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des matériaux declassés ({itemsList.length})
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

export default DeclacementMaterielPage;