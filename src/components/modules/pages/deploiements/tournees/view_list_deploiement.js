import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import ContentSection from "../../../Content";
import BaseUrl from "../../../../utils/BaseUrl";
import { UserContext } from "../../../../utils/User_check";
import can from "../../../../utils/Can";


const url = BaseUrl();

function VewListDeploiement()
{
    const {uuid} = useParams();
    const [transfertItem,setTransfertItem] = useState([]);
    const [detailItems,setDetailItems] = useState([]);
    const [detailTransfertId,setDetailTransfertId] = useState('');
    const [loading,setLoading] = useState(false);
    const [motif_annulation,setMotifAnnulation] = useState('');
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(()=>{
        getTransfertItem();
        getDetailTransfertItems();
    },[]);

    useEffect(()=>{
        if(!can(permissions,'detail-tournee')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);
    
    const getTransfertItem=()=>{
        try {
            axios.get(url.base+'/materiel-deploiement-tournee-view/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                setTransfertItem(resp.data.data);
                // setLoading(false);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const getDetailTransfertItems=()=>{
        try {
            axios.get(url.base+'/detail-deploiement-tournee-list/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                setDetailItems(resp.data.data);
                // setLoading(false);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const ValidateOnMateriel = async (id,motif) => {
     
        Swal.fire({
            title: 'REPROGRAMMER LA DEMANDE?',
            text: 'Motif du rejet : '+motif,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText:"NON",
            confirmButtonText: 'OUI',
            cancelButtonColor:"red"
          }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.get(url.base+'/validate-deploiement-item/'+id,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                                
                            },
                        }
                    ).then((resp)=>{
                        
                          Swal.fire(
                              'Validation',
                              'Le deploiement a été effectué avec succès.',
                              'success'
                            )
                           
                            getDetailTransfertItems();
                            getTransfertItem();
                    })
                } catch (error) {
                    console.log(error);
                }
  
            
            }
          }); 
    }

    const RefusedDepmoiementOnMateriel = async (id,motif) => {
     
        Swal.fire({
            title: 'REJETER DEFINITIVEMENT',
            text: 'Motif du rejet: '+motif,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText:"NON",
            confirmButtonText: 'OUI',
            cancelButtonColor:"red"
          }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.get(url.base+'/refused-deploiement-item/'+id,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                                
                            },
                        }
                    ).then((resp)=>{
                        
                          Swal.fire(
                              'Validation',
                              'Le deploiement a été annulé avec succès.',
                              'success'
                            )
                           
                            getDetailTransfertItems();
                            getTransfertItem();
                    })
                } catch (error) {
                    console.log(error);
                }
  
            
            }
          }); 
    }

    const openAnnuleModal=(id)=>{
        setDetailTransfertId(id);
        window.$(`#exampleModal`).modal('show');

    }

    const submitFormAnnulation=(e)=>{
        e.preventDefault();
        
        if(motif_annulation !=""){
          const _formData = new FormData();
          _formData.append('note',motif_annulation);
          setLoading(true);
  
          try {
            axios.post(`${url.base}/detail-transfert-materiels-annule/${detailTransfertId}`,_formData,
           {
               headers:{
                   'Content-Type':'multipart/form-data',
                   "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                   
               },
              //  credentials:'include'
           }
           ).then((resp)=>{          
               setLoading(false);
               
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title:  "Le transfert a été annulé avec succès !",
                    showConfirmButton: false,
                    timer: 5000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                  });
  
                  window.$('#exampleModal').modal('hide');
                  getDetailTransfertItems();
                  getTransfertItem();
                  setDetailTransfertId('');
                  setMotifAnnulation('');
            //    fetchRibList();
             
           })
       } catch (error) {
           console.log(error.response);
       } 
  
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title:  'Le motif est obligatoire',
            showConfirmButton: false,
            timer: 3000,
            toast:true,
            position:'top-right',
            timerProgressBar:true
          });
        }
      }

    const openModalValidateTransfert=()=>{
    window.$('#exampleModal2').modal('show');
    }

    const ValidateMateriel = async () => {
     
        Swal.fire({
            title: 'ATTENTION !',
            text: 'Êtes-vous sûre de vouloir valider et terminer le transfert.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText:"NON",
            confirmButtonText: 'OUI',
            cancelButtonColor:"red"
          }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.get(url.base+'/transfert-materiels-validate/'+transfertItem.id,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                                
                            },
                        }
                    ).then((resp)=>{
                        
                          Swal.fire(
                              'Validation',
                              'Le transfert a été effectué avec succès',
                              'success'
                            )
                           
                            getDetailTransfertItems();
                            getTransfertItem();
                    })
                } catch (error) {
                    console.log(error);
                }
  
            
            }
          }); 
    }

    const submitForm=(e)=>{
        e.preventDefault();
        
        if(motif_annulation !=""){
          const _formData = new FormData();
          _formData.append('note',motif_annulation);
          setLoading(true);
  
          try {
            axios.post(`${url.base}/transfert-materiels-annule/${transfertItem.id}`,_formData,
           {
               headers:{
                   'Content-Type':'multipart/form-data',
                   "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                   
               },
              //  credentials:'include'
           }
           ).then((resp)=>{          
               setLoading(false);
               
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title:  "Le transfert a été annulé avec succès !",
                    showConfirmButton: false,
                    timer: 5000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                  });
  
                  window.$('#exampleModal2').modal('hide');
                  getDetailTransfertItems();
                  getTransfertItem();
                  setDetailTransfertId('');
                  setMotifAnnulation('');
            //    fetchRibList();
             
           })
       } catch (error) {
           console.log(error.response);
       } 
  
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title:  'Le motif est obligatoire',
            showConfirmButton: false,
            timer: 3000,
            toast:true,
            position:'top-right',
            timerProgressBar:true
          });
        }
    }


    return (
        <>
            <ContentSection ulShownav={"tournees"} navactive={"tournee_list"}>
            <div class="container-fluid">
            <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
              <div class="mb-5">
                <h3 class="mb-0 ">Detail de la tournée</h3>

              </div>
            </div>
          </div>
                  <div class="row">
                        <div class="offset-xxl-12 col-xxl-12 col-md-12 col-12">
                          <div class="card" id="invoice">
                              <div class="card-body">
                                  <div class="row justify-content-between mb-md-10">
                                      <div class="col-lg-3 col-md-6 col-12">
                                  {/* <a href="#" >
                                      <img src="#" alt="" class="text-inverse" />
                                  </a> */}
                                  <div class="mt-0">
                                      <span class="fw-bold mb-2">Code : {transfertItem.code}</span><br/>
                                      <span class="fw-bold mb-2">Date clôture : {transfertItem.date_cloture ? moment(transfertItem.date_cloture).format('Do MMMM YYYY'): ""}</span><br/>
                                      <span class="fw-bold mb-2">Livreur : {transfertItem.livreur?.use_nom} {transfertItem.livreur?.use_prenom}</span><br/>
                                      <span class="fw-bold mb-2">Vehicule utilisé : {transfertItem.vehicule?.libelle}</span><br/>
                                      <span class="fw-bold">Statut :        {transfertItem.status == 1 && <span class="badge bg-success">Terminé</span>}
                                                                            {transfertItem.status == 2 && <span class="badge bg-danger">Annulé</span>}
                                                                            {transfertItem.status == 0 && <span class="badge bg-warning">En cours</span>}</span><br/>
                                    
                                  </div>
                                      </div>
                                      <div class="col-lg-3 col-md-6 col-12 d-flex justify-content-md-end mt-4 mt-md-0">
                                          <ul class="list-unstyled">
                                          
                                              <li class="mb-1">
                                                  <span class="ms-2 text-dark fw-bold">Date de deploiement :</span>
                                                  <span class="ms-2 text-dark fw-bold"> {transfertItem.date ? moment(transfertItem.date).format('Do MMMM YYYY'): ""}</span>

                                              </li>
                                             
                                          </ul>


                                              </div>
                                  </div>
                                  
                                  <div class="row">
                                      <div class="col-12">
                                          <div class="table-responsive ">
                                              <table class="table table-centered text-nowrap table-striped">
                                                  <thead class="table-light ">
                                                    <tr>

                                                    <th className="text-center bg-warning">N° ORDRE</th>
                                                    <th className="text-center bg-warning">CODE</th>
                                                    <th className="text-center bg-warning">TERRITOIRE PDV</th>
                                                    <th className="text-center bg-warning">PDV</th>
                                                    <th className="bg-warning">MATERIEL</th>
                                                    <th className=" bg-warning">REPROGRAMMER OU ANNULER</th>                                       
                                                    <th className=" bg-warning">STATUT</th>                                       
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {detailItems?.map((item,index)=>
                                                     <tr key={index}>
                                                     <td className="text-center fw-bold">{item.ordre_deploiement}</td>
                                                     <td className="text-center">{item.affectation.code}</td>
                                                     <td>{`${item.affectation.d_territoire}`}</td>     
                                                     <td>{`${item.affectation.d_pdv}-${item.affectation.d_contact}-${item.affectation.d_addresse}`}</td>     
                                                     <td>
                                                       {`${item.affectation?.materiel?.materiel?.libelle}-${item.affectation?.categorie?.libelle}-${item.affectation?.materiel?.materiel?.marque?.libelle}-${item.affectation?.materiel?.materiel?.modele?.libelle}`}                              
                                                     </td>
                   
                                                                      
                                                     {/* <td>{item.date_validation !== null ? moment(item.date_validation).format("Do MMMM YYYY HH:mm") : ""}</td>                        */}
                                                     <td className="text-center">
                                                     {item.status == 3 && 
                                                         <>
                                                            <button className="btn btn-success btn-sm mx-1" onClick={()=>ValidateOnMateriel(item.id,item?.motif?.libelle)} title="REPROGRAMMER"><i class="fa-solid fa-check"></i></button>
                                                            <button className="btn btn-danger btn-sm mx-1" onClick={()=>RefusedDepmoiementOnMateriel(item.id,item?.motif?.libelle)} title="ANNULER"><i class="fa-solid fa-xmark"></i></button> 
                                                        </>
                                                    }
                                                        </td> 
                                                    <td >
                               
                                                        {item.status == 0 && <span class="badge bg-warning">En cours</span>}
                                                        {item.status == 1 && <span class="badge bg-success">Terminé</span>}
                                                        {item.status == 2 && <span class="badge bg-danger">Annulé</span>}
                                                        {item.status == 3 && <span class="badge bg-danger">Rejeté par le livreur</span>}
                                                        {item.status == 4 && <span class="badge bg-danger">Reprogrammé</span>}
                          

                                                     </td>
                                                                         
                                             
                                                 </tr>
                                                        // <tr>

                                                        //     <td>
                                                        //         <div class="d-flex align-items-center">
                                                        //             <a href="#!"><img src={`${url.image}/${detail.materiel?.image}`} alt=""
                                                        //                 class="img-4by3-md rounded-3" /></a>
                                                        //             <div class="ms-3">
                                                        //                 <h5 class="mb-0">{detail.materiel?.libelle}</h5>                                      
                                                        //             </div>
                                                        //         </div>
                                                        //     </td>
                                                        //     <td><b className="text-danger">{detail.depot_origine?.name}</b></td>
                                                        //     <td><b className="text-success">{detail.depot_final?.name}</b></td>
                                                        //     <td>
                                                        //         <div className="overflow-scroll mt-5 pb-5 " style={{"max-width": "200px", "max-height": "100px"}}>
                                                        //            {detail.note}
                                                        //         </div>
                                                        //     </td>
                                                        //     <td>
                                                        //         {detail.status == 1 || detail.status == 2 ?
                                                        //             <>
                                                        //                     {detail.status == 1 && <span class="badge bg-success">VALIDER</span>}
                                                        //                     {detail.status == 2 && <span class="badge bg-danger">ANNULE</span>}
                                                        //             </> : 
                                                        //             <>
                                                        //                 <button className="btn btn-success btn-sm mx-1" onClick={()=>ValidateOnMateriel(detail.id)}><i class="fa-solid fa-check"></i></button>
                                                        //                 <button className="btn btn-danger btn-sm mx-1" onClick={()=>openAnnuleModal(detail.id)}><i class="fa-solid fa-xmark"></i></button> 
                                                        //             </>
                                                                
                                                        //         }
                                                        
                                                        //     </td>
                                                        // </tr>
                                                    )}
                                                    
                            
                                                  </tbody>
                                                </table>
                                          </div>
                                          <div class="border-top pt-8">
                                            {transfertItem.status == 2 &&
                                                <div>
                                                    <h5 class="mb-1">Notes : </h5>
                                                    <p class="mb-0">{transfertItem.note}</p>
                                                </div>
                                            }
                                              
                                              <div class="mt-6">
                                                <Link to="/tournee-deploiements-list" class="btn btn-primary print-link no-print">Retour</Link>
                                                {/* {transfertItem.status == 0 && 
                                                    <>
                                                        <button class="btn btn-success ms-2" onClick={()=>ValidateMateriel()}>Terminer le transfert</button>
                                                        <button class="btn btn-danger ms-2" onClick={()=>openModalValidateTransfert()}>Annuler le transfert</button>
                                                    </>
                                                } */}
                                              
                                            </div>
                                          </div>
                                      </div>
                                  </div>



                                </div>
                          </div>


                        </div>
                  </div>
                  <div>

                  </div>
            </div>
            <div class="modal fade" id={`exampleModal`} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-info-soft ">
                            <h5 class="modal-title" id="exampleModalLabel">Annuler le transfert</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitFormAnnulation}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Motif d'annulation</label>
                                <input type="text" id="textInput" class="form-control" onChange={(e)=>setMotifAnnulation(e.target.value)} />
                               
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

            <div class="modal fade" id={`exampleModal2`} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-info-soft ">
                            <h5 class="modal-title" id="exampleModalLabel">Annuler le transfert</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                {/* <span aria-hidden="true">&times;</span> */}
                            </button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div class="modal-body">
                            
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Motif d'annulation</label>
                                <input type="text" id="textInput" class="form-control" onChange={(e)=>setMotifAnnulation(e.target.value)} />
                               
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
            </ContentSection>
        </>
    )
}

export default VewListDeploiement;