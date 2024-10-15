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

function MaterielPage(){
    const [materiels,setMateriels] = useState([]);
    const [count_instock,setcount_instock] = useState(0);
    const [count_wating,setcount_wating] = useState(0);
    const [count_deploye,setcount_deploye] = useState(0);
    const [count_declasse,setcount_declasse] = useState(0);
    const [count_all,setcount_all] = useState(0);
    const [categories,setCategories] = useState([]);
    const [loading,setLoading] = useState(false);

        const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const [itemsListFilter,setItemsListFilter] = useState([]);
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
                    {can(permissions,'add-update-article') && <Link className="btn btn-primary btn-sm ps-1" to={`/update-materiel/${row.uuid}`}> <i className="fa fa-pencil"></i> </Link> }                    
                    {can(permissions,'detail-article') && <Link className="btn bg-warning-soft btn-sm ps-1 mx-1" to={`/materiel/${row.uuid}`}> <i className="fa fa-eye"></i> </Link> }
                </>
            )
          },

    ];

        useEffect(()=>{
        if(!can(permissions,'articles-list')){
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
            <ContentSection ulShownav={"managements"} navactive={"gest-materiel"}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                    
                            <div class="mb-5">
                                <h3 class="mb-0 ">Liste des Articles 

                                {can(permissions,'add-update-article') && <Link to="/materiel/create" class="btn btn-primary float-end">+ Ajouter un article</Link> }

                                        {/* <Link to="/materiel/files-import" class="btn btn-danger-soft  btn-icon ms-2 texttooltip" >
                                            <i class="fa-solid fa-file-import"></i>                                    
                                        </Link> */}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div>
            
               
                        <div class="row">
                            <div class="col-12">
                        
                            <div class="card mb-4">
                                <div class="card-header">
                                <div class="row g-2">
                                <div class="col-md-5 col-lg-3 float-end">
                                    <input type="search" class="form-control w-100 " placeholder="Libelle" onChange={handleFilter}
                                    />
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

export default MaterielPage;