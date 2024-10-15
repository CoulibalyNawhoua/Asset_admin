import axios from "axios";
import ContentSection from "../../../Content";
import Swal from "sweetalert2";
import CustomerStyle from "../../../../utils/customerStyle";
import BaseUrl from "../../../../utils/BaseUrl";
import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import SwalTopEnd from "../../../../utils/swal_top_end";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../utils/User_check";
import can from "../../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function ContratEnCoursPage()
{
    const [errors,setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [item,setItem] = useState([]);
    const [rompreData,setRompreData] = useState('');

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
      
        // {
        //   name: 'MANAGER',
        //   selector: row => row.d_pdv_manager,
        //   sortable: true,
        // },

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
                    <button className="btn btn-danger btn-sm" onClick={()=>open_modal_rompre(row)}>ROMPRE</button>
                </>
            )
          },

    ];

    useEffect(()=>{
    if(!can(permissions,'contrat-list')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    const conditionalRowStyles = [
        {
          when: row => moment(row.contrat_date_fin).isBefore(moment()), // La condition pour colorer la ligne
          style: {
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: 'red',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
    ];
    
    useEffect(()=>{
        fetchItemsList();
    },[]);



    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/contrat-en-list',{
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


    const submitForm= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('motif_rupture_contrat',rompreData);

        setLoading(true);
        try {
            axios.post(url.base+'/contrat-rupture/'+item.id,_formData,
            {
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
                // credentials:'include'
            }
            ).then((resp)=>{
                setLoading(false);
                if(resp.status == 200){
                    // console.log(resp.data);
                    setErrors({});
                    SwalTopEnd({icon: "success", title:"Le contrat a été rompu avec succès."});
                    setRompreData("");
                    fetchItemsList();
                    window.$("#exampleModalCenter").modal('hide');
                }else{
                    SwalTopEnd({icon: "error", title:"Un problème est subvenu"});
                }
            }).catch((error)=>{                
                setLoading(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoading(false);

        }
    }

    const deleteItem = async (id) => {
     
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
                    axios.get(url.base+'/setting/territoire-delete/?ter_id='+id,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`                                
                            },
                        }
                    ).then((resp)=>{
                        // console.log(resp.data);
                        if(resp.status == 200)
                        {
                            if(resp.data.status == 600)
                            {
                                Swal.fire(
                                    'Attention',
                                    resp.data.message,
                                    'error'
                                  )
                            }else{
                                Swal.fire(
                                    'Supprimé',
                                    resp.data.message,
                                    'success'
                                  )
                            }
                           
                        }
                        fetchItemsList();
                    })
                } catch (error) {
                    console.log(error);
                }

            
            }
          }); 
    }
    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.code.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }

    const open_modal_rompre=(item)=>{
        setItem(item);
        window.$("#exampleModalCenter").modal('show');
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
            <ContentSection ulShownav={"gest-contrat"} navactive={"contrat_list"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des contrats en cours</h3>

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
                                            conditionalRowStyles={conditionalRowStyles}
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

                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <form class="modal-content" onSubmit={submitForm}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Motif</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Pourquoi voulez-vous rompre le contrat ?</label>
                                <select className="form-control" onChange={(e)=>setRompreData(e.target.value)}>
                                    <option value="" selected>---</option>
                                    <option value="Fin du contrat">Fin du contrat</option>
                                    <option value="Depassement de la date">Depassement date fin de contrat</option>
                                    <option value="Declassement du matériel">Declassement du matériel</option>
                                    {/* <option value="PDV non conforme">PDV non conforme</option> */}
                                </select>
                            </div>                   
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            <button type="submit" class={loading ? "btn btn-primary disabled" : "btn btn-primary"}>Valider</button>
                        </div>
                    </form>
                </div>
            </div>
            </ContentSection>
        </>
    )
}

export default ContratEnCoursPage;