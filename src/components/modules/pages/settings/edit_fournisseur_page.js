import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import BaseUrl from "../../../utils/BaseUrl";
import ContentSection from "../../Content";
import { useNavigate, useParams } from "react-router-dom";
import SwalTopEnd from "../../../utils/swal_top_end";

const url = BaseUrl();
function EditFournisseurComponent(){
    const {uuid} = useParams();
    const navigate = useNavigate();
    const [errors,setErrors] = useState({});
    const [errorMarque,setErrorMarque] = useState(null);
    const [loadingf, setLoadingf] = useState(false);
    const [itemData,setItemData] = useState({
        "name":"",
        "desciption":"",
        "siege":"",
        "adresse":"",
        "tel":"",
        "email":"",
    });

    const [marqueList,setMarqueList] = useState([]);
    const [selectedOptionMarques, setSelectedOptionMarques] = useState([]);
    const [itemsList,setItemsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        get_fournisseur();
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

    function get_fournisseur(){
        try {
            axios.get(url.base+'/fournisseur-view/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setItemsList(resp.data.data);

                    setItemData({
                        "name":resp.data.data.name,
                        "desciption":resp.data.data.desciption,
                        "siege":resp.data.data.siege,
                        "adresse":resp.data.data.adresse,
                        "tel":resp.data.data.tel,
                        "email":resp.data.data.email,
                    });

                    setSelectedOptionMarques(resp.data.marques)
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

    const handleChangeMarque=(selectedOption)=>{
        setSelectedOptionMarques(selectedOption.map(option => option.value));
      }

      const options = marqueList?.map((item)=>({
        value: item.id,
        label:`${item.libelle}`
      }));

    const submitForm= (e)=>{
        e.preventDefault();

        const _formData = new FormData();
        _formData.append('name',itemData.name);
        _formData.append('desciption',itemData.desciption);
        _formData.append('siege',itemData.siege);
        _formData.append('adresse',itemData.adresse);
        _formData.append('tel',itemData.tel);
        _formData.append('email',itemData.email);
        _formData.append('marqueTab',selectedOptionMarques);
       
        // console.log(_formData);
        setLoadingf(true);
        try {
            axios.post(url.base+'/fournisseur-update/'+itemsList.id,_formData,
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
                    SwalTopEnd({icon:"success",title:"Modification effectué avec succès."})
                      setItemData({
                        "name":"",
                        "desciption":"",
                        "siege":"",
                        "adresse":"",
                        "tel":"",
                        "email":"",
                    });
                    setSelectedOptionMarques(null);
                    navigate("/settings/fournisseurs");
                }else{
                    SwalTopEnd({icon:"error",title:"Un problème est subvenu."})
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
     
          <ContentSection ulShownav={"parametres"} navactive={"fournisseur"}>
          <div class="row">
              <form class="col-xl-9 col-md-12 col-12" onSubmit={submitForm}>
              
                <div class="card mb-5">
                 
                  <div class="card-body">
                 
                    <div class="row" >
                      
                      <div class="mb-3 col-12">
                        <label class="form-label">Nom du fournisseur</label>
                        <input type="text" class="form-control" name="name" onChange={handleChange} value={itemData.name}/>
                        {errors && errors.name && (
                            <span className="text-danger">{errors.name[0]}</span>
                        )}
                      </div>
                      
                      <div class="mb-3 col-12">
                            <div class="mb-3">
                                <label for="textarea-input" class="form-label">Description du fournisseur</label>
                                <textarea class="form-control" id="textarea-input" rows="2" name="desciption" onChange={handleChange} value={itemData.desciption}></textarea>
                                {errors && errors.desciption && (
                                    <span className="text-danger">{errors.desciption[0]}</span>
                                )}
                            </div>
                       </div>
                      
                      <div class="mb-4 col-md-6 col-12">
                      <label class="form-label">Ville</label>
                        <input type="text" class="form-control" name="siege" onChange={handleChange} value={itemData.siege}/>
                        {errors && errors.siege && (
                                    <span className="text-danger">{errors.siege[0]}</span>
                                )}
                      </div>
                      
                      <div class="mb-4 col-md-6 col-12">
                      <label class="form-label">Adresse</label>
                        <input type="text" class="form-control" name="adresse" onChange={handleChange} value={itemData.adresse}/>
                        {errors && errors.adresse && (
                                    <span className="text-danger">{errors.adresse[0]}</span>
                                )}
                      </div>
                      
                      
                      <div class="mb-4 col-md-6 col-12">
                      <label class="form-label">E-mail</label>
                        <input type="text" class="form-control" name="email" onChange={handleChange} value={itemData.email}/>
                        {errors && errors.email && (
                                    <span className="text-danger">{errors.email[0]}</span>
                                )}
                      </div>
                    
                      <div class="mb-4 col-md-6 col-12">
                        <label class="form-label">Contacts</label>
                        <input type="text" class="form-control" name="tel" onChange={handleChange} value={itemData.tel}/>
                        {errors && errors.tel && (
                                    <span className="text-danger">{errors.tel[0]}</span>
                                )}
                      </div>

                      <div class="mb-3 col-12">
                        <label class="form-label">Marques associées</label>
                        <Select 
                            options={options}  
                            onChange={handleChangeMarque} 
                            value={options.filter(obj => selectedOptionMarques?.includes(obj.value))}
                            defaultValue={options.filter(obj => selectedOptionMarques?.includes(obj.value))}
                            isMulti 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 d-flex justify-content-end">
                {!loadingf && <button type="submit" class="btn btn-primary btn-sm">Enregistrer</button>}
                {loadingf && <button class="btn btn-primary btn-sm" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Chargement...
                </button>}
                </div>
              </form>

            </div>
          </ContentSection>

        </>
    )
}

export default EditFournisseurComponent;