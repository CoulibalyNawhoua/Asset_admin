import { Link, useNavigate, useParams } from "react-router-dom";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import separateNumber from "../../../utils/separateur";
import Swal from "sweetalert2";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
function DetailViewMateriel(){
  const navigate = useNavigate();

    const {uuid} = useParams();
    const [materiel,setMateriel] = useState([]);
    const [loading,setLoading] = useState(false);
    const [motif_declassement,setMotifDeclassement] = useState('');
    const {user,permissions} = useContext(UserContext);
        useEffect(()=>{
        if(!can(permissions,'detail-article')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);

    useEffect(()=>{
        materiel_list();
    },[])

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

    const openDeclassementModal=()=>{
      window.$('#exampleModal-2').modal('show')
    }

    const submitForm=(e)=>{
      e.preventDefault();
      
      if(motif_declassement !=""){
        const _formData = new FormData();
        _formData.append('motif_declassement',motif_declassement);
        setLoading(true);

        try {
          axios.post(`${url.base}/materiels-declassement/${materiel.code}`,_formData,
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
                  title:  "Le matériel a été declassé avec succès !",
                  showConfirmButton: false,
                  timer: 5000,
                  toast:true,
                  position:'top-right',
                  timerProgressBar:true
                });

                window.$('#exampleModal-2').modal('hide');
                setMotifDeclassement('');
            materiel_list();
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

    const deleteMateriel = async () => {
     
      Swal.fire({
          title: 'ATTENTION !',
          text: 'Êtes-vous sûre de vouloir supprimer cet élément.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonText:"NON",
          confirmButtonText: 'OUI',
          cancelButtonColor:"red"
        }).then((result) => {
          if (result.isConfirmed) {
              try {
                  axios.get(url.base+'/materiels-delete/'+materiel.code,
                      {
                          headers:{
                              'Content-Type':'application/json',
                              "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                              
                          },
                      }
                  ).then((resp)=>{
                      
                        Swal.fire(
                            'Supprimé',
                            'Suppression effectué avec succès',
                            'success'
                          )
                         
                          navigate('/materiels/list');
                  })
              } catch (error) {
                  console.log(error);
              }

          
          }
        }); 
  }

    return (
        <>
               <ContentSection ulShownav={"managements"} navactive={"gest-materiel"}>
               <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
              <div class="mb-5">
                <h3 class="mb-0 text-primary"><i class="fa-regular fa-folder-open"></i> {materiel.libelle}</h3>
              </div>
            </div>
          </div>
          <div>
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body p-5">
                    <div class="row">
                      <div class="col-xl-6">
                        <div class="product" id="product">
                          <div>
                            <div>
                              <img src={`${url.image}/${materiel.image}`} alt="" class="img-fluid" className="cover" width={500}/>
                            </div>

                          </div>
                          {/* <div>
                            <div>
                              <img src="../assets/images/ecommerce/product-2.jpg" alt="" class="img-fluid" />
                            </div>

                          </div>
                          <div>
                            <div>
                              <img src="../assets/images/ecommerce/product-3.jpg" alt="Image" class="img-fluid" />
                            </div>

                          </div>
                          <div>
                            <div>
                              <img src="../assets/images/ecommerce/product-4.jpg" alt="Image" class="img-fluid" />
                            </div>

                          </div> */}

                        </div>
                        {/* <div class="product-tools">
                          <div class="thumbnails row g-3" id="product-thumbnails">
                            <div class="col-3">
                              <div class="thumbnails-img">
                                <img src="../assets/images/ecommerce/product-1.jpg" alt="Image" />
                              </div>
                            </div>
                            <div class="col-3">
                              <div class="thumbnails-img">
                                <img src="../assets/images/ecommerce/product-2.jpg" alt="Image" />
                              </div>
                            </div>
                            <div class="col-3">
                              <div class="thumbnails-img">
                                <img src="../assets/images/ecommerce/product-3.jpg" alt="Image" />
                              </div>
                            </div>
                            <div class="col-3">
                              <div class="thumbnails-img">
                                <img src="../assets/images/ecommerce/product-4.jpg" alt="Image" />
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <div class="col-xl-6 col-12">
                        <div class="my-5 mx-xl-10">
                          <div>
                            <h1>{materiel.libelle}</h1>
                            {/* <div>
                                    {materiel.status == 0 &&  <><span>Statut actuel :</span> <span class="badge badge-warning-soft text-warning">disponible</span></>}
                                    {materiel.status == 1 && <><span>Statut actuel :</span>  <span class="badge badge-danger-soft text-danger">en attent d'affectation</span></>}
                                    {materiel.status == 2 && <><span>Statut actuel :</span>  <span class="badge badge-success-soft text-success">Deployé</span></>}
                                    {materiel.status == 3 && <><span>Statut actuel :</span>  <span class="badge badge-danger-soft text-danger">Déclassé</span></>}
                            </div> */}
                          </div>
                          <hr class="my-3" />
                          <div class="mb-5">
                            <h4 class="mb-1 text-danger">{separateNumber(materiel.prix_achat) } FCFA</h4>
                            <span>Prix d'achat du matériel</span>

                            {/* <div className="mt-2">
                              <img src={`${url.image}/${materiel?.qrcode_path}`} alt="qrcode" width="30%" height="20%" />
                            </div> */}
                          </div>
                         
                          <div class="row">
                           
                           
                            <div class="col-md-4">
                              <div class="d-grid">
                                <Link to={`/update-materiel/${uuid}`} class="btn btn-primary"><i
                                    class="fe fe-heart me-2"></i>Modifier</Link>
                              </div>
                            </div>
                            {/* {materiel.status == 0 &&
                          <>
                           <div class="col-md-4">
                           <div class="d-grid">
                             <button class="btn btn-outline-warning" onClick={()=>openDeclassementModal()}><i class="fe fe-heart me-2"></i>Declasser</button>
                           </div>
                         </div>
                          <div class="col-md-4">
                          
                              <div class="d-grid mb-2 mb-md-0">
                                <button class="btn btn-outline-danger" onClick={()=>deleteMateriel()}>Supprimer</button>
                              </div>
                            </div>
                            </>} */}
                          </div>
                      
                          <hr class="mt-4 mb-2" />
                          <div class=" mb-4" id="ecommerceAccordion">

                            <ul class="list-group list-group-flush">


                              <li class="list-group-item px-0">
                                <a class="d-flex align-items-center text-inherit text-decoration-none h4 mb-0"
                                  data-bs-toggle="collapse" href="#specifications" role="button" aria-expanded="true"
                                  aria-controls="specifications">
                                  <div class="me-auto">
                                    Caratéristique du matériel
                                  </div>
                                  <span class="chevron-arrow  ms-4">
                                    <i data-feather="chevron-down" class="icon-xs"></i>
                                  </span>
                                </a>
                              
                                <div class="collapse show" id="specifications" data-bs-parent="#ecommerceAccordion">
                                  <div class="py-3 ">
                                    <table class="table table-striped">
                                      <tbody>
                                        <tr>

                                          <th class="w-20">Code</th>
                                          <td>{materiel.code}</td>

                                        </tr>
                                        {/* <tr>

                                          <th class="w-20">Dsate d'acquisition</th>
                                          <td>{moment(materiel.date_acquisition).format('Do MMMM yy')}</td>

                                        </tr> */}
                                        {/* <tr>

                                          <th class="w-20">N° serie</th>
                                          <td>{materiel.num_serie} </td>

                                        </tr> */}
                                        <tr>

                                          <th class="w-20">Catégorie</th>
                                          <td>{materiel.categorie?.libelle} </td>

                                        </tr>
                                        <tr>

                                          <th class="w-20">Marque</th>
                                          <td>{materiel.marque?.libelle} </td>

                                        </tr>
                                        <tr>

                                          <th class="w-20">Modele</th>
                                          <td>{materiel.modele?.libelle}</td>

                                        </tr>

                                        {/* <tr>

                                          <th class="w-20">Depot Actuel</th>
                                          <td>{materiel.depot?.name} </td>

                                        </tr> */}

                                        <tr>

                                          <th class="w-20">Fournisseur</th>
                                          <td>{materiel.fournisseur?.name} </td>

                                        </tr>

                                      </tbody>
                                    </table>


                                  </div>
                                </div>
                              </li>
                              <li class="list-group-item px-0">
                                <a class="d-flex align-items-center text-inherit text-decoration-none h4 mb-0"
                                  data-bs-toggle="collapse" href="#freeShippingPolicy" role="button"
                                  aria-expanded="false" aria-controls="freeShippingPolicy">
                                  <div class="me-auto">
                                    Description
                                  </div>
                                  <span class="chevron-arrow  ms-4">
                                    <i data-feather="chevron-down" class="icon-xs"></i>
                                  </span>
                                </a>
                                
                                <div class="collapse show" id="freeShippingPolicy" data-bs-parent="#ecommerceAccordion">
                                  <div class="py-3 ">
                                    <p class="mb-0">{materiel.description !== "null" ? materiel.description :""}</p>

                                  </div>
                                </div>
                              </li>
                              {/* {materiel.status == 3 &&
                              <li class="list-group-item px-0 border-bottom">
                                <a class="d-flex align-items-center text-inherit text-decoration-none h4 mb-0"
                                  data-bs-toggle="collapse" href="#refundPolicy" role="button" aria-expanded="false"
                                  aria-controls="refundPolicy">
                                  <div class="me-auto">
                                   Motif declassement
                                  </div>
                                  <span class="chevron-arrow  ms-4">
                                    <i data-feather="chevron-down" class="icon-xs"></i>
                                  </span>
                                </a>
                                
                                <div class="collapse " id="refundPolicy" data-bs-parent="#ecommerceAccordion">
                                  <div class="py-3 ">
                                    <p class="mb-0">{materiel.motif_declassement}</p>

                                  </div>
                                </div>
                              </li>} */}
                            </ul>
                          </div>
                          {/* <div class="mb-4">
                            <h3 class="mb-4">Ratings & Reviews</h3>
                            <div class="row align-items-center mb-4">
                              <div class="col-md-4 mb-4 mb-md-0">
                                <h3 class="display-2 ">4.5</h3>
                                <i class="bi bi-star-fill text-success"></i>
                                <i class="bi bi-star-fill text-success"></i>
                                <i class="bi bi-star-fill text-success"></i>
                                <i class="bi bi-star-fill text-success"></i>
                                <i class="bi bi-star-fill text-success"></i>
                                <p class="mb-0">595 Verified Buyers</p>
                              </div>
                              <div class="offset-lg-1 col-lg-7 col-md-8">
                                <div class="d-flex align-items-center mb-2">
                                  <div class="text-nowrap me-3 text-muted"><span
                                      class="d-inline-block align-middle text-muted">5</span><i
                                      class="bi bi-star-fill ms-1 fs-6"></i></div>
                                  <div class="w-100">
                                    <div class="progress" style={{"height": "6px"}}>
                                      <div class="progress-bar bg-success" role="progressbar" style={{"width": "60%"}}
                                        aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                  </div><span class="text-muted ms-3">420</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                  <div class="text-nowrap me-3 text-muted"><span
                                      class="d-inline-block align-middle text-muted">4</span><i
                                      class="bi bi-star-fill ms-1 fs-6"></i></div>
                                  <div class="w-100">
                                    <div class="progress" style={{"height": "6px"}}>
                                      <div class="progress-bar bg-success" role="progressbar" style={{"width": "50%"}}
                                        aria-valuenow="50" aria-valuemin="0" aria-valuemax="50"></div>
                                    </div>
                                  </div><span class="text-muted ms-3">90</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                  <div class="text-nowrap me-3 text-muted"><span
                                      class="d-inline-block align-middle text-muted">3</span><i
                                      class="bi bi-star-fill ms-1 fs-6"></i></div>
                                  <div class="w-100">
                                    <div class="progress" style={{"height": "6px"}}>
                                      <div class="progress-bar bg-success" role="progressbar" style={{"width": "35%"}}
                                        aria-valuenow="35" aria-valuemin="0" aria-valuemax="35"></div>
                                    </div>
                                  </div><span class="text-muted ms-3">33</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                  <div class="text-nowrap me-3 text-muted"><span
                                      class="d-inline-block align-middle text-muted">2</span><i
                                      class="bi bi-star-fill ms-1 fs-6"></i></div>
                                  <div class="w-100">
                                    <div class="progress" style={{"height": "6px"}}>
                                      <div class="progress-bar bg-warning" role="progressbar" style={{"width": "22%"}}
                                        aria-valuenow="22" aria-valuemin="0" aria-valuemax="22"></div>
                                    </div>
                                  </div><span class="text-muted ms-3">12</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                  <div class="text-nowrap me-3 text-muted"><span
                                      class="d-inline-block align-middle text-muted">1</span><i
                                      class="bi bi-star-fill ms-1 fs-6"></i></div>
                                  <div class="w-100">
                                    <div class="progress" style={{"height": "6px"}}>
                                      <div class="progress-bar bg-danger" role="progressbar" style={{"width": "14%"}}
                                        aria-valuenow="14" aria-valuemin="0" aria-valuemax="14"></div>
                                    </div>
                                  </div><span class="text-muted ms-3">40</span>
                                </div>

                              </div>
                            </div>
                            <div>
                              <div class="border-top py-4 mt-4">
                                <div class="border d-inline-block px-2 py-1 rounded-pill mb-3">
                                  <span class="text-dark  ">4.4 <i class="bi bi-star-fill text-success fs-6"></i></span>
                                </div>
                                <p>It's awesome , I never thought about Dash UI that awesome shoes.very pretty.</p>
                                <div>
                                  <span>James Ennis</span>
                                  <span class="ms-4">28 Nov 2023</span>
                                </div>
                              </div>
                              <div class="border-top py-4">
                                <div class="border d-inline-block px-2 py-1 rounded-pill mb-3">
                                  <span class="text-dark  ">5.0 <i class="bi bi-star-fill text-success fs-6"></i></span>
                                </div>
                                <p>Quality is more than good that I was expected for buying. I first time
                                  purchase Dash UI shoes & this brand is good. Thanks to Dash UI delivery
                                  was faster than fast ...Love Dash UI</p>
                                <div>
                                  <span>Bradley Mouton</span>
                                  <span class="ms-4">21 Apr 2023
                                  </span>
                                </div>
                              </div>
                              <div class="border-top py-4 border-bottom">

                                <div class="border d-inline-block px-2 py-1 rounded-pill mb-3">
                                  <span class="text-dark  ">4.4 <i class="bi bi-star-fill text-success fs-6"></i></span>
                                </div>
                                <p>Excellent shoes with original logo , Thanks Dash UI , Buy these shoes
                                  without any tension</p>
                                <div class="mb-5">
                                  <img src="../assets/images/ecommerce/product-1.jpg" alt="Image"
                                    class="avatar-md rounded-2" />
                                  <img src="../assets/images/ecommerce/product-2.jpg" alt="Image"
                                    class="avatar-md rounded-2" />
                                  <img src="../assets/images/ecommerce/product-3.jpg" alt="Image"
                                    class="avatar-md rounded-2" />
                                </div>
                                <div>
                                  <span>Kieth J. Watson </span>
                                  <span class="ms-4">21 May 2023</span>
                                </div>
                              </div>
                              <div class="my-3">
                                <a href="#!" class="btn-link fw-semi-bold ">View all 89 reviews</a>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
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
                                <input type="text" id="textInput" class="form-control" onChange={(e)=>setMotifDeclassement(e.target.value)} />
                               
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

export default DetailViewMateriel;