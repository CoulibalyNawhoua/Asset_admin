import { useNavigate } from "react-router-dom";
import ContentSection from "../../Content";
import Select from "react-select";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import SwalTopEnd from "../../../utils/swal_top_end";
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
function CreateInterventionPage()
{
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [error,setError] = useState();
    const [loading,setLoading] = useState(false);
    const [pdvList,setPdvList] = useState([]);
    const [territoires,setTerritoires] = useState([]);
    const [reparateurs,setReparateurs] = useState([]);
    const [typeInterventions,setTypeInterventions] = useState([]);

    const [selectPdv,setSelectPdv]= useState(null);
    const [selectOptionterritoire,setSelectionTerritoire] = useState(null);
    const [selectReparateur,setSelectReparateur] = useState(null);
    const [selectTypeIntervention,setSelectTypeIntervention] = useState(null);

    const [note,setNoteCommercial] = useState("");
    const [photo_materiel,setPhoto] = useState("");

    const {user,permissions} = useContext(UserContext);
    useEffect(()=>{
    if(!can(permissions,'add-intervention')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);

    useEffect(()=>{
        get_pdv_all();
        get_territoires_list();
        fetchUserList();
        get_type_interventions_list();
    },[])

    function get_pdv_all()
    {
        try {
            axios.get(url.base+'/distriforce/pointdevente-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setPdvList(resp.data);
                } else {
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    function get_territoires_list()
    {
        try {
            axios.get(url.base+'/setting/territoire-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setTerritoires(resp.data.data);
                } else {
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    function get_type_interventions_list()
    {
        try {
            axios.get(url.base+'/list-type-interventions',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setTypeInterventions(resp.data.data);
                } else {
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchUserList = async ()=>{
        setLoading(true);
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

    const optionterritoires = territoires?.map((option)=>({
        label:`${option.libelle}`,
        value:`${option.id}`
    }));

    const optionspdv = pdvList?.map((option)=>({
        label:`${option.NomPdv}`,
        value:`${option.Id}`
    }));

    const optionreparateurs = reparateurs?.map((option)=>({
        label:`${option.name}`,
        value:`${option.id}`
    }));

    const optiontypeinterventions = typeInterventions?.map((option)=>({
        label:`${option.libelle}`,
        value:`${option.id}`
    }));


    const handleChangePdv=(selectoption)=>{
        setSelectPdv(selectoption.value);
    }
    
    const handleChangeTerritoire=(selectoption)=>{
        setSelectionTerritoire(selectoption.value);
    }

    const handleChangeReparateur=(selectoption)=>{
        setSelectReparateur(selectoption.value);
    }

    const handleChangeTypeIntervention=(selectoption)=>{
        setSelectTypeIntervention(selectoption.value);
    }

    const submitForm=(e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append("note_commercial",note);
        _formData.append("pointdevente_id",selectPdv !== null ? selectPdv : "");
        _formData.append("territoire_id",selectOptionterritoire !== null ? selectOptionterritoire : "");
        _formData.append("reparateur_id",selectReparateur !== null ? selectReparateur : "");
        _formData.append("type_intervention_id",selectTypeIntervention !== null ? selectTypeIntervention : "");

        if(photo_materiel !=""){
            const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
            const originalExtension = photo_materiel.name.split('.').pop();
            const newFileName = `${currentTimeInSeconds}_image_.${originalExtension}`;
            const photo = new File([photo_materiel], newFileName, { type: photo_materiel.type });
            
            _formData.append("photo_materiel",photo);
        }

        console.log(_formData);

        setLoading(true);
        try {
            axios.post(url.base+'/create-new-intervention',_formData,
           {
               headers:{
                   'Content-Type':'multipart/form-data',
                   "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                   
               },
               credentials:'include'
           }
           ).then((resp)=>{          
               setLoading(false);
               if(resp.data.code == 400){
                SwalTopEnd({icon:"error",title:resp.data.msg});
               }else{
                SwalTopEnd({icon:"success",title:"Intervention enregistré avec succès !"});
  
                navigate('/interventions-list');
                setErrors({});
               }
         
  
           }).catch((error)=>{
               setLoading(false);
               setError(error.response.data.message);
               setErrors(error.response.data.error);
  
           })
       } catch (error) {
        setLoading(false);
           console.log(error.response);
       } 

    }


    

    return (
        <>
        <ContentSection ulShownav={"interventions"} navactive={"intervention_list"}>
            <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                            <div class="mb-5">
                                <h3 class="mb-0 ">Création ticket d'intervention</h3>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="row">
                            <div class="col-xxl-12 col-12">
                            <div class="card mb-4 mt-4 mt-xxl-0">
                            <div class="card-header">
                                <form class="row g-2" onSubmit={submitForm}>
                                
                                    <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                                        <label className="form-label">Choisir le térritoire</label>
                                        <Select placeholder="Choisissez le territoire" options={optionterritoires} onChange={handleChangeTerritoire}/> 
                                        {errors && errors.territoire_id && (
                                            <span className="text-danger">{errors.territoire_id[0]}</span>
                                        )}                               
                                    </div>
                                    <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                                            <label className="form-label">Selectionnez un PDV</label>
                                            <Select placeholder="Choisissez un Point de vente" options={optionspdv} onChange={handleChangePdv}/>                                
                                            {errors && errors.pointdevente_id && (
                                                <span className="text-danger">{errors.pointdevente_id[0]}</span>
                                            )}   
                                    </div>

                                
                                    <div className="mb-3  col-md-6 col-lg-6 col-sm-12">
                                            <label className="form-label">Selectionnez un reparateur</label>
                                            <Select placeholder="Veuillez choisir le reparateur" options={optionreparateurs} onChange={handleChangeReparateur}/>                                
                                            {errors && errors.reparateur_id && (
                                                <span className="text-danger">{errors.reparateur_id[0]}</span>
                                            )}
                                    </div>

                                    <div className="mb-3  col-md-6 col-lg-6 col-sm-12">
                                            <label className="form-label">Selectionnez le type d'intervention</label>
                                            <Select placeholder="Veuillez choisir le reparateur" options={optiontypeinterventions} onChange={handleChangeTypeIntervention}/>                                
                                            {errors && errors.type_intervention_id && (
                                                <span className="text-danger">{errors.type_intervention_id[0]}</span>
                                            )}
                                    </div>

                                    <div className="mb-3  col-md-12 col-lg-12 col-sm-12">
                                            <label className="form-label">Renseignement du commercial</label>
                                            <textarea className="form-control" onChange={(e)=>setNoteCommercial(e.target.value)}></textarea>                              
                                            {errors && errors.note_commercial && (
                                                <span className="text-danger">{errors.note_commercial[0]}</span>
                                            )}
                                    </div>

                                    <div className="mb-3  col-md-12 col-lg-6 col-sm-12">
                                            <label className="form-label">Image d'illustration</label>
                                            <input type="file" className="form-control"  onChange={(e)=>setPhoto(e.target.files[0])}/>  
                                            {errors && errors.photo_materiel && (
                                                <span className="text-danger">{errors.photo_materiel[0]}</span>
                                            )}                           
                                    </div>


                                    {!loading && <button type="submit" className="btn btn-primary" >Enregistrer</button>}
                                    {loading && <button className="btn btn-primary " type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Chargement...
                                    </button>}
                                </form>
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

export default CreateInterventionPage;