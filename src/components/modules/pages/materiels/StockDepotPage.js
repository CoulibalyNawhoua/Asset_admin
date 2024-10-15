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

function StockDepotPage(){
    const [materiels,setMateriels] = useState([]);
    const [count_instock,setcount_instock] = useState(0);
    const [count_wating,setcount_wating] = useState(0);
    const [count_deploye,setcount_deploye] = useState(0);
    const [count_declasse,setcount_declasse] = useState(0);
    const [count_all,setcount_all] = useState(0);
    const [categories,setCategories] = useState([]);
    const [loading,setLoading] = useState(false);
    const [ref,setRef] = useState([]);
    const [item,setItem] = useState(null);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();   
    const columns = [
        {
            name: 'QR CODE',
            selector: row => (
                <>
                    <img className="p-1" src={`${url.image}/${row?.qrcode_path}`}  width={100}/>
                </>
            ),
            sortable: true,
        },
        {
            name: 'NUM SERIE',
            selector: row =>row.num_serie,
            sortable: true,
        },

        {
          name: 'MARQUE',
          selector: row => row.materiel?.marque?.libelle,
          sortable: true,
        },


        {
            name: 'MODELE',
            selector: row => row.materiel?.modele?.libelle ,
            sortable: true,
          },

        //   {
        //     name: 'ADRESSE ACTUELLE',
        //     selector: row => (
        //         <>
        //             {row?.position_materiel?.length > 0 &&
        //                 <>
        //                     {row?.position_materiel[0]?.depot_id !== null && <b>{row?.position_materiel[0]?.depot?.name}</b>}
        //                     {row?.position_materiel[0]?.pointdevente_id !==	null && <b>{row?.position_materiel[0]?.d_pdv}</b>}
        //                 </>
        //             }
        //         </>
        //     ),
        //     sortable: true,
        //   },
         

    
        {
          name: "Statut",
          selector : row => (
            <>
            {row.status == 1 && <span class="badge bg-warning">En attente d'affectation</span>}
            {row.status == 2 && <span class="badge bg-success">Deployé</span>}
            {row.status == 3 && <span class="badge bg-danger">Declassé</span>}
            {row.status == 4 && <span class="badge bg-danger">A deployer</span>}
            {row.status == 0 && <span class="badge bg-success">En stock</span>}
            </>
          )
        },
        {
            name: "Action",
            selector : row => (
                <>
                {ref === row.reference && loading ? 
                <div class="text-center">
                    <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                
                : 
                    <>
                        <button className="btn btn-success btn-sm mx-1" onClick={()=>openViewModal(row)}> <i class="fa-solid fa-eye"></i> </button>
                        
                    </>
                }

                </>
            )
          },

    ];
    // useEffect(()=>{
    //     if(!can(permissions,'stock-list')){
    //         navigate('/tableau-de-bord');
    //     }
    // },[user,permissions]);
    useEffect(()=>{
        materiel_list();
        materiel_stat_function();
        get_categorie_all();
    },[]);

    function materiel_list(){
        setLoading(true);
        try {
            axios.get(url.base+'/stock-depots-list',{
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
            axios.get(url.base+'/materiels-statistique-depot',{
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
        const datas = itemsListFilter.filter(row => row.num_serie.toLowerCase().includes(event.target.value.toLowerCase()));
        setMateriels(datas);
    }

    const openViewModal=(row)=>{
        setItem(row);
        window.$('#basicModal').modal('show')
    }



    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"stock-depot"}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                    
                            <div class="mb-5">
                                <h3 class="mb-0 ">Mon Depôt</h3>
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
                                    {/* <span class="text-success fw-bold">
                                    {(count_instock * 100 / count_all).toFixed(2) ?? 0} %</span> */}
                                    </div>
                                </div>
                                <div >
                                    <span class="fw-semi-bold">Matériels en stocks</span>
                                    <h3 class="mb-0 mt-1 fw-bold ">
                                    <span class="counter-value" data-target="167">{count_all}</span>
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
                                    {/* <span class="text-success fw-bold">
                                    {( count_wating * 100 / count_all).toFixed(2)  ?? 0} %</span> */}
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
                            {/* <div class="col-lg-3 col-md-6 col-12 mb-5">
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
                            </div> */}
                        </div>
                        <div class="row">
                            <div class="col-12">
                        
                            <div class="card mb-4">
                                <div class="card-header">
                                <div class="row g-2">
                                    <div class="col-md-5 col-lg-3">
                                    <input type="search" class="form-control w-100" placeholder="NOUMERO DE SERIE ..." onChange={handleFilter}
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

                <div class="modal fade" id="basicModal" tabindex="-1"  aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title">Information complète</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <table class="table table-striped">
                             
                                <tbody>
                                <tr>
                                    <td><b>NUMERO DE SERIE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>{item?.num_serie}</td>
                                </tr>
                                <tr>
                                    <td><b>CATERGORIE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>{item?.materiel?.categorie?.libelle}</td>
                                </tr>  
                                <tr>
                                    <td><b>MARQUE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>{item?.materiel?.marque?.libelle}</td>
                                </tr>     
                                <tr>
                                    <td><b>MODELE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>{item?.materiel?.modele?.libelle}</td>
                                </tr>                                
                                <tr>
                                    <td><b>DATE D'ACQUISITION</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>{moment(item?.date_acquisition).format("Do MMMM YYYY")}</td>
                                </tr>   
                                <tr>
                                    <td><b>STATUT</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                    {item?.status == 1 && <span class="badge bg-warning">EN ATTENTE AFFECTATION</span>}
                                    {item?.status == 2 && <span class="badge bg-success">DEPLOYER</span>}
                                    {item?.status == 3 && <span class="badge bg-danger">DECLASSE</span>}
                                    {item?.status == 4 && <span class="badge bg-danger">A DEPLOYER</span>}
                                    {item?.status == 0 && <span class="badge bg-success">EN STOCK</span>}
                                    </td>
                                </tr>   
                                  
                                <tr>
                                    <td><b>QR CODE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                    <img className="p-1" src={`${url.image}/${item?.qrcode_path}`}  width={100}/>
                                    </td>
                                </tr>     
                                <tr>
                                    <td><b>CAPACITE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>{item?.materiel?.capacite?.libelle}</b>
                                    </td>
                                </tr>     
                                {/* <tr>
                                    <td><b>ADRESSE ACTUELLE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {item?.position_materiel[0]?.depot_id !== null && <b>{item?.position_materiel[0]?.depot?.name}</b>}
                                        {item?.position_materiel[0]?.pointdevente_id !==	null && <b>{item?.position_materiel[0]?.d_pdv}</b>}
                                    </td>
                                </tr>     */}
                                {item?.status == 3 &&
                                    <>
                                <tr className="bg-danger-soft">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>  
                                <tr>
                                    <td><b>DATE DE DECLASSEMENT</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                    {moment(item?.date_declassement).format("Do MMMM YYYY")}
                                    </td>
                                </tr>     
                                <tr>
                                    <td><b>MOTIF</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>
                                        {item?.motif_declassement}
                                        </b>
                                    </td>
                                </tr>     
                               
                                    </>
                                } 
                               
                                {/* <tr>
                                    <td><b>Date Création (GMT)</b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>     
                                <tr>
                                    <td><b>Date Création (GMT)</b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>     
                                <tr>
                                    <td><b>Date Création (GMT)</b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>  */}
                                </tbody>
                            </table>
                            </div>
                           
                        </div>
                        </div>
            </div>
            </ContentSection>
        </>
    )
}

export default StockDepotPage;