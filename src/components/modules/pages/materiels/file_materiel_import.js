import axios from "axios";
import ContentSection from "../../Content";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BaseUrl from "../../../utils/BaseUrl";
import moment from "moment";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import Swal from "sweetalert2";
import SwalTopEnd from "../../../utils/swal_top_end";
import * as XLSX from 'xlsx';
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
const customerStyle = CustomerStyle();
function ImportPageMateriel(){
    const [loading,setLoading] = useState(false);
    const [tranfertList,setTransfertList] = useState([]);
    const [itemsListFilter,setItemsListFilter] = useState([]);
    const [ref,setRef] = useState([]);

    const [ExistMateriels,setExistMateriel] = useState([]);
    const [excelData, setExcelData] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [excel, setExcel] = useState(null);

    const [commentaire,setCommentaire] = useState('');
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const columns = [
        {
            name: 'DATE CREAITON',
            selector: row => moment(row.created_at).format('Do MMMM yy'),
            sortable: true,
        },
        {
            name: 'REFERENCE',
            selector: row =>row.reference,
            sortable: true,
        },
        {
            name: 'COMMENTAIRE',
            selector: row => row.commentaire,
            sortable: true,
        },
        {
          name: 'MATERIEL',
          selector: row => row.materiel?.libelle,
          sortable: true,
        },


        {
            name: 'IMPORTER PAR',
            selector: row => `${row.added?.use_nom} ${row.added?.use_prenom}` ,
            sortable: true,
          },
         

    
        {
          name: "Statut",
          selector : row => (
            <>
                {row.status == 1 && <span class="badge bg-success">Validé</span>}
                {row.status == 2 && <span class="badge bg-danger">Rejeté</span>}
                {row.status == 0 && <span class="badge bg-warning text-dark">En attente de validation</span>}
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
                        <button className="btn btn-success btn-sm mx-1" onClick={()=>DownloadFile(row.reference)}> <i class="fa-solid fa-download"></i> </button>
                        {row.status == 0 && can(permissions,'valider-importation-stock') &&
                            <>
                                    <button className="btn btn-primary btn-sm mx-1" onClick={()=>validItem(row.reference)}><i class="fa-solid fa-check"></i></button>
                                    <button className="btn btn-danger btn-sm mx-1" onClick={()=>refusedItem(row.reference)}><i class="fa-solid fa-xmark"></i></button>
                            </>
                        }
                    </>
                }

                </>
            )
          },

    ];
    useEffect(()=>{
        if(!can(permissions,'importation-list')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);


    useEffect(()=>{
        fetchTransfertList();
    },[]);

    const fetchTransfertList = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/file-imports-materiel',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                setLoading(false);
                setTransfertList(resp.data.data);
                setItemsListFilter(resp.data.data);  
            })
        } catch (error) {
            setLoading(false);
        }
    }

    const handleFilter=(event)=>{
        const datas = itemsListFilter.filter(row => row.reference.toLowerCase().includes(event.target.value.toLowerCase()));
        setTransfertList(datas);
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


    const open_import_template_modal=()=> {
        window.$("#exampleModalCenteContrat").modal('show');
    }

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
    
        const handleFileSubmit=()=>{
        // e.preventDefault();
        if(excelFile!==null){
            const workbook = XLSX.read(excelFile,{type: 'buffer'});
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
    
            if(data.length > 0)
            {
            if(validateColumns(data)){
                SwalTopEnd({icon:"error",title:"Le fichier ne correspond pas au model"});
                return;
                }
            setExcelData(data.slice(0,10));
            }else{
            SwalTopEnd({icon:"error",title:"Le fichier est vide"});
            }
            
        }else{
            SwalTopEnd({icon:"error",title:"Aucun fichier n'a été uploader"})
        }

        }

        const validateColumns = (data) => {
            if (data.length > 0) {
                const keys = Object.keys(data[0]);
                return !(keys.includes('NUMERO DE SERIE'));
            }
            return true;
        };

    const submitForm=async(e)=>{
        e.preventDefault();
        // console.log(commentaire)
        if(commentaire !=="" ){
              const _formData = new FormData();        
              
              if(excel !== null){

                const workbook = XLSX.read(excelFile,{type: 'buffer'});
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
    
                if(data.length > 0)
                { console.log(data)
                    if(validateColumns(data)){
                        SwalTopEnd({icon:"error",title:"Le fichier ne correspond pas au model ou numéro de serie vide"});
                        return;
                    }

                    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
                    const originalExtension = excel.name.split('.').pop();
                    const newFileName = `${currentTimeInSeconds}_image_.${originalExtension}`;
                    const file = new File([excel], newFileName, { type: excel.type });
                    
                    _formData.append("file",file);
                    _formData.append("commentaire",commentaire);

                    console.log(_formData);
        
                    setLoading(true);
                    try {
                        axios.post(`${url.base}/import-excelfile-materiels`,_formData,
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
                            html: `<b style="color:green">${resp.data.rowSuccess} ont été importé avec succès!</b></br><b style="color:red">${resp.data.rowEchec} ont echoué !</b>`,
                            icon: 'success'
                          })
        
                        // navigate('/stock-materiels');
                    
                        fetchTransfertList();
                        
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
          if(commentaire == ""){SwalTopEnd({icon:"error",title:"Le titre est obligatoire"})}
        } 


      }

    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"file-import-list"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                                
                                <div class="mb-5">
                                    <h3 class="mb-0 ">Liste des importations 
                                            <button  class="btn btn-primary me-2 float-end btn-sm" onClick={()=>open_import_template_modal()}>Impoter un fichier</button>
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
                                                    <input type="search" class="form-control " placeholder="Reference..." onChange={handleFilter} />

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
                                                    data={tranfertList}
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

                <div class="modal fade" id="exampleModalCenteContrat" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-md" role="document">
                        <form class="modal-content" onSubmit={submitForm}>
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Importer un template excel</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                            </div>
                            <div class="modal-body">
                                <div className="row">
                                    <div class="mb-3 col-md-12">
                                            <label class="form-label" for="textInput">Commentaire ou titre</label>
                                            <input type="text" className="form-control" onChange={(e)=>setCommentaire(e.target.value)}  />
                                    </div>  
                                    <div className="mb-3 col-md-12 col-12">
                                        <label className="form-label">Uploader le fichier</label>
                                        <input type="file" className="form-control" required onChange={handleFile} id="file_excel"/>
                                    </div>
                                </div>
                                    
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                <button type="submit" class={!loading ? "btn btn-primary" : "btn btn-primary disabled"}>{!loading ? "Enregister" : "Enregistrement en cours ..."}</button>
                            </div>
                        </form>
                    </div>
            </div>
            </ContentSection>
        </>
    )
}

export default ImportPageMateriel;