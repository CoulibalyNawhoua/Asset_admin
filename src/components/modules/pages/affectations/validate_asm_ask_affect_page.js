import axios from "axios";
import { useContext, useEffect, useState } from "react";
import BaseUrl from "../../../utils/BaseUrl";
import ContentSection from "../../Content";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function ValidateAsmAskDemandePage()
{
    const [askDeploieList,setAskDeploieList] = useState([]);
    const [loading,setLoading] = useState(false);
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
            name: 'DATE CREATION',
            selector: row => moment(row.date).format('Do MMMM yy HH:mm'),
            sortable: true,
        },


        {
            name: 'TERRITOIRE',
            selector: row => row.d_territoire,
            sortable: true,
        },


          {
            name: 'CATEGORIE DEMANDEE',
            selector: row => row?.categorie?.libelle,
            sortable: true,
          },


          {
            name: 'PDV',
            selector: row => row.d_pdv,
            sortable: true,
          },


        

    
        {
          name: "Statut",
          selector : row => (
            <>
                {row.status == 0 && <span class="badge bg-warning">En attente affectation</span>}
                {row.status == 1 && <span class="badge bg-danger">En attente du ASM</span>}
                {row.status == 2 && <span class="badge bg-warning">En attente du RSM</span>}
                {row.status == 3 && <span class="badge bg-warning">Attente contrat</span>}
                {row.status == 4 && <span class="badge bg-success">A Deployer</span>}                                                        
                {row.status == 5 && <span class="badge bg-success">Terminer</span>}                                                        
                {row.status == 6 && <span class="badge bg-danger">Rejetée</span>}    
                {row.status == 7 && <span class="badge bg-info">Deploiement en cours</span>}   
            </>
          )
        },
        {
            name: "ACTION",
            selector : row => (
                <>
                {row.status == 1 ?
                <Link className="btn btn-primary btn-sm me-2" to={`/affect-asm-en-attente/${row.uuid}`}> <i className="fa fa-plus"></i> Valider</Link>
                : 
                <Link className="btn btn-success btn-sm me-2" to={`/affectations/${row.uuid}`}> <i className="fa fa-eye"></i> Voir </Link>
            }
                   
                    {/* <Link className="btn btn-danger btn-sm " to={`/update-materiel/${row.uuid}`}> <i className="fa fa-trash"></i> </Link> */}
                </>
            )
          },

    ];

            useEffect(()=>{
    if(!can(permissions,'demande-asm-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);
    useEffect(()=>{
        get_demande_affectatiion();
    },[]);

    function get_demande_affectatiion()
    {
        setLoading(true);
        try {
            axios.get(url.base+'/affect-en-attente-validation-asm',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                setLoading(false);
                setAskDeploieList(resp.data.data);
                setItemsListFilter(resp.data.data); 
            })
        } catch (error) {
            setLoading(false);
        }
    }
    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.d_pdv.toLowerCase().includes(event.target.value.toLowerCase()));
        setAskDeploieList(datas);
    }
    return (
        <>
         <ContentSection ulShownav={"gest-affectations"} navactive={"affectation-asm"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste de demande ASM
                                {/* <Link  class="btn btn-primary me-2 float-end btn-sm" to='/affectations/create'>Nouvelle demande</Link> */}
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
                                                <input type="search" class="form-control " placeholder="PDV..." onChange={handleFilter}/>

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
                                    data={askDeploieList}
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

export default ValidateAsmAskDemandePage;