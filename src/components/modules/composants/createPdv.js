import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../utils/BaseUrl";
import ContentSection from "../Content";
import Select from "react-select";
import SwalTopEnd from "../../utils/swal_top_end";
import { useNavigate } from "react-router-dom";

const url = BaseUrl();
function CreatePdvComponent(){
    const navigate = useNavigate();
    const [errors,setErrors] = useState({});
    const [errorMarque,setErrorMarque] = useState(null);
    const [loadingf, setLoadingf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [itemData,setItemData] = useState({
        "NomPdv":"",
        "Address":"",
        "ManagerPdv":"",
        "Contact":"",
        "Mobile":"",
        "StatutFinancier":"",
        "latitude":"",
        "longitude":"",
        "NomenclatureAGROCI":"",
    });

    const [marqueList,setMarqueList] = useState([]);
    const [canals,setCanals] = useState([]);
    const [zones,setZones] = useState([]);
    const [territoires,setTerritoires] = useState([]);
    const [secteurs,setSecteurs] = useState([]);
    const [users,setUsers] = useState([]);

    const [selectedOptionMarques, setSelectedOptionMarques] = useState([]);
    const [selectedOptionCanal, setSelectedOptionCanal] = useState([]);
    const [selectedOptionZone, setSelectedOptionZone] = useState([]);
    const [selectedOptionTerritoire, setSelectedOptionTerritoire] = useState([]);
    const [selectedOptionSecteur, setSelectedOptionSecteur] = useState([]);
    const [selectedOptionCommercial, setSelectedOptionCommercial] = useState([]);

    useEffect(()=>{
        fetchUserList();
        get_secteurs_list();
        get_territoires_list();
        get_zones_list();
        get_canals_list();
    },[]);

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

    function get_secteurs_list()
    {
        try {
            axios.get(url.base+'/secteurs-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setSecteurs(resp.data.data);
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

    function get_zones_list()
    {
        try {
            axios.get(url.base+'/setting/zone-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setZones(resp.data.data);
                } else {
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    function get_canals_list()
    {
        try {
            axios.get(url.base+'/setting/canal-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                    
                },
            }).then((resp)=>{

                if (resp.status == 200) {
                    setCanals(resp.data.data);
                } else {
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange=(e)=>{
        setItemData({
            ...itemData,
            [e.target.name]:e.target.value
        });
    }

    const handleChangeMarque=(selectedOption)=>{
        setSelectedOptionMarques(selectedOption);
    }

    const handleChangeCanal=(selectedOption)=>{
        setSelectedOptionCanal(selectedOption.value);
    }
    const handleChangeZone=(selectedOption)=>{
        setSelectedOptionZone(selectedOption.value);
    }
    const handleChangeTerritoire=(selectedOption)=>{
        setSelectedOptionTerritoire(selectedOption.value);
    }
    const handleChangeSecteur=(selectedOption)=>{
        setSelectedOptionSecteur(selectedOption.value);
    }
    const handleChangeCommercial=(selectedOption)=>{
        setSelectedOptionCommercial(selectedOption.value);
    }  

      const options = marqueList?.map((item)=>({
        value: item.id,
        label:`${item.libelle}`
      }));
      
      const optioncanals = canals?.map((item)=>({
        value: item.id,
        label:`${item.libelle}`
      }));

      const optionzones = zones?.map((item)=>({
        value: item.id,
        label:`${item.libelle}`
      }));

      const optionterritoires = territoires?.map((item)=>({
        value: item.id,
        label:`${item.libelle}`
      }));

      const optionsecteurs = secteurs?.map((item)=>({
        value: item.id,
        label:`${item.libelle}`
      }));

      const optionusers = users?.map((item)=>({
        value: item.id,
        label:`${item.use_nom} ${item.use_prenom}`
      }));

    const submitForm= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('NomPdv',itemData.NomPdv);
        _formData.append('Address',itemData.Address);
        _formData.append('ManagerPdv',itemData.ManagerPdv);
        _formData.append('Contact',itemData.Contact);
        _formData.append('Mobile',itemData.Mobile);
        _formData.append('StatutFinancier',itemData.StatutFinancier);
        _formData.append('latitude',itemData.latitude);
        _formData.append('longitude',itemData.longitude);
        _formData.append('NomenclatureAGROCI',itemData.NomenclatureAGROCI);
        _formData.append('canal_id',selectedOptionCanal);
        _formData.append('zone_id',selectedOptionZone);
        _formData.append('territoire_id',selectedOptionTerritoire);
        _formData.append('secteur_id',selectedOptionSecteur);
        _formData.append('commercial_id',selectedOptionCommercial);
       
        // console.log(_formData);
        setLoadingf(true);
        try {
            axios.post(url.base+'/setting/pointdevente-store',_formData,
            {
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
                // credentials:'include'
            }
            ).then((resp)=>{
                setLoadingf(false);
                if(resp.status == 200){
                    // console.log(resp.data);
                    setErrors({});
                   SwalTopEnd({icon:"success",title:"Enregistrement effectué avec succès"})
                   navigate('/settings/point-de-vente');
                }else{                    
                    SwalTopEnd({icon:"error",title:"Un problème est subvenu !"})
                }
            }).catch((error)=>{                
                setLoadingf(false);
                setErrors(error.response.data.error);
            })
        } catch (error) {
            setLoadingf(false);

        }
    }




return (
    <>
     
        <ContentSection ulShownav={"parametres"} navactive={"pointvente"}>
                    <div class="container-fluid">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-12">
                                
                                    <div class="mb-5">
                                        <h3 class="mb-0"><u>Enregistrer un point de vente</u></h3>

                                    </div>
                                </div>
                            </div>

                    <div>
                    <form onSubmit={submitForm}>
                                <div class="col-lg-2 col-12"></div>
                                <div class="col-lg-8 col-12">

                                <div class="card mb-5">
                                
                                <div class="card-body">
                                
                                    <div class="row" >
                                    
                                    <div class="mb-3 col-6">
                                        <label class="form-label">Nom du PDV</label>
                                        <input type="text" class="form-control" name="NomPdv" onChange={handleChange} value={itemData.NomPdv}/>
                                        {errors && errors.NomPdv && (
                                            <span className="text-danger">{errors.NomPdv[0]}</span>
                                        )}
                                    </div>
                                    
                                    <div class="mb-3 col-6">
                                            <div class="mb-3">
                                                <label class="form-label">Adresse du PDV</label>
                                                <input type="text" class="form-control" name="Address" onChange={handleChange} value={itemData.Address}/>
                                                {errors && errors.Address && (
                                                    <span className="text-danger">{errors.Address[0]}</span>
                                                )}
                                            </div>
                                    </div>
                                    
                                    <div class="mb-4 col-md-6 col-12">
                                    <label class="form-label">Manager</label>
                                        <input type="text" class="form-control" name="ManagerPdv" onChange={handleChange} value={itemData.ManagerPdv}/>
                                        {errors && errors.ManagerPdv && (
                                                    <span className="text-danger">{errors.ManagerPdv[0]}</span>
                                                )}
                                    </div>
                                    
                                    <div class="mb-4 col-md-6 col-12">
                                    <label class="form-label">Conatct</label>
                                        <input type="text" class="form-control" name="Contact" onChange={handleChange} value={itemData.Contact}/>
                                        {errors && errors.Contact && (
                                                    <span className="text-danger">{errors.Contact[0]}</span>
                                                )}
                                    </div>
                                    
                                    
                                    <div class="mb-4 col-md-6 col-12">
                                        <label class="form-label">Canal</label>
                                        <Select value={selectedOptionMarques} options={optioncanals}  onChange={handleChangeCanal} />
                                        {errors && errors.canal_id && (
                                                    <span className="text-danger">{errors.canal_id[0]}</span>
                                        )}
                                    </div>
                                    
                                    <div class="mb-4 col-md-6 col-12">
                                        <label class="form-label">Zone</label>
                                        <Select value={selectedOptionMarques} options={optionzones}  onChange={handleChangeZone} />
                                        {errors && errors.zone_id && (
                                            <span className="text-danger">{errors.zone_id[0]}</span>
                                        )}
                                    </div>

                                    <div class="mb-3 col-6">
                                        <label class="form-label">Territoire</label>
                                        <Select value={selectedOptionMarques} options={optionterritoires}  onChange={handleChangeTerritoire} />
                                        {errors && errors.territoire_id && (
                                            <span className="text-danger">{errors.territoire_id[0]}</span>
                                        )}
                                    </div>

                                    <div class="mb-3 col-6">
                                        <label class="form-label">Secteur</label>
                                        <Select value={selectedOptionMarques} options={optionsecteurs}  onChange={handleChangeSecteur} />
                                        {errors && errors.secteur_id && (
                                            <span className="text-danger">{errors.secteur_id[0]}</span>
                                        )}
                                    </div>

                                    <div class="mb-4 col-md-6 col-12">
                                        <label class="form-label">Nomenclature</label>
                                        <input type="text" class="form-control" name="NomenclatureAGROCI" onChange={handleChange} value={itemData.NomenclatureAGROCI}/>
                                        {errors && errors.NomenclatureAGROCI && (
                                            <span className="text-danger">{errors.NomenclatureAGROCI[0]}</span>
                                        )}
                                    </div>
                                    <div class="mb-4 col-md-3 col-12">
                                        <label class="form-label">Tel (optionnel)</label>
                                        <input type="text" class="form-control" name="Mobile" onChange={handleChange} value={itemData.Mobile}/>
                                        {errors && errors.Mobile && (
                                                    <span className="text-danger">{errors.Mobile[0]}</span>
                                        )}
                                    </div>
                                    <div class="mb-4 col-md-3 col-12">
                                        <label class="form-label">STATUT FINANCE</label>
                                        <select name="StatutFinancier" onChange={handleChange} value={itemData.StatutFinancier} className="form-control">
                                            <option value="">---</option>
                                            <option value="CASH">CASH</option>
                                            <option value="CREDIT">CREDIT</option>
                                        </select>
                                        {errors && errors.StatutFinancier && (
                                                    <span className="text-danger">{errors.StatutFinancier[0]}</span>
                                        )}
                                    </div>

                                    <div class="mb-4 col-md-6 col-12">
                                    <label class="form-label">Latitude</label>
                                        <input type="text" class="form-control" name="latitude" onChange={handleChange} value={itemData.latitude}/>
                                        {errors && errors.latitude && (
                                                    <span className="text-danger">{errors.latitude[0]}</span>
                                                )}
                                    </div>

                                    <div class="mb-4 col-md-6 col-12">
                                    <label class="form-label">Longitude</label>
                                        <input type="text" class="form-control" name="longitude" onChange={handleChange} value={itemData.longitude}/>
                                        {errors && errors.longitude && (
                                                    <span className="text-danger">{errors.longitude[0]}</span>
                                                )}
                                    </div>

                                    <div class="mb-3 col-6">
                                        <label class="form-label">Commercial</label>
                                        <Select options={optionusers}  onChange={handleChangeCommercial} />
                                        {errors && errors.commercial_id && (
                                            <span className="text-danger">{errors.commercial_id[0]}</span>
                                        )}
                                    </div>
                      
                                    <div class="mt-4 d-flex justify-content-end">
                                        {!loadingf && <button type="submit" class="btn btn-primary  form-control">Enregistrer</button>}
                                        {loadingf && <button class="btn btn-primary btn-sm" type="button" disabled>
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Chargement...
                                        </button>}
                                    </div>

                                    </div>
                                </div>
                                </div>
                                    
                                </div>
                                
                                <div class="col-lg-2 col-12"></div>
                                </form>
                    </div>
                            
                            

                        
    
                    </div>

        </ContentSection>  
            
    </>
)
}

export default CreatePdvComponent;