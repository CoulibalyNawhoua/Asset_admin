import { useContext, useEffect, useState } from "react";
import ContentSection from "../../Content";
import axios from "axios";
import CustomerStyle from "../../../utils/customerStyle";
import BaseUrl from "../../../utils/BaseUrl";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import moment from "moment";
import Swal from "sweetalert2";
import separateNumber from '../../../utils/separateur'; 
import SwalTopBar from '../../../utils/swal_top_end'; 
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customStyles = CustomerStyle();
function FacturePageList()
{
    const [loading,setLoading] = useState(false);
    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [subLoading,setSubLoading] = useState(false);
    const [commentaire,setCommentaire] = useState('');
    // const [ref,setRef] = useState([]);
    const [item,setItem] = useState(null);
    const [errorText,setErrorText] = useState(false);

        const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const columns = [
        {
            name: 'REFERENCE',
            selector: row => `${row.reference}`,
            sortable: true,
        },
        {
            name: 'REPARATEUR',
            selector: row => row.intervention?.reparateur_first?.length > 0 ? row.intervention?.reparateur_first[0]?.reparateur?.name : "",
            sortable: true,
        },
        {
          name: 'MATERIEL',
          selector: row => row.intervention?.materiel ? `${row.intervention?.materiel?.article.libelle}` : "",
          sortable: true,
        },

        // {
        //     name: 'CANAL',
        //     selector: row => row.d_canal,
        //     sortable: true,
        // },
        {
            name: 'TERRITOIRE',
            selector: row => row.intervention?.d_territoire,
            sortable: true,
        },
        {
            name: 'SECTEUR',
            selector: row => row.intervention?.d_secteur,
            sortable: true,
        },      
        {
            name: 'MONTANT',
            selector: row => separateNumber(row.montant),
            sortable: true,
        },
      
        {
            name: "STATUT",
            selector : row => (
              <>
                
                {row.status == 0 && (
                    <span className="badge bg-warning">En cours</span>
                )}
                {row.status == 2 && (
                  <span className="badge bg-danger">Rejeté</span>
                )}
                {row.status == 1 && (
                  <span className="badge bg-success">Terminé</span>
                )}
              </>
            )
        },
    
        {
            name: "Action",
            selector : row => (
                <>
                  {can(permissions,'consult-facture') && 
                    <button className="btn btn-danger btn-sm mx-1" onClick={()=>Downloadpdf(row.id)}><i class="fa-solid fa-download"></i></button>
                }

                {can(permissions,'detail-facture') && 
                    <button className="btn btn-success btn-sm" onClick={()=>open_modal_detail(row)}><i class="fa-solid fa-eye"></i></button>
                }
                </>
            )
        },

    ];

    useEffect(()=>{
    if(!can(permissions,'facture-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        fetchList();
    },[]);

    const fetchList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/list-factures',{
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
        const datas = itemsListFilter.filter(row => row.reference.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    const Downloadpdf= (id)=>{
        // e.preventDefault();
        
        setSubLoading(true);
        
        try {
            axios.get(url.base+'/download-facture-intervention/'+id,
            {
                headers:{
                    'Content-Type':'application/pdf',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
                responseType:'blob',
                // credentials:'include'
            }
            ).then((response)=>{
                setSubLoading(false);
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                
                // Définir le nom du fichier en fonction de son type
                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'facture_file';
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (fileNameMatch.length > 1) {
                        fileName = fileNameMatch[1];
                    }
                }
                
                // Si aucune information sur le nom de fichier n'est trouvée, définir en fonction du type MIME
                if (!fileName) {
                    const mimeType = response.headers['content-type'];
                    const extension = mimeType.split('/')[1]; // Prend la partie après le '/'
                    fileName = `facture_file.${extension}`;
                }
                
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
            }).catch((error)=>{
                setSubLoading(false);
                console.log(error);
            })
        } catch (error) {
            setSubLoading(false);
            console.log(error);  
        }
    }

    const open_modal_detail=(row)=>{
        setItem(row);
        window.$('#basicModal').modal('show');
    }

    const open_modal_commentaire=()=>{
        // setItem(row);
        window.$('#basicModal').modal('hide');
        window.$('#exampleModal2').modal('show');
    }

    const validate_devis_intervention=()=>{
        
        Swal.fire({
            title: 'ATTENTION !',
            text: 'Êtes-vous sûre valider cette facture.',
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
                    axios.get(url.base+'/valider-facture-intervention/'+item?.id,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`                                
                            },
                        }
                    ).then((resp)=>{
                        setLoading(false);

                        if(resp.status == 200)
                        {

                        Swal.fire(
                            "Félicitation",
                            "La facture a été validé avec succes.",
                            "success"
                        );
                        window.$('#basicModal').modal('hide');
                        fetchList();
                           
                        }
                    })
                } catch (error) {
                    console.log(error);
                }

            
            }
          }); 
    }

    const handleChangeCommentaire=(value)=>{
        setErrorText(false);
        console.log(value.length);
        if(value.length < 30){
            setCommentaire(value);
        }else{
            setErrorText(true);
        }
    }

    const submitForm=(e)=>{
        e.preventDefault();
        
        if(commentaire !=""){
          const _formData = new FormData();
          _formData.append('commentaire',commentaire);
          setLoading(true);
  
          try {
            axios.post(`${url.base}/rejeter-devis-intervention/${item.id}`,_formData,
           {
               headers:{
                   'Content-Type':'multipart/form-data',
                   "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                   
               },
              //  credentials:'include'
           }
           ).then((resp)=>{          
               setLoading(false);
               SwalTopBar({icon:"success",title:"La facture a été rejeté avec succès !"});  
               window.$('#exampleModal2').modal('hide');  
               fetchList();               
             
           })
       } catch (error) {
           console.log(error.response);
       } 
  
        }else{
            SwalTopBar({icon:"error",title:"Le commentaire est obligatoire"});
        }
    }

    return (
        <>
        <ContentSection ulShownav={"interventions"} navactive={"facture_list"}>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-12">
                        
                        <div class="mb-5">
                            <h3 class="mb-0 ">Gestion des factures
                                {/* <Link  class="btn btn-primary me-2 float-end btn-sm" to='/create-interventions'>Ajouter une intervention</Link> */}
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
                                            <input type="search" class="form-control " placeholder="Reference..." onChange={handleFilter}/>

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
                                        customStyles={customStyles}
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
                            <h5 class="modal-title">Information :  <b>{item?.libelle}</b></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <table class="table table-striped">
                             
                                <tbody>
                                <tr>
                                    <td><b>REFERENCE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item?.reference}</b></td>
                                </tr>
                                <tr>
                                    <td><b>TICKET INTERVENTION</b></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item?.intervention?.code}</b></td>
                                </tr>
                                <tr>
                                    <td><b>REPARATEUR</b></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item?.intervention?.reparateur_first[0]?.reparateur?.name }</b></td>
                                </tr>  
                                <tr>
                                    <td><b>TERRITOIRE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item?.intervention?.d_territoire}</b></td>
                                </tr>     
                                <tr>
                                    <td><b>SECTEUR</b></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item?.intervention?.d_secteur}</b></td>
                                </tr>                                
                                <tr>
                                    <td><b>DATE DE CREATION</b></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{moment(item?.created_at).format("Do MMMM YYYY")}</b></td>
                                </tr>  
                                <tr>
                                    <td><b>MONTANT DE LA FACTURE</b></td>
                                    <td></td>
                                    <td></td>
                                    <td><b className="text-danger">{separateNumber(item?.montant)}</b> Fcfa</td>
                                </tr> 
                                <tr>
                                    <td><b>STATUT</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                    {item?.status == 1 && <span class="badge bg-success">Terminé</span>}
                                    {item?.status == 2 && <span class="badge bg-danger">Rejeté</span>}
                                    {item?.status == 0 && <span class="badge bg-warning">En cours</span>}
                                    </td>
                                </tr>   
                                  
                                <tr>
                                    <td><b>PDV</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>{item?.intervention?.d_pdv}</b>
                                    </td>
                                </tr>  
                                <tr>
                                    <td><b>MATERIEL</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>{item?.intervention?.materiel?.article.libelle}</b>
                                    </td>
                                </tr>    
                                <tr>
                                    <td><b>TYPE INTERVENTION</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>{item?.intervention?.type_intervention?.libelle}</b>
                                    </td>
                                </tr>  
                                {item?.status == 2 &&
                                    <tr>
                                    <td><b>MOTIF DE REJET</b></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b className="text-danger">{item?.commentaire}</b>
                                    </td>
                                </tr>
                                }
                                     
                                </tbody>
                            </table>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class={subLoading ? "btn btn-primary disabled":"btn btn-primary"} onClick={()=>Downloadpdf(item?.id)}>Télecharger</button>
                               {item?.status == 0 &&
                                <>
                                    <button type="button" class={loading ? "btn btn-danger disabled" : "btn btn-danger"} onClick={()=>open_modal_commentaire()}>Rejeter la facture</button>
                                    <button type="button" class={loading ? "btn btn-success disabled" : "btn btn-success"} onClick={()=>validate_devis_intervention()}>Valider la facture</button>
                                </>
                               }

                            </div>
                           
                        </div>
                        </div>
            </div>

            <div class="modal fade" id={`exampleModal2`} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-info-soft ">
                            <h5 class="modal-title" id="exampleModalLabel">Rejeter la facture:  <b className="text-success">{item?.libelle}</b></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Commentaire {errorText ? <span className="text-danger">Le nombre de caractère doit etre inferieur à 30</span> : ""}</label>
                                <input type="text" id="textInput" class="form-control" value={commentaire} onChange={(e)=>handleChangeCommentaire(e.target.value)} />
                               
                            </div>
                            
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                
                                {!loading && !errorText && <button type="submit" class="btn btn-primary ">Enregistrer</button>}
                                {loading && <button class="btn btn-primary" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Chargement...
                                </button>}                               
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ContentSection>
        </>
    )
}

export default FacturePageList;