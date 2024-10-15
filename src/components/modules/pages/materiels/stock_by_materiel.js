import axios from "axios";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import Swal from "sweetalert2";
import SwalTopEnd from '../../../utils/swal_top_end';
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function StockByArticle(){
    const {uuid} = useParams();
    const [loading,setLoading] = useState(false);
    const [ArticleList,setArticleList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [ref,setRef] = useState([]);
    const [materiel,setMateriel] = useState([]);
    const [item,setItem] = useState(null);
    const [motif_declassement,setMotifDeclassement] = useState('');
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

          {
            name: 'ADRESSE ACTUELLE',
            selector: row => (
                <>
                    {row?.position_materiel?.length > 0 &&
                        <>
                            {row?.position_materiel[0]?.depot_id !== null && <b>{row?.position_materiel[0]?.depot?.name}</b>}
                            {row?.position_materiel[0]?.pointdevente_id !==	null && <b>{row?.position_materiel[0]?.d_pdv}</b>}
                        </>
                    }
                </>
            ),
            sortable: true,
          },
         

    
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
                        {can(permissions,'declassement-materiel') && row.status == 0 && 
                            <>
                                {/* <button className="btn btn-primary btn-sm mx-1" onClick={()=>validItem(row.reference)}><i class="fa-solid fa-check"></i></button> */}
                                <button className="btn btn-danger btn-sm mx-1" onClick={()=>openDeclassementModal(row)}><i class="fa-solid fa-xmark"></i></button>
                            </>
                        }
                    </>
                }

                </>
            )
          },

    ];
        useEffect(()=>{
        if(!can(permissions,'detail-stock')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);
    
    useEffect(()=>{
        fetchTransfertList();
        materiel_list();
    },[]);

    const fetchTransfertList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/stock-materiels-list/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                setLoading(false);
                setArticleList(resp.data.data);
                setItemsListFilter(resp.data.data);  
            })
        } catch (error) {
            setLoading(false);
        }
    }

    function materiel_list(){
        try {
            axios.get(url.base+'/materiels/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{               
                setMateriel(resp.data.data);                
                // setLoading(false);
            });
        } catch (error) {
            // setLoading(false);
        }
    }

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.num_serie.toLowerCase().includes(event.target.value.toLowerCase()));
        setArticleList(datas);
    }

    const openDeclassementModal=(row)=>{
        setItem(row);
        window.$('#exampleModal-2').modal('show');
    }

    const openViewModal=(row)=>{
        setItem(row);
        window.$('#basicModal').modal('show');
    }



    const submitForm=(e)=>{
        e.preventDefault();
        
        if(motif_declassement !=""){
          const _formData = new FormData();
          _formData.append('motif_declassement',motif_declassement);
          setLoading(true);
            console.log(item);
          try {
            axios.post(`${url.base}/materiels-declassement/${item.num_serie}`,_formData,
           {
               headers:{
                   'Content-Type':'multipart/form-data',
                   "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                   
               },
              //  credentials:'include'
           }
           ).then((resp)=>{          
               setLoading(false);
               
                    SwalTopEnd({icon:"success",title:"Declassement effectué avec succès"});
  
                    setMotifDeclassement('');
                    fetchTransfertList();
                    setItem(null);
                  window.$('#exampleModal-2').modal('hide');
                 
            //    fetchRibList();
             
           })
       } catch (error) {
        setLoading(false);
           console.log(error.response);
       } 
  
        }else{
            SwalTopEnd({icon:"error",title:"Le motif est obligatoire"});
        }
    }
    const DownloadFile= (reference)=>{
        // e.preventDefault();    
      
        try {
            axios.get(url.base+'/download-file-import-materiel/'+reference,
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
              link.setAttribute('download', 'materiel_import.xlsx');
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

    const validItem = async (reference) => {
        setRef(reference)
        Swal.fire({
            title: 'ATTENTION !',
            text: 'Êtes-vous sûre de vouloir valider le fichier '+reference,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText:"NON",
            confirmButtonText: 'OUI',
            cancelButtonColor:"red"
          }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    axios.get(url.base+'/valid-file-import-materiel/'+reference,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`                                
                            },
                        }
                    ).then((resp)=>{
                        fetchTransfertList();
                        setLoading(false);
                        Swal.fire({
                            text : resp.data.code == 400 ? resp.data.msg : "L'entré en stock a été effectué avec success",
                            icon: resp.data.code == 400 ? 'warning' : 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                          });
                         
                    })
                } catch (error) {
                    setLoading(false);
                    console.log(error);
                }

            
            }
          }); 
    }

    const refusedItem = async (reference) => {
        setRef(reference);
        Swal.fire({
            title: 'ATTENTION !',
            text: 'Êtes-vous sûre de vouloir rejeter le fichier '+reference,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText:"NON",
            confirmButtonText: 'OUI',
            cancelButtonColor:"red"
          }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    axios.get(url.base+'/refused-file-import-materiel/'+reference,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`                                
                            },
                        }
                    ).then((resp)=>{
                        setLoading(false);
                        fetchTransfertList();
                        Swal.fire({
                            text : resp.data.code == 400 ? resp.data.msg : "Le fichier a été rejeté avec succes",
                            icon: resp.data.code == 400 ? 'warning' : 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                          });
                    
                    })
                } catch (error) {
                    setLoading(false);
                    console.log(error);
                }

            
            }
          }); 
    }

    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"stock-materiel"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                                
                                <div class="mb-5">
                                    <h3 class="mb-0 text-primary">
                                    <Link to={`/materiel/${materiel.uuid}`}><i class="fa-solid fa-list"></i> {materiel?.libelle} ({materiel?.stock_materiel_count})</Link>
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
                                                    <input type="search" class="form-control " placeholder="Numéro de serie..." onChange={handleFilter} />

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
                                                    data={ArticleList}
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

                
            <div class="modal fade" id="exampleModal-2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-info-soft ">
                            <h5 class="modal-title" id="exampleModalLabel">Déclassé le matériel</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Motif de declassement</label>
                                <select className="form-control" onChange={(e)=>setMotifDeclassement(e.target.value)} value={motif_declassement}>
                                    <option value="" selected>---</option>
                                    <option value="Vente du matériel">Vente du matériel</option>
                                </select>
                                {/* <input type="text" id="textInput" class="form-control" /> */}
                               
                            </div>
                            
                            </div>
                            <div class="modal-footer bg-primary-soft">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                
                                {!loading && <button type="submit" class="btn btn-primary ">Valider</button>}
                                {loading && <button class="btn btn-primary" type="button" disabled>
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Chargement...
                                        </button>}
                                
                                
                            </div>
                        </form>
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
                                <tr>
                                    <td><b>ADRESSE ACTUELLE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {item?.position_materiel[0]?.depot_id !== null && <b>{item?.position_materiel[0]?.depot?.name}</b>}
                                        {item?.position_materiel[0]?.pointdevente_id !==	null && <b>{item?.position_materiel[0]?.d_pdv}</b>}
                                    </td>
                                </tr>    
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

export default StockByArticle;