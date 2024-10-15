import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../../utils/BaseUrl";
import CustomerStyle from "../../../utils/customerStyle";
import DataTable from "react-data-table-component";
import { UserContext } from "../../../utils/User_check";
import { Link, useNavigate } from "react-router-dom";
import can from "../../../utils/Can";
import Select from "react-select";
import * as XLSX from 'xlsx';
import SwalTopEnd from "../../../utils/swal_top_end";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function PointDeVentePage() {
    const [errors,setErrors] = useState({});
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loadingf, setLoadingf] = useState(false);
    const [itemData,setItemData] = useState({
        "name":"",
        "adresse":"",
        "manager":"",
        "tel":"",
        "categorie":"",
        "territoire_id":"",
        "latitude":"",
        "longitude":"",
        "nomenclature":""
    });
    const [itemsList,setItemsList] = useState([]);
    const [territoireList,setTerritoireList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedOptionCommercial, setSelectedOptionCommercial] = useState([]);
    const [excelData, setExcelData] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [excel, setExcel] = useState(null);
    

    const columns = [
        {
            name: 'ID',
            selector: (row,index) => row?.Id,
            sortable: true,
        },
        {
            name: 'TERRITOIRE',
            selector: row => row?.Territoire,
            sortable: true,
          },
        {
          name: 'PDV',
          selector: row => row?.NomPdv,
          sortable: true,
        },
        {
            name: 'MANAGER',
            selector: row => row?.ManagerPdv,
            sortable: true,
        },
        {
            name: 'TELEPHONE',
            selector: row => row.Contact,
            sortable: true,
          },
         

        {
            name: 'ADRESSE',
            selector: row => row.Address,
            sortable: true,
          },
          {
            name: 'LATITUDE',
            selector: row => row.latitude,
            sortable: true,
          },
          {
            name: 'LONGITUDE',
            selector: row => row.longitude,
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
                <Link className="btn btn-primary btn-sm" to={`/pointdevente/${row.uuid}`}>Voir plus</Link>

                 {/* {can(permissions,"add-update-pdv") && 
                    <button className="btn btn-primary btn-sm mx-1"><i class="fa-solid fa-pen"></i></button>
                 } */}
                 {/* {can(permissions,"supprimer-pdv") && 
                    <button className="btn btn-danger btn-sm" onClick={()=>deleteItem(row.id)}><i class="fa-solid fa-trash"></i></button>
                 } */}
                </>
            )
          },

    ];

    useEffect(()=>{
        // if(!can(permissions,'pdv-list')){
        //     navigate('/tableau-de-bord');
        // }
    },[user,permissions]);


    useEffect(()=>{
        fetchItemsList();
        fetchUserList();
    },[]);

    useEffect(()=>{
        try {
            axios.get(url.base+'/setting/territoire-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setTerritoireList(resp.data.data);
           
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    },[]);

    const fetchItemsList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/setting/pointdevente-list',{
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



    const fetchUserList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/users-commercial',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setUsers(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const handleChange=(e)=>{
        setItemData({
            ...itemData,
            [e.target.name]:e.target.value
        });
    }

    const submitForm=async(e)=>{
        e.preventDefault();
        // console.log(commentaire)
        if(selectedOptionCommercial !==null ){
              const _formData = new FormData();        
              
              if(excel !== null){

                const workbook = XLSX.read(excelFile,{type: 'buffer'});
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
    
                if(data.length > 0)
                { console.log(data)
                    if(validateColumns(data)){
                        SwalTopEnd({icon:"error",title:"Le fichier ne correspond pas au model"});
                        return;
                    }

                    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
                    const originalExtension = excel.name.split('.').pop();
                    const newFileName = `${currentTimeInSeconds}_excel_.${originalExtension}`;
                    const file = new File([excel], newFileName, { type: excel.type });
                    
                    _formData.append("file",file);
                    _formData.append("commercial_id",selectedOptionCommercial);

                    console.log(_formData);
        
                    setLoading(true);
                    try {
                        axios.post(`${url.base}/import-excelfile-pdv`,_formData,
                    {
                        headers:{
                            'Content-Type':'multipart/form-data',
                            "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                            
                        },
                        //  credentials:'include'
                    }
                    ).then((resp)=>{          
                        setLoading(false);
                    
                        setExcelFile(null);
                        window.$("#file_excel").val("");
        
                        Swal.fire({
                            title: 'RESULTAT !',
                            html: `<b style="color:green">${resp.data.rowSuccess} Pdv importé avec succès!</b></br><b style="color:red">${resp.data.rowEchec} Pdv ont echoué !</b>`,
                            icon: 'success'
                        });
        
                        // navigate('/stock-materiels');
                    
                        fetchItemsList();
                        
                    }).catch((error)=>{
                        setLoading(false);
            
                    })
                    } catch (error) {
                        console.log(error.response);
                    } 
                }else{
                    SwalTopEnd({icon:"error",title:"Le fichier est vide"});
                }
                
              }
  
             
        }else{
          if(selectedOptionCommercial == null){SwalTopEnd({icon:"error",title:"Veuillez selectionner un commercial"})}
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
                    axios.get(url.base+'/setting/pointdevente-delete/?pdv_id='+id,
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


    const take_modal_template=()=>{
        window.$('#exampleModal-2').modal('show');
    }
    const handleChangeCommercial=(selectedOption)=>{
        setSelectedOptionCommercial(selectedOption.value);
    }  


      const handleDownloadFileExcel = () => {
            const fileUrl = '/TEMPLATE.xlsx';  // Chemin du fichier
            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = 'template_excel.xlsx';  // Nom du fichier pour le téléchargement
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
      };

      
      const optionusers = users?.map((item)=>({
        value: item.id,
        label:`${item.use_nom} ${item.use_prenom}`
      }));

    // onchange event
    const handleFile=(e)=>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
        if(selectedFile && fileTypes.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
            setExcelFile(e.target.result);
            setExcel(selectedFile);
        }
        }
        else{
        SwalTopEnd({icon:"error",title:"S'il vous plait selectionné uniquement un fichier excel"});
        setExcelFile(null);
        window.$("#file_excel").val("");
        }
    }
    else{
        console.log('Please select your file');
    }
    }

    const validateColumns = (data) => {
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            return !(keys.includes('CANAL') | keys.includes('ZONE') | keys.includes('TERRITOIRE') | keys.includes('SECTEUR') | keys.includes('CATEGORIE') | keys.includes('NOM DU POINT DE VENTE') | keys.includes('NOM DU MANAGER DU POINT DE VENTE') |  keys.includes('CONTACT') | keys.includes('ADRESSE') | keys.includes('STATUT FINANCIER') | keys.includes('LATITUDE') | keys.includes('LONGITUDE') | keys.includes('NOMENCLATURE'));
        }
        return true;
    };

    return (
        <>
            <ContentSection ulShownav={"parametres"} navactive={"pointvente"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                                
                                <div class="mb-5">
                                    <h3 class="mb-0 ">Liste des points de ventes</h3>

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
                                            {can(permissions,"add-update-pdv") && 
                                                <Link  class="btn btn-primary me-2" to="/add-pointdevente">Ajouter</Link>
                                            }
                                                <button class="btn btn-success" onClick={take_modal_template}>Improter un fichier excel</button>
                                                <button  class="mx-2 btn btn-secondary" onClick={handleDownloadFileExcel}>Obtenir un template</button>
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
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Ajouter une liste de point de vente</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                        {/* <span aria-hidden="true">&times;</span> */}
                                    </button>
                                </div>
                                <form onSubmit={submitForm}>
                                    <div class="modal-body">                              
                                    
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div class="mb-3">
                                                        <label class="form-label" for="selectOne">Commercial <span
                                                        class="text-secondary">(Obligatoire)</span></label>
                                                    <Select options={optionusers}  onChange={handleChangeCommercial} />
                                                        {errors && errors.commercial_id && (
                                                            <span className="text-danger">{errors.commercial_id[0]}</span>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div class="mb-3">
                                                        <label class="form-label" for="selectOne">Uploader le fichier <span
                                                        class="text-secondary">(Obligatoire)</span></label>
                                                    <input type="file" className="form-control" required onChange={handleFile} id="file_excel"/>                             
                                                        {errors && errors.file && (
                                                            <span className="text-danger">{errors.file[0]}</span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>


                            
                                    
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                        
                                        {!loading && <button type="submit" class="btn btn-primary">Enregistrer</button>}
                                        {loading && <button class="btn btn-primary btn-sm" type="button" disabled>
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

export default PointDeVentePage;