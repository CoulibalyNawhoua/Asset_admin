import DataTable from "react-data-table-component";
import ContentSection from "../../Content";
import BaseUrl from "../../../utils/BaseUrl";
import CustomerStyle from "../../../utils/customerStyle";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import SwalTopEnd from "../../../utils/swal_top_end";
import { UserContext } from "../../../utils/User_check";
import { useNavigate } from "react-router-dom";
import can from "../../../utils/Can";

const url = BaseUrl();
const customStyles = CustomerStyle();
function TemplateContratAffectation(){
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();

    const [contrats,setContrats] = useState([]);
    const [loading,setLoading] = useState(false);
    const [errors,setErrors] = useState({});
    const [constratFile,setContratFile] = useState('');

    const columns = [
        {
          name: 'NOM DU CONTRAT',
          selector: row => row.name,
          sortable: true,
        },  
        {
            name: 'FICHIER',
            selector: row => (
                <>
                    <a className="cursor pointer" onClick={()=>DownloadFile(row.id)}>{`${row.file}`}</a>
                </>
            ),
            sortable: true,
          },  
    ];

    useEffect(()=>{
        if(!can(permissions,'template-contrat')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);

    useEffect(()=>{
        get_contrat_list();
    },[]);

    function get_contrat_list()
    {
        try {
            axios.get(url.base+'/contrat-demande-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                    
                    setContrats(resp.data.data);
                
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const submitForm=(e)=>{
        e.preventDefault();
        const _formData = new FormData();
       
        if(constratFile !=""){
            const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
            const originalExtension = constratFile.name.split('.').pop();
            const newFileName = `${currentTimeInSeconds}_file_.${originalExtension}`;
            const photo = new File([constratFile], newFileName, { type: constratFile.type });
            
            _formData.append("file",photo);

            console.log(_formData)
            setLoading(true);
            try {
                axios.post(url.base+'/create-new-contrat-demande',_formData,
                {
                    headers:{
                        'Content-Type':'multipart/form-data',
                        "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                        
                    },
                    // credentials:'include'
                }
                ).then((resp)=>{
                    setLoading(false);
                    if(resp.status == 200){
                        // console.log(resp.data);
                        setErrors({});
    
                        SwalTopEnd({icon:'success',title:"Contrat Enregistrement effectué avec succès!"})
                          setContratFile('');
                          get_contrat_list();
                          window.$("#fileContrat").val('')
                    }else{
                        SwalTopEnd({icon:'error',title:"Désolé un problème est subvenu."})
                    }
                }).catch((error)=>{                
                    setLoading(false);
                    setErrors(error.response.data.error);
                })
            } catch (error) {
                setLoading(false);
            }
        }


    }

    const DownloadFile= (contrat)=>{
        // e.preventDefault();
      
      
        try {
            axios.get(url.base+'/download-contrat-demande/'+contrat,
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
              link.setAttribute('download', 'contrat_affectation.docx');
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
        <ContentSection ulShownav={"parametres"} navactive={"contrat"}>
        <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-12">
                    
                        <div class="mb-5">
                            <h3 class="mb-0 text-center"><u>UPLOADER UN CONTRAT D'AFFECTATION DE MATERIEL</u></h3>

                        </div>
                    </div>
                </div>
                <div>
                    

                    <form class="row" onSubmit={submitForm}>

                        <div class="col-lg-2 col-12"></div>
                        <div class="col-lg-8 col-12">
                            
                        <div class="card mb-4">
                            
                            <div class="card-body">
                                    
                                
                                <div>
                                    <div class="mb-3">
                                        <label class="form-label">Choisir un fichier<span className="text-danger">*</span></label>
                                        <input type="file" className="form-control" id="fileContrat" onChange={(e)=>setContratFile(e.target.files[0])} accept=".doc, .docx" required/>
                                        {errors && errors.contrat && (
                                        <span className="text-danger">{errors.contrat[0]}</span>
                                    )}
                                    </div>

                                    <div class="mb-3">
                                    <div class="table-responsive">
                                        <DataTable 
                                            columns={columns} 
                                            data={contrats} 
                                            customStyles={customStyles}
                                        />
                                    </div>
                                    </div>
                                </div>


                            </div>

                            
                            </div>
                            

                            
                    
                            <div class="d-grid">
                            {!loading &&
                                <button type="submit" class="btn btn-primary">
                                    Enregistrer
                                </button>
                            }
                            {loading &&
                            <button class="btn btn-primary" type="button" disabled>
                                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                Enregistrement en cours...
                            </button>
                            }
                        
                        </div>
                    
                        </div>
                    
                    </form>
                </div>
                </div>
        </ContentSection>
    </>
    )
}

export default TemplateContratAffectation;