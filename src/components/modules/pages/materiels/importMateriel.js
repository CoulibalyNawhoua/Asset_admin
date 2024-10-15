import { useContext, useEffect, useState } from "react";
import ContentSection from "../../Content";
import * as XLSX from 'xlsx';
import Select from 'react-select';
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import SwalTopEnd from "../../../utils/swal_top_end";
import { useNavigate } from "react-router-dom";
import can from "../../../utils/Can";
import { UserContext } from "../../../utils/User_check";

const url = BaseUrl();
function ImportMateriel(){
      // onchange states
  const navigate = useNavigate();

  const [excelFile, setExcelFile] = useState(null);
  const [excel, setExcel] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [materiels,setMateriels] = useState([]);
  const [selectArticle,setSelectionArticle] = useState(null);
  const [commentaire,setCommentaire] = useState('');
  const [dateAc,setDateAc] = useState('');
  const [loading,setLoading] = useState(false);
  const [ExistMateriels,setExistMateriel] = useState([]);
  const [depots,setDepots] = useState([]);
  const [selectDepot,setSelectDepot] = useState(null);
  const [qty,setQty] = useState(0);

  // submit state
  const [excelData, setExcelData] = useState(null);
  const {user,permissions} = useContext(UserContext);
  useEffect(()=>{
      if(!can(permissions,'import-excel-stock')){
          navigate('/tableau-de-bord');
      }
  },[user,permissions]);

  useEffect(()=>{
    materiel_list();
    depotFunctionList();
  },[])


  function materiel_list(){
    try {
        axios.get(url.base+'/materiels-list',{
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
    }

    const optionarticles = materiels?.map((option)=>({
        label:`${option.libelle}`,
        value:option.code
    }));

    const handleChangeArticle=(selectOption)=>{
        setSelectionArticle(selectOption.value);
    }

    // onchange event
    const handleFile=(e)=>{
        let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
        let selectedFile = e.target.files[0];
        if(selectedFile){
          if(selectedFile && fileTypes.includes(selectedFile.type)){
            setTypeError(null);
            let reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload=(e)=>{
              setExcelFile(e.target.result);
              setExcel(selectedFile);
            }
          }
          else{
            setTypeError("S'il vous plait selectionné uniquement un fichier excel");
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
                setTypeError("Le fichier ne correspond pas au model");
                return;
              }
            setExcelData(data.slice(0,10));
          }else{
            setTypeError("Le fichier est vide");
          }
          
        }else{
            SwalTopEnd({icon:"error",title:"Aucun fichier n'a été uploader"})
        }

      }

      const validateColumns = (data) => {
        if (data.length > 0) {
          const keys = Object.keys(data[0]);
          return !(keys.includes('NUM SERIE'));
        }
        return true;
      };

      const submitForm=async(e)=>{
        e.preventDefault();

        if(selectArticle !==null && qty > 0 &&selectDepot !== null){
              const _formData = new FormData();        
              // _formData.append("commentaire",commentaire);
              _formData.append("qty",qty);
              _formData.append("date_acquisition",dateAc);
              _formData.append("materiel_id",selectArticle !== null ? selectArticle : "");
              _formData.append("depot_id",selectDepot !== null ? selectDepot : "");

              // if(excel !== null){
              //   const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
              //   const originalExtension = excel.name.split('.').pop();
              //   const newFileName = `${currentTimeInSeconds}_image_.${originalExtension}`;
              //   const file = new File([excel], newFileName, { type: excel.type });
                
              //   _formData.append("file",file);
              // }
  
              // console.log(_formData);
        
              setLoading(true);
              try {
                  axios.post(`${url.base}/downloade-template-materiels`,_formData,
                {
                    headers:{
                        'Content-Type':'multipart/form-data',
                        "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                        
                    },
                    responseType:'blob',
                    //  credentials:'include'
                }
                ).then((response)=>{          
                    setLoading(false);
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    
                    // Définir le nom du fichier en fonction de son type
                    const contentDisposition = response.headers['content-disposition'];
                    let fileName = 'template';
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
                        fileName = `template.${extension}`;
                    }
                    
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    SwalTopEnd({icon:"success",title:"Template effectuée avec succes"});        
                    // navigate('/stock-materiels');
                    
                }).catch((error)=>{
                    setLoading(false);
        
                })
            } catch (error) {
                console.log(error.response);
            } 
        }else{
          if(qty ==0){SwalTopEnd({icon:"error",title:"La quantité est inferieur ou egale à 0"})}
          if(selectArticle == null){SwalTopEnd({icon:"error",title:"Veuillez choisir un article"})}
          if(selectDepot == null){SwalTopEnd({icon:"error",title:"Veuillez choisir un depôt"})}
        } 


      }

      const depotFunctionList=()=>{
        try {
          axios.get(url.base+'/setting/entrepot-list',{
              headers:{
                  'Content-Type':'application/json',
                  "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                  
              },
          }).then((resp)=>{
  
                if(resp.status == 200){
                  setDepots(resp.data.data);
                }
            })
        } catch (error) {
          console.log(error);
        }
       
      }

      const optiondepots = depots?.map((option)=>({
        label:`${option.name}`,
        value:option.id
      }));

      const handleChangeDepot=(selectOption)=>{
        setSelectDepot(selectOption.value);
      }
      
    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"stock-materiel"}>
                <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-12">
                        
                                <div class="mb-5">
                                    <h3 class="mb-0 ">Obtenir un template</h3>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-12" >
                            
                              <div className="card mb-5">
                                {/* <h5 className="p-2 text-primary">Télécharger le modele de fichier ici</h5> */}
                              
                                <div className="card-body">
                              
                                    {typeError&&(
                                        <div className="alert alert-danger" role="alert">{typeError}</div>
                                    )}
                                    <form className="form-group custom-form" onSubmit={submitForm}>
                                        <div className="row" >
                                            {/* <div className="mb-3 col-6">
                                                    <label className="form-label">Titre ou commentaire</label>
                                                    <input type="text" className="form-control" name="date_acquisition" onChange={(e)=>setCommentaire(e.target.value)}/>
                                            
                                                </div> */}
                                              <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                                                  <label className="form-label">Dépot</label>
                                                  <Select placeholder="Selectionner un depôt" options={optiondepots} onChange={handleChangeDepot}/>                                
                                            </div>
                                            <div className="mb-4 col-md-6 col-12">
                                                <label className="form-label">Articles</label>
                                                <Select  options={optionarticles} onChange={handleChangeArticle}/>                                                        
                                            </div>
                                            <div className="mb-3 col-6">
                                                    <label className="form-label">Date Acquisition</label>
                                                    <input type="date" className="form-control" name="date" onChange={(e)=>setDateAc(e.target.value)}/>
                                            </div>
                                            <div className="mb-3 col-md-6 col-6">
                                                <label className="form-label">Quantité</label>
                                                <input type="number" className="form-control" required onChange={(e)=>setQty(e.target.value)} value={qty} min={0}/>
                                            </div>
                                        </div>
                                        {/* <button type="button" className="btn btn-success btn-md col-md-5 col-12 me-2" onClick={handleFileSubmit}>AFFICHER</button> */}
                                        {!loading && <button type="submit" className="btn btn-primary btn-md col-md-6 col-12" >TELECHARGER</button>}
                                        {loading && <button class="btn btn-primary btn-md col-md-6 col-12" type="button" disabled>
                                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        Importation en cours...
                                        </button>}
                                        

                                      
                                    </form>

                                    <div className="viewer mt-4 container">
                                        {excelData?(
                                        <div className="table-responsive">
                                            <table className="table">

                                            <thead>
                                                <tr className="bg-warning-soft">
                                                {Object?.keys(excelData[0])?.map((key)=>(
                                                    <th key={key}>{key}</th>
                                                ))}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {excelData?.map((individualExcelData, index)=>(
                                                <tr key={index} className="bg-success-soft">
                                                    {Object.keys(individualExcelData)?.map((key)=>(
                                                    <td key={key}>{individualExcelData[key]}</td>
                                                    ))}
                                                </tr>
                                                ))}
                                            </tbody>

                                            </table>
                                        </div>
                                        ):(
                                        <div></div>
                                        )}

                                    {ExistMateriels.length > 0 ?(
                                        <div className="table-responsive">
                                            <table className="table">

                                            <thead>
                                                <tr className="bg-warning-soft">
                                                    <th >NUM SERIE</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {ExistMateriels?.map((individualExcelData, index)=>(
                                                <tr key={index} className="bg-danger-soft">
                                                    <td >{individualExcelData["num_serie"]}</td>
                                                </tr>
                                                ))}
                                            </tbody>

                                            </table>
                                        </div>
                                        ):""}
                                    </div>
                                </div>
                              </div>
                            
                            
                            </div>

                        </div>


                </div>

          
            </ContentSection>
        </>
    );
}

export default ImportMateriel;