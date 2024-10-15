import { Link, useNavigate } from "react-router-dom";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import BaseUrl from "../../../utils/BaseUrl";
import axios from "axios";
import moment from "moment";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

 
const url = BaseUrl();
const customerStyle = CustomerStyle();

function StockMaterielPage(){
    const [materiels,setMateriels] = useState([]);
    const [count_instock,setcount_instock] = useState(0);
    const [count_wating,setcount_wating] = useState(0);
    const [count_deploye,setcount_deploye] = useState(0);
    const [count_declasse,setcount_declasse] = useState(0);
    const [count_all,setcount_all] = useState(0);
    const [categories,setCategories] = useState([]);
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
        // {
        //     name: 'DATE ACQUISITION',
        //     selector: row => moment(row.date_acquisition).format('Do MMMM yy'),
        //     sortable: true,
        // },
        {
            name: 'LIBELLE',
            selector: row => row.libelle,
            sortable: true,
        },
        // {
        //   name: 'N°SERIE',
        //   selector: row => row.num_serie,
        //   sortable: true,
        // },
        {
            name: 'FOURNISSEUR',
            selector: row => row?.fournisseur?.name,
            sortable: true,
        },

        // {
        //     name: 'DEPOT',
        //     selector: row => row?.depot?.name,
        //     sortable: true,
        //   },
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
            name: 'QTY',
            selector: row => row.stock_materiel_count > 0 ? <b className="text-success">{row.stock_materiel_count}</b> : <b className="text-danger">{row.stock_materiel_count}</b>,
            sortable: true,
        },
        

    
        // {
        //   name: "Statut",
        //   selector : row => (
        //     <>
        //     {row.status == 0 && <span class="badge bg-success">disponible</span>}
        //     {row.status == 1 && <span class="badge bg-warning">en attent d'affectation</span>}
        //     {row.status == 2 && <span class="badge badge-success-soft ">Deployé</span>}
        //     {row.status == 3 && <span class="badge bg-danger">Déclassé</span>}
        //     </>
        //   )
        // },
        {
            name: "Action",
            selector : row => (
                <>
                    {/* <Link className="btn btn-primary btn-sm ps-1" to={`/update-materiel/${row.uuid}`}> <i className="fa fa-plus"></i> Ajouter</Link> */}
                    <Link className="btn bg-warning-soft btn-sm ps-1 mx-1" to={`/stock-by-article/${row.uuid}`}> <i className="fa fa-eye"></i> Voir</Link>
                </>
            )
          },

    ];
    useEffect(()=>{
        if(!can(permissions,'stock-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);
    useEffect(()=>{
        materiel_list();
        materiel_stat_function();
        get_categorie_all();
    },[]);

    function materiel_list(){
        setLoading(true);
        try {
            axios.get(url.base+'/materiels-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{               
                setMateriels(resp.data.data);  
                setItemsListFilter(resp.data.data);              
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    function materiel_stat_function(){
        try {
            axios.get(url.base+'/materiels-statistique-use',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{               
                setcount_instock(resp.data.count_instock);
                setcount_wating(resp.data.count_wating);
                setcount_deploye(resp.data.count_deploye);
                setcount_declasse(resp.data.count_declasse);
                setcount_all(resp.data.count_all);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    function get_categorie_all()
    {
        try {
            axios.get(url.base+'/setting/category-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setCategories(resp.data.data);
                }
                // setLoading(false);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const filterByCategorie=(categorie_id)=>{
        if(categorie_id !==""){
            try {
                axios.get(url.base+'/materiels-categorie-list/'+categorie_id,{
                    headers:{
                        'Content-Type':'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                        
                    },
                }).then((resp)=>{               
                    setMateriels(resp.data.data);  
                    // setLoading(false);
                })
            } catch (error) {
                // setLoading(false);
            }
        }else{
            materiel_list();
        }

    }

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.libelle.toLowerCase().includes(event.target.value.toLowerCase()));
        setMateriels(datas);
    }


    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"stock-materiel"}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                    
                            <div class="mb-5">
                                <h3 class="mb-0 ">Gestion du stock</h3>
                            </div>
                        </div>
                    </div>
                    <div>
            
                        <div class="row">
                           
                            <div class="col-lg-3 col-md-6 col-12 mb-5">
                            <div class="card card-lift">
                                <div class="card-body">
                                <div
                                    class="d-flex align-items-center justify-content-between mb-5"
                                >
                                    <div
                                    class="icon-shape icon-md bg-info-soft text-info rounded-3"
                                    >
                                   <i class="fa-solid fa-house-circle-check"></i>
                                    </div>
                                    <div>
                                    <span class="text-success fw-bold">
                                    {(count_instock * 100 / count_all).toFixed(2) ?? 0} %</span>
                                    </div>
                                </div>
                                <div >
                                    <span class="fw-semi-bold">Matériels en stocks</span>
                                    <h3 class="mb-0 mt-1 fw-bold ">
                                    <span class="counter-value" data-target="167">{count_instock}</span>
                                    </h3>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-12 mb-5">
                            <div class="card card-lift">
                                <div class="card-body">
                                <div
                                    class="d-flex align-items-center justify-content-between mb-5"
                                >
                                    <div
                                    class="icon-shape icon-md bg-warning-soft text-warning rounded-3"
                                    >
                                 <i class="fa-solid fa-people-carry-box"></i>
                                    </div>
                                    <div>
                                    <span class="text-success fw-bold">
                                    {( count_wating * 100 / count_all).toFixed(2)  ?? 0} %</span>
                                    </div>
                                </div>
                                <div >
                                    <span class="fw-semi-bold">En cours d'affectations</span>
                                    <h3 class="mb-0 mt-1 fw-bold ">
                                    <span class="counter-value" data-target="41.56"
                                        >{count_wating}</span>
                                    </h3>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-12 mb-5">
                            <div class="card card-lift">
                                <div class="card-body">
                                <div
                                    class="d-flex align-items-center justify-content-between mb-5"
                                >
                                    <div
                                    class="icon-shape icon-md bg-primary-soft text-primary rounded-3"
                                    >
                                    <i class="fa-solid fa-truck-fast"></i>
                                    </div>
                                    <div>
                                    <span class="text-success fw-bold"
                                        ><i

                                        data-feather="arrow-up-right"
                                        class="icon-xs"
                                        ></i>
                                        {( count_deploye * 100 / count_all).toFixed(2)  ?? 0}%</span>
                                    </div>
                                </div>
                                <div >
                                    <span class="fw-semi-bold">Matériels deployés</span>
                                    <h3 class="mb-0 mt-1 fw-bold ">
                                    <span class="counter-value" data-target="33.16"
                                        >{count_deploye}</span>
                                    </h3>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-12 mb-5">
                                <div class="card card-lift">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center justify-content-between mb-5">
                                            <div class="icon-shape icon-md bg-danger-soft text-danger rounded-3"
                                            >
                                           <i class="fa-solid fa-house-circle-xmark"></i>
                                            </div>
                                            <div>
                                            <span class="text-success fw-bold"><i data-feather="arrow-up-right" ></i>
                                                {( count_declasse * 100 / count_all).toFixed(2)  ?? 0} %</span>
                                            </div>
                                        </div>
                                    <div >
                                        <span class="fw-semi-bold">Matériels declassés</span>
                                        <h3 class="mb-0 mt-1 fw-bold ">
                                        <span class="counter-value" data-target="3156">{count_declasse}</span>
                                        </h3>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                        
                            <div class="card mb-4">
                                <div class="card-header">
                                <div class="row g-2">
                                    <div class="col-md-5 col-lg-3">
                                    <input type="search" class="form-control w-100" placeholder="Recherche ..." onChange={handleFilter}
                                    />
                                    </div>
                                    <div class="col-lg-6 col-md-5   float-end">
                                        <Link to="/materiel/files-import" class="btn btn-primary">+ Obtenir un template</Link>
                                    </div>
                                 
                                    <div class="col-lg-3 ">                                  
                                        <a href="#!" class="btn btn-success  ms-2 texttooltip float-end" >
                                        <i class="fa-solid fa-download"></i> Exporter
                                    </a>
                                    {/* <Link to="/materiel/files-import" class="btn btn-danger-soft  btn-icon ms-2 texttooltip" >
                                        <i class="fa-solid fa-file-import"></i>                                    
                                    </Link> */}
                                    </div>
                                </div>
                                </div>
                                <div class="card-body">
                                <div class="table-responsive table-card">
                                <DataTable 
                                    columns={columns} 
                                    data={materiels}
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

export default StockMaterielPage;