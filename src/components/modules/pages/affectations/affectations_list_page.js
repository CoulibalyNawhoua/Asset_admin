import { Link, useNavigate } from "react-router-dom";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function AffectationListPage()
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

        // {
        //     name: 'SECTEUR',
        //     selector: row => row.d_secteur,
        //     sortable: true,
        //   },
          {
            name: 'CATEGORIE DEMANDEE',
            selector: row => row?.categorie?.libelle,
            sortable: true,
          },   
          {
            name: 'TYPE PDV',
            selector: row => row.d_pdv_categorie,
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
                {row.status == 1 && <span class="badge bg-warning">En Validation ASM</span>}
                {row.status == 2 && <span class="badge bg-warning">En Validation RSM</span>}
                {row.status == 3 && <span class="badge bg-warning">Attente retour contrat</span>}
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
                    <Link className="btn btn-primary btn-sm me-2" to={`/affectations/${row.uuid}`}> <i className="fa fa-eye"></i> Voir </Link>
                    {/* <Link className="btn btn-danger btn-sm " to={`/update-materiel/${row.uuid}`}> <i className="fa fa-trash"></i> </Link> */}
                </>
            )
          },

    ];
    useEffect(()=>{
    if(!can(permissions,'demande-list')){
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
            axios.get(url.base+'/affectation-demande-list',{
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
            <ContentSection ulShownav={"gest-affectations"} navactive={"list-affectation"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des demandes
                                <Link  class="btn btn-primary me-2 float-end btn-sm" to='/affectations/create'>Nouvelle demande</Link>
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
                                    {/* <table id="example" class="table text-nowrap table-centered mt-0" style={{"width": "100%"}}>
                                        <thead class="table-light">
                                        <tr>
                                        <th class="pe-0">
                                            <div class="form-check" >
                                            <input
                                                class="form-check-input" id="checkAll"
                                                type="checkbox"
                                                value=""

                                            />
                                            <label
                                                class="form-check-label"
                                                for="checkAll"
                                            >
                                            </label>
                                            </div>
                                        </th>
                                                <th >Code</th>
                                                <th >Date de Creation</th>
                                                <th >Canal</th>
                                                <th >Zone</th>
                                                <th>Territoire</th>
                                                <th>Secteur</th>
                                                <th>Catégorie</th>
                                                <th>Marque</th>
                                                <th>N°Serie</th>
                                                <th>PDV</th>
                                                <th>Type de PDV</th>
                                                <th>Adresse</th>
                                                <th>Statut</th>
                                                <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {loading &&                              
                                        <div class="spinner-border" role="status" >
                                            <span class="visually-hidden">Loading...</span>
                                        </div>  
                                    } 

                                 {!loading &&
                                            askDeploieList?.map((item,index)=>
                                                <tr>
                                                    <td class="pe-0">
                                                        <div class="form-check">
                                                        <input
                                                            class="form-check-input"
                                                            type="checkbox"
                                                            value=""
                                                            id="contactCheckbox2"
                                                        />
                                                        <label
                                                            class="form-check-label"
                                                            for="contactCheckbox2"
                                                        >
                                                        </label>
                                                        </div>
                                                    </td>
                                                
                                                    <td class="ps-0 text-center">
                                                        <b>{item.code}</b>
                                                    </td>
                                                    <td>
                                                        {moment(item.date).format('Do MMMM yy HH:mm')}
                                                    </td>
                                                    <td>
                                                        {item.d_canal}
                                                  
                                                    </td>
                                                
                                                
                                                    <td><b>{item.d_zone}</b></td>

                                                    <td>{item?.d_territoire}</td>
                                                    <td>{item?.d_secteur}</td>
                                                    <td>{}</td>
                                                    <td>{}</td>
                                                    <td>{}</td>
                                                    <td>{item?.d_pdv}</td>
                                                    <td>{item?.d_pdv_categorie}</td>
                                                    <td>{item?.d_addresse}</td>
                                                    <td> 
                                                        {item.status == 0 && <span class="badge badge-warning-soft text-warning">En attente</span>}
                                                        {item.status == 1 && <span class="badge badge-warning-soft text-warning">En Validation ASM</span>}
                                                        {item.status == 2 && <span class="badge badge-warning-soft text-warning">En Validation RSM</span>}
                                                        {item.status == 3 && <span class="badge badge-warning-soft text-warning">Attente retour contrat</span>}
                                                        {item.status == 4 && <span class="badge badge-success-soft text-success">A Deployer</span>}                                                        
                                                        {item.status == 5 && <span class="badge bg-success text-white">Terminer</span>}                                                        
                                                        {item.status == 6 && <span class="badge bg-danger text-white">Rejetée</span>}    
                                                        {item.status == 7 && <span class="badge bg-info text-white">Deploiement en cours</span>}                                                     
                                                    </td>
                                                    <td>
                                                            <Link className="btn bg-warning-soft btn-sm me-2" to={`/affectations/${item.uuid}`}> <i className="fa fa-eye"></i> </Link>
                                                            <Link className="btn btn-danger btn-sm " to={`/update-materiel/${item.uuid}`}> <i className="fa fa-trash"></i> </Link>                                               
                                                    </td> 
                                                </tr>
                                            )
                                    }
                                    
                                    </tbody>
                                </table> */}
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

export default AffectationListPage;