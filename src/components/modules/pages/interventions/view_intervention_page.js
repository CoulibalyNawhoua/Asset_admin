import { useContext, useEffect, useState } from "react";
import ContentSection from "../../Content";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import SwalTopEnd from "../../../utils/swal_top_end";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import separateNumber from "../../../utils/separateur";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customStyles = CustomerStyle();
function ViewInterventionPage()
{
    const {uuid} = useParams();
    const [intervention,setIntervention] = useState([]);
    const [reparateurs,setReparateurs] = useState([]);
    const [loading,setLoading] = useState(false);
    const [selectReparateur,setSelectReparateur] = useState(null);
    const [listReparateurTab,setListReparateurTab] = useState([]);
    const [factures,setFactures] = useState([]);
    const [subLoading,setSubLoading] = useState(false);
    const [item,setItem] = useState(null);
    
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(()=>{
    if(!can(permissions,'intervention-detail')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

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
            name: 'MONTANT',
            selector: row => separateNumber(row.montant) ,
            sortable: true,
        },

        {
            name: "CATEGORIE",
            selector : row => (
              <>
                
                {row.category == 1 && (
                    <span className="fw-bold ">Devis</span>
                )}
                {row.category == 2 && (
                  <span className="fw-bold ">Facture</span>
                )} 
               
              </>
            )
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
                    <button className="btn btn-danger btn-sm mx-1" onClick={()=>Downloadpdf(row.id)}><i class="fa-solid fa-download"></i></button>
                    <button className="btn btn-success btn-sm" onClick={()=>open_modal_detail(row)}><i class="fa-solid fa-eye"></i></button>
                </>
            )
        },

    ];

    useEffect(()=>{
        fetchItem();
        fetchReparateurList();
        fetchItemFactures();
    },[]);

    function fetchItem()
    {
        setLoading(true);
        try {
            axios.get(url.base+'/intervention-view/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setIntervention(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    function fetchReparateurList()
    {
        try {
            axios.get(url.base+'/raparateurs-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setReparateurs(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    function fetchItemFactures()
    {
        setLoading(true);
        try {
            axios.get(url.base+'/factures-intervention/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                setLoading(false);
                if(resp.status == 200){
                    setFactures(resp.data.data);
                }
             
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const optionsreparateurs = reparateurs?.map((option)=>({
        label:`${option.name}`,
        value: option.id
    }));

    const handleChangeListReparateur=(option)=>{
        setSelectReparateur(option.value);
        
        let reparateur_choose = reparateurs.find((item)=> item.id === option.value);
        // console.log(reparateur_choose);
      
        if(listReparateurTab.find((list)=> list.reparateur_id === reparateur_choose.id)){
          console.log("oops")
        }else{
          const itemTable = {
            "reparateur_id":reparateur_choose?.id,
            "name":reparateur_choose?.name,
            "phone":reparateur_choose?.phone,
            "ville":reparateur_choose?.ville,
            "territoire":reparateur_choose?.territoire?.libelle,
            
          }
  
          setListReparateurTab([...listReparateurTab,itemTable]);
        }
      }

      const removeItem = (i) => {
        const updatedMat = [...listReparateurTab];
        updatedMat.splice(i, 1);
        setListReparateurTab(updatedMat);
        setSelectReparateur(null);
      };

      const add_reparateur_modal=()=>{
        if(intervention?.reparateur_first.length > 0){
            Swal.fire({
                icon: 'info',
                title: "Il y a deja un reparateur sur cette intervention.",
            });
            return;
        }

        window.$("#add-edit-modal").modal("show");
      }

      const retire_reparateur_on_intervention=(reparateur_id)=>{
        
        Swal.fire({
            title: 'ATTENTION !',
            text: 'Êtes-vous sûre retirer le reparateur de cette intervention.',
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
                    axios.get(url.base+'/retire-reparateur-on-intervention/'+reparateur_id+'/'+uuid,
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
                            "Felicitation",
                            "Le reparateur a été retiré avec succès",
                            "success"
                            )
                            fetchItem();
                           
                        }
                    })
                } catch (error) {
                    console.log(error);
                }

            
            }
          }); 
      }

      const affect_reparateur_in_intervention=(e)=>{
            e.preventDefault();
            // console.log(selectReparateur,listReparateurTab.length);
            if(selectReparateur !==null && listReparateurTab?.length > 0)
            {
                const _formData = new FormData();
                _formData.append("reparateur_id",selectReparateur);
       
                setLoading(true);
                try {
                    axios.post(url.base+'/affect-reparateur-in-intervention/'+uuid,_formData,
                   {
                       headers:{
                           'Content-Type':'multipart/form-data',
                           "Authorization": `Bearer ${localStorage.getItem('_token_')}`                   
                       },
                       credentials:'include'
                   }
                   ).then((resp)=>{          
                       setLoading(false);
                       if(resp.data.code == 400)
                       {
                           SwalTopEnd({icon:"error", title: resp.data.msg});
                       }else{
                           SwalTopEnd({icon:"success", title: "Opération effectuée avec succès."});    
                           setListReparateurTab([]);
                           setSelectReparateur(null);
                           fetchItem();
                           window.$("#add-edit-modal").modal("hide");
                       }
       
                   }).catch((error)=>{
                       setLoading(false);
                   })
               } catch (error) {
                   console.log(error.response);
               } 
            }else{
                SwalTopEnd({icon:"error", title: "Vous n'avez pas selectionné de reparateur"});
            }

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
    
    return (
        <>
        <ContentSection ulShownav={"interventions"} navactive={"intervention_list"}>
        <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                        <div class="mb-5">
                            <h3 class="mb-0 ">Details de l'intervention</h3>
                        </div>
                        </div>
                    </div>
                    <div>
                        <div class="row">

                        <div class="col-xxl-8 col-lg-7 col-12">
                            <div class="card mb-4" id="list-of-records">
                                <div class="card-header d-lg-flex justify-content-between ">
                                    <div class="d-grid d-lg-block fw-bold">
                                            INFORMATION DU POINT DE VENTE
                                    </div>
        
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive table-card">
                                        <table class="table text-nowrap mb-0 table-centered">
                                            <thead class="table-light">
                                            <tr>
            
                                                <th class="ps-1 sort bg-warning">NOM DU PDV</th>
                                                <th class="sort bg-warning" data-sort='owner'>MANAGER</th>
                                                <th class="sort bg-warning" data-sort='category'>CATEGORIE</th>
                                                <th class="sort bg-warning" data-sort='rating'>CANAL</th>
                                                <th class="sort bg-warning" data-sort='location'>TERRITOIRE</th>
                                                <th class="sort bg-warning">ADRESSE</th>
                                            </tr>
                                            </thead>
                                            <tbody class="list list-of-records-container">
                                            <tr>
                                                
                                                <td class="owner">{intervention.d_pdv} </td>
                                                <td class="owner">{intervention.d_pdv_manager}</td>
                                                <td class="owner">{intervention.d_pdv_categorie} </td>
                                                <td class="category">{intervention.d_canal}</td>
                                                <td class="owner">{intervention.d_territoire} </td>
                                                <td class="location">{intervention.d_addresse}</td>
                                               
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                           
                            </div>

                            <div class="card mb-4" id="list-of-records">

                       
                                    <h5 class="d-grid d-lg-block p-5 fw-bold">REPARATEUR
                                        {can(permissions,'affecter-retire-reparateur-sur-intervention') &&
                                            <>
                                             {intervention.status == 0 | intervention.status == 1 | intervention.status == 2 ?
                                             <button class="btn btn-primary float-end" onClick={()=>add_reparateur_modal()}>+
                                                 Ajouter un reparateur
                                             </button> : ""
                                          }
                                            </>
                                            
                                        
                                         
                                        }
                                   
                                    </h5>
        
                            
                                <div class="card-body">
                                    <div class="table-responsive table-card">
                                        <table class="table text-nowrap mb-0 table-centered">
                                            <thead class="table-light">
                                                <tr>
                                                    <th class="ps-1 sort bg-warning">NOM REPARATEUR</th>
                                                        <th class="sort bg-warning" data-sort='owner'>TELEPHONE</th>
                                                        <th class="sort bg-warning" data-sort='category'>VILLE</th>
                                                        <th class="sort bg-warning" data-sort='location'>TERRITOIRE</th>
                                                        <th class="sort bg-warning">STATUT</th>
                                                        <th class="bg-warning text-center">ACTION</th>
                                                    </tr>
                                            </thead>
                                            <tbody class="list list-of-records-container">
                                                {intervention?.reparateur_first?.map((item,index)=>
                                                    <tr>
                                                        <td class="owner">
                                                            {item.reparateur?.name} 
                                                        </td>
                                                        <td class="owner">
                                                            {item.reparateur?.phone}</td>
                                                        <td class="owner">{item.reparateur?.ville} </td>
                                                        <td class="owner">{item.reparateur?.territoire?.libelle} </td>
                                                        <td class="location">
                                                            {item?.status == 0 && <span class="badge badge-danger-soft text-danger">Inactif</span>}
                                                            {item?.status == 1 && <span class="badge badge-success-soft text-success">Actif</span>}
                                                        </td>
                                                        <td class="owner">
                                                        {can(permissions,'affecter-retire-reparateur-sur-intervention') &&
                                                        <>
                                                            {intervention.status == 0 | intervention.status == 1 | intervention.status == 2 ?
                                                                <>
                                                                {!loading && item?.status == 1 && <button class="btn btn-danger float-end" onClick={()=>retire_reparateur_on_intervention(item.reparateur?.id)}>Retirer</button> }
                                                                {loading &&  <button class="btn btn-danger float-end disabled">Processus en cours</button> }
                                                                </>
                                                                : ""
                                                            }
                                                        </>
                                                            
                                                        }
                                                        </td>
                                                    </tr>
                                                
                                                )}
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                           
                            </div>

                            <div class="card mb-4" id="list-of-records">
                                <div class="card-header d-lg-flex justify-content-between ">
                                    <div class="d-grid d-lg-block fw-bold">                               
                                            INFORMATION DU MATERIEL
                                    </div>
        
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive table-card">
                                        <table class="table text-nowrap mb-0 table-centered">
                                            <thead class="table-light">
                                            <tr>
                                                <th class="ps-1 sort bg-warning">N°SERIE</th>
                                                <th class="sort bg-warning" data-sort='owner'>LIBELLE</th>
                                                <th class="sort bg-warning" data-sort='category'>CATEGORIE</th>
                                                <th class="sort bg-warning" data-sort='location'>MARQUE</th>
                                                <th class="sort bg-warning">MODEL</th>
                                            </tr>
                                            </thead>
                                            <tbody class="list list-of-records-container">
                                                {intervention.materiel &&
                                                        <tr>
                                                    
                                                         <td class="owner">{intervention.materiel?.num_serie} </td>
                                                         <td class="owner">
                                                            {intervention?.materiel?.materiel?.image &&<img src={`${url.image}/${intervention?.materiel?.qrcode_path}`} width={60} height={60}/> } 
                                                            <b className="mx-2">{intervention.materiel?.materiel?.libelle} </b>
                                                            </td>
                                                         <td class="owner">{intervention.materiel?.materiel?.categorie?.libelle} </td>
                                                         <td class="owner">{intervention.materiel?.materiel?.marque?.libelle} </td>
                                                         <td class="owner">{intervention.materiel?.materiel?.modele?.libelle} </td>
                                                     </tr>
                                                }
                                                    
                                               
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                           
                            </div>

                             <div class="card mb-4" id="list-of-records">
                                <div class="card-header d-lg-flex justify-content-between ">
                                    <div class="d-grid d-lg-block">
                                        <a href="#!" class="btn fw-bold" >
                                            FACTURES & DEVIS
                                        </a>
                                    </div>
        
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive table-card">
                                    <DataTable 
                                        columns={columns} 
                                        data={factures} 
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
                                        } />
                                    </div>
                                </div>
                           
                            </div> 
                        </div>

                   

                        <div class="col-xxl-4 col-lg-5">
                            <div class="card">
                            <div class="card-body border-bottom">
                                <div class="d-flex justify-content-between ">
                                <div>
                                    
                                    <div class="mt-3">
                                    <h3 class="mb-0 fs-4" id="view-detail-company-name">CODE</h3>
                                    <small id="view-detail-owner">{intervention.code}</small>
                                    </div>
                                </div>
                                
                                </div>
                            
                            </div>
                            <div class="card-body ">            
                                <div class="mt-4">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span className="fw-bold">
                                        Date de creation :</span><span id="view-detail-email-id">
                                        {moment(intervention.created_at).format("Do MMMM YYYY")}
                                        </span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span className="fw-bold">
                                        STATUT :</span><span id="view-detail-email-id">
                                        {intervention.status == 1 && (
                                            <span className="badge bg-warning">En attente de devis</span>
                                        )}
                                        {intervention.status == 0 && (
                                        <span className="badge bg-danger">Inactif</span>
                                        )}
                                        {intervention.status == 2 && (
                                        <span className="badge bg-warning">En attente de facture</span>
                                        )}
                                        {intervention.status == 3 && (
                                        <span className="badge bg-danger">Echec du traitement</span>
                                        )}

                                        {intervention.status == 4 && (
                                        <span className="badge bg-success">Terminé</span>
                                        )}
                                        </span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span className="fw-bold">
                                        Créer par :</span><span id="view-detail-email-id">
                                       {intervention.addby?.use_nom} {intervention.addby?.use_prenom}
                                        </span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span className="fw-bold">
                                        Type d'intervention :</span><span id="view-detail-email-id">
                                       {intervention.type_intervention?.libelle}
                                        </span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                        <span className="text-center fw-bold">
                                        Information du matériel defectueux
                                        </span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center ps-0">
                                                {intervention.note_commercial}
                                                
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                            <img src={`${url.image}/${intervention?.photo_materiel}`} width={300} height={200}/>
                                    </li>
                                
                                </ul>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="add-edit-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <form class="modal-content" onSubmit={affect_reparateur_in_intervention}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalScrollableTitle">Affecter un nouveau reparateur</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                    
                                <div class="modal-body">
                 
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Selectionner un reparateur </label>
                                    <Select options={optionsreparateurs} onChange={handleChangeListReparateur} isDisabled={listReparateurTab.length > 0 ? true : false}/>                                
                                </div>

                                <div class="row">
                                        <div class="col-12">
                                            <div class="table-responsive ">
                                                <table class="table table-centered text-nowrap">
                                                    <thead class="table-info ">
                                                        <tr>

                                                        <th scope="col">NOM REPARATEUR</th>
                                                        <th scope="col">TELEPHONE</th>
                                                        <th scope="col">VILLE</th>
                                                        <th scope="col" className="text-center">TERRITOIRE</th>
                                                        <th scope="col">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                           
                                                    
                                                    {listReparateurTab && 
                                                            listReparateurTab.map((item,index)=>
                                                            <tr key={index}>                                                               
                                                                <td>{item.name}</td>
                                                                <td>
                                                                {item.phone}
                                                                </td>
                                                                <td>
                                                                {item.ville}
                                                                </td>
                                                                <td>
                                                                {item.territoire}
                                                                </td>
                                                                <td className="text-center">
                                                                    <button type="button" className="btn btn-danger btn-sm " onClick={()=>removeItem(index)}> <i className="fa fa-trash"></i> </button>
                                                                </td>
                                                            </tr>
                                                            )
                                                        }
                                
                                                    </tbody>
                                                    </table>
                                            </div>
                                        
                                        </div>
                                    </div>
                                
                                </div>
                            
                        
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            {!loading && <button type="submit"  class="btn btn-primary ">Valider l'affectation</button> }
                            {loading && <button type="button" class="btn btn-primary disabled">En Chargement...</button> }
                        </div>
                    </form>
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
                                        <td><b>{moment(item?.date_acquisition).format("Do MMMM YYYY")}</b></td>
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
                                
                                </div>
                            
                            </div>
            </div>
            </div>
        </ContentSection>
            
        </>
    )
}

export default ViewInterventionPage;