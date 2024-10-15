import { useContext, useEffect, useState } from "react";
import BaseUrl from "../../../../utils/BaseUrl";
import CustomerStyle from "../../../../utils/customerStyle";
import ContentSection from "../../../Content";
import DataTable from "react-data-table-component";
import moment from "moment";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../utils/User_check";
import can from "../../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function HistoriqueContrat()
{
    const [errors,setErrors] = useState({});
    const [itemsList,setItemsList] = useState([]);
    const [loading,setLoading] = useState(false);    
    const [itemsListFilter,setItemsListFilter] = useState([]);

    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const columns = [
        {
            name: 'CODE AFFECTATION',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'ADRESSE DU PDV',
            selector: row => row.d_addresse,
            sortable: true,
        },

        {
            name: 'CATEGORIE PDV',
            selector: row => `${row.d_pdv_categorie}`,
            sortable: true,
        },

        {
            name: 'PDV',
            selector: row => `${row.d_pdv} ${row.d_contact}`,
            sortable: true,
        },
      
        {
          name: 'MANAGER',
          selector: row => row.d_pdv_manager,
          sortable: true,
        },

        {
            name: 'DATE DEBUT',
            selector: row => row.contrat_date_debut !== null ? moment(row.contrat_date_debut).format("Do MMMM YYYY") : "" ,
            sortable: true,
        },

        {
            name: 'DATE FIN CONTRAT',
            selector: row => row.contrat_date_fin !== null ? moment(row.contrat_date_fin).format("Do MMMM YYYY") : "" ,
            sortable: true,
        },
       
    
        {
          name: "STATUT DU CONTRAT",
          selector : row => (
            <>
             {row.statut_contrat == 3 && (
            <span className="badge bg-success">Actif</span>
            )}
            {row.statut_contrat == 4 && (
                <span className="badge bg-danger">Inactif</span>
            )}
            </>
          )
        },
        {
            name: "Action",
            selector : row => (
                <>
                 <Link className="btn btn-success btn-sm me-1" to={`/affectations/${row.uuid}`}> <i className="fa fa-eye"></i>  </Link>
                    <button className="btn btn-primary btn-sm mx-1" onClick={()=>Downloadpdf(row.id)}><i class="fa-solid fa-download"></i></button>
                    {/* <button className="btn btn-danger btn-sm" onClick={()=>open_modal_rompre(row)}>ROMPRE</button> */}
                </>
            )
          },

    ];

        useEffect(()=>{
    if(!can(permissions,'invalide-contrat-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        fetchItemsList();
    },[]);



    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/contrat-invalide-list',{
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

    const Downloadpdf= (itemId)=>{
        // e.preventDefault();
        
        // setSubLoading(true);
        
        try {
            axios.get(url.base+'/consult-contrat-affectation/'+itemId,
            {
                headers:{
                    'Content-Type':'application/pdf',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
                responseType:'blob',
                // credentials:'include'
            }
            ).then((response)=>{
                // setSubLoading(false);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'contrat_affectation.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch((error)=>{
                // setSubLoading(false);
                console.log(error);
            })
        } catch (error) {
            // setSubLoading(false);
            console.log(error);  
        }
    }

    return (
        <>
            <ContentSection ulShownav={"gest-contrat"} navactive={"histo_contrat"}>
            <div class="container-fluid">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-12">
                                    
                                    <div class="mb-5">
                                        <h3 class="mb-0 ">Liste des contrats invalide</h3>

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




                                                <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">

                                                    {/* <button a href="#!" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal-2">Ajouter</button> */}
                                                    <a href="#!" class="btn btn-light " >Exporter</a>
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
    );
}

export default HistoriqueContrat;