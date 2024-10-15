import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../../utils/BaseUrl";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function PointDeVenteDistriforcePage() {

    const [loading, setLoading] = useState(false);
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);

    const columns = [
        {
            name: 'ID',
            selector: row => row.Id,
            sortable: true,
        },
        {
          name: 'PDV',
          selector: row => row.NomPdv,
          sortable: true,
        },
        {
            name: 'MANAGER',
            selector: row => row.ManagerPdv,
            sortable: true,
        },
        {
            name: 'TELEPHONE',
            selector: row => row.Contact,
            sortable: true,
          },
          {
            name: 'TERRITOIRE',
            selector: row => row.Territoire,
            sortable: true,
          },

        {
            name: 'ADRESSE',
            selector: row => row.Address,
            sortable: true,
          },
          {
            name: 'LATITUDE',
            selector: row => row.Latitude,
            sortable: true,
          },
          {
            name: 'LONGITUDE',
            selector: row => row.Longitude,
            sortable: true,
          },
         

    
        {
          name: "Statut",
          selector : row => (
            <>
             {row.IsActif == "ACTIF " && (
            <span className="badge bg-success">Actif</span>
            )}
            {row.IsActif == "INACTIF " && (
                <span className="badge bg-danger">Inactif</span>
            )}
            </>
          )
        },
        // {
        //     name: "Action",
        //     selector : row => (
        //         <>
        //             <button className="btn btn-primary btn-sm mx-1"><i class="fa-solid fa-pen"></i></button>
        //             <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button>
        //         </>
        //     )
        //   },

    ];

    useEffect(()=>{
        if(!can(permissions,'pdv-distriforce-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);


    useEffect(()=>{
        fetchItemsList();
    },[]);



    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/distriforce/pointdevente-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                setItemsList(resp.data);
                setItemsListFilter(resp.data);
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.NomPdv.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    return (
        <>
            <ContentSection ulShownav={"parametres"} navactive={"pdv_distriforce"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des points de ventes DISTRIFORCE</h3>
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
                                        {/* <label class="form-label me-2 mb-0">Statut</label>
                                            <select class="form-select" aria-label="Default select example">
                                                <option selected>Tous</option>
                                                <option value="1">In Progress</option>
                                                <option value="2">Delivered</option>
                                            </select> */}
                                        </div>

                                    {/* <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">
                                        <button a href="#!" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal-2">Ajouter</button>
                                        <a href="#!" class="btn btn-light " >Exporter</a>
                                    </div> */}
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

export default PointDeVenteDistriforcePage;