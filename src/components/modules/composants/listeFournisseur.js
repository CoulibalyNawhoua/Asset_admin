import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../utils/BaseUrl";
import CustomerStyle from "../../utils/customerStyle";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/User_check";
import can from "../../utils/Can";


const url = BaseUrl();
const customerStyle = CustomerStyle();
function ListeFournisseur()
{

    const [errors,setErrors] = useState({});
    const navigate = useNavigate();
    const {user,permissions} = useContext(UserContext);


    useEffect(()=>{
        if(!can(permissions,'fournisseur-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);

    const [loading, setLoading] = useState(false);

    const [itemsList,setItemsList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [marqueList,setMarqueList] = useState([]);

    const columns = [
        {
            name: 'CODE',
            selector: row => row.code,
            sortable: true,
        },
        {
          name: 'NOM DU FOURNISSEUR',
          selector: row => row.name,
          sortable: true,
        },
        {
            name: 'TELEPHONE',
            selector: row => row.tel,
            sortable: true,
        },

        {
            name: 'ADRESSE',
            selector: row => row.adresse,
            sortable: true,
          },
          {
            name: 'EMAIL',
            selector: row => row.email,
            sortable: true,
          },
    
        {
          name: "Statut",
          selector : row => (
            <>
             {row.status == 1 && (
            <span className="badge bg-success">Actif</span>
            )}
            {row.status == 0 && (
                <span className="badge bg-danger">Inactif</span>
            )}
            </>
          )
        },
        {
            name: "Action",
            selector : row => (
                <>
                    {can(permissions,"add-update-fournisseur") &&
                        <Link className="btn btn-primary btn-sm mx-1" to={`/fournisseur-edit/${row.uuid}`}><i class="fa-solid fa-pen"></i></Link>
                    }
                    {can(permissions,"supprimer-fournisseur") &&
                        <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button>
                    }
                    </>
            )
          },

    ];
    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/setting/fournisseur-list',{
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

    useEffect(()=>{
        fetchItemsList();
    },[]);

    useEffect(()=>{
        try {
            axios.get(url.base+'/setting/marque-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setMarqueList(resp.data.data);
                }
                // setLoading(false);
            })
        } catch (error) {
            // setLoading(false);
        }
    },[]);


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
                    axios.get(url.base+'/setting/fournisseur-delete/?fournisseur_id='+id,
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
        const datas = itemsListFilter.filter(row => row.name.toLowerCase().includes(event.target.value.toLowerCase()));
        setItemsList(datas);
    }


    const handleFilterMarque=(event)=>{
        setLoading(true);
        if(event.target.value !=="")
        {
            try {
                axios.get(url.base+'/setting/fournisseur-marques/'+event.target.value,{
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
        }else{
            fetchItemsList();
        }

    }
    return (
        <>
             <div class="row">
                        <div class="col-12">
                            
                            <div class="card mb-4">
                                <div class="card-header  ">
                                    <div class="row">
                                        <div class=" col-lg-3 col-md-6">
                                            <input type="search" class="form-control " placeholder="Nom du fournisseur" onChange={handleFilter}/>

                                        </div>
                                        <div class="col-lg-4 col-md-6 d-flex align-items-center mt-3 mt-md-0">
                                            <label class="form-label me-2 mb-0">Tri par marque</label>
                                        <select class="form-select" aria-label="Default select example" onChange={handleFilterMarque}>
                                            <option selected value="">Tous</option>
                                            {marqueList?.map((marque,index)=>
                                                <option value={marque.id}>{marque.libelle}</option>
                                            )}
                                            
                                            
                                        </select>
                                        </div>




                                    <div class="col-lg-5 text-lg-end mt-3 mt-lg-0">                                        
                                        <a href="#!" class="btn btn-light " >Exporter</a>
                                    </div>
                                </div>
                                </div>
                    <div class="card-body">
                        <div class="table-responsive ">
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
                            {/* <table id="example" class="table text-nowrap table-centered mt-0" style={{"width": "100%"}}>
                                <thead class="table-light">
                                    <tr>
                                        <th className="text-center">CODE</th>
                                        <th className="text-center">NOM DU FOURNISSEUR</th>
                                        <th className="text-center">TELEPHONE</th>
                                        <th className="text-center">ADRESSE</th>
                                        <th className="text-center">EMAIL</th>
                                        <th className="text-center">STATUT</th>
                                        <th className="text-center">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {loading &&                                 
                                          
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                      
                                     
                                    } 
                                    {!loading &&
                                       
                                       itemsList?.map((item,index)=>
                                            <tr>
                                               

                                                <td className="text-center">{item.code} </td>
                                                <td className="text-center">{item.name} </td>
                                                <td className="text-center">{item?.tel} </td>
                                                <td className="text-center">{item.adresse} </td>
                                                <td className="text-center">{item.email} </td>
                                                <td className="text-center">
                                                    {item.status && <span className="badge bg-success">actif</span>}
                                                    {!item.status && <span className="badge bg-danger">supprimé</span>}
                                                </td>

                                                <td className="text-center">                                           
                                                    <button className="btn btn-primary btn-sm mx-1"><i class="fa-solid fa-pen"></i></button>
                                                    <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(item.id)}><i class="fa-solid fa-trash"></i></button>
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
        </>
    )
}

export default ListeFournisseur;