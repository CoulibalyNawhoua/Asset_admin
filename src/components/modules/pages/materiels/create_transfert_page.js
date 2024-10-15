import { useContext, useEffect, useState } from "react";
import ContentSection from "../../Content";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import Swal from "sweetalert2";
import SwalTopEnd from '../../../utils/swal_top_end';
import { UserContext } from "../../../utils/User_check";
import can from "../../../utils/Can";

const url = BaseUrl();
function CreateTransfertPage(){
    // const navigate = useNavigate();

    const [materielItems,setMaterielItems]=useState([]);
    const [vehiculeItems,setVehiculeItems] = useState([]);
    const [selectVehicule,setSelectVehicule] = useState('');
    const [selectArticle,setSelectArticle] = useState(null);
    const [selectDepot,setSelectDepot] = useState(null);

    const [depots,setDepots] = useState([]);
    const [loading,setLoading]= useState(false);
    const [errors, setErrors] = useState({});
    const [error,setError] = useState();

    const [listMaterielTab,setListMaterielTab] = useState([]);
    const [date_transfert,setDateTransfert] = useState('');
    const [articles,setArticlesList] = useState([]);
    const {user,permissions} = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!can(permissions,'add-transfert')){
            navigate('/tableau-de-bord');
        }
    },[user,permissions]);

    useEffect(()=>{
      // fetchItemMateriels();
      fetchItemVehicules();
      depotFunctionList();
      materiel_list();
    },[]);

    const fetchItemMateriels = (code)=>{
      try {
        axios.get(url.base+'/materiels-available/'+code,{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

                setMaterielItems(resp.data.data);
        })
      } catch (error) {
        console.log(error);
      }
    }

    const fetchItemVehicules= ()=>{
      try {
        axios.get(url.base+'/vehicule-available',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

                setVehiculeItems(resp.data.data);
        })
      } catch (error) {
        console.log(error);
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
    
    function materiel_list(){
      // setLoading(false);
      try {
          axios.get(url.base+'/materiels-list',{
              headers:{
                  'Content-Type':'application/json',
                  "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                  
              },
          }).then((resp)=>{               
            setArticlesList(resp.data.data);  
              // setLoading(false);
          })
      } catch (error) {
          // setLoading(false);
      }
  }


    const optionvehicules = vehiculeItems?.map((option)=>({
      label:option.libelle,
      value:option.id
    }));

    const optionmateriels = materielItems?.map((option)=>({
      label:option.num_serie,
      value:option.id
    }));

    const optiondepots = depots?.map((option)=>({
      label:`${option.name}`,
      value:option.id
    }));

    const optionarticles = articles?.map((option)=>({
      label:`${option.libelle}`,
      value:option.code
    }));

    const handleChangeVehicule=(selectOption)=>{
      setSelectVehicule(selectOption.value);
    }

    const handleChangeArticle=(selectOption)=>{
      fetchItemMateriels(selectOption.value);
      setSelectArticle(selectOption.value);
    }

    const handleChangeListMateriel=(option)=>{
      let materiel_choose = materielItems.find((materiel)=> materiel.id === option.value);
      // console.log(materiel_choose?.position_materiel[0]?.depot?.id,selectDepot);
    
      if(listMaterielTab.find((list)=> list.stock_materiel_id === materiel_choose.id)){
        console.log("oops")
      }else{
        if(materiel_choose?.position_materiel[0]?.depot?.id !== selectDepot)
        {
          const itemTable = {
            "stock_materiel_id":materiel_choose.id,
            "qrcode":materiel_choose.qrcode_path,
            "num_serie":materiel_choose.num_serie,
            "categorie":materiel_choose.materiel?.categorie?.libelle,
            "marque":materiel_choose.materiel?.marque?.libelle,
            "modele":materiel_choose.materiel?.modele?.libelle,
            "depot_origine_libelle":materiel_choose?.position_materiel[0]?.depot_id !==null ? materiel_choose?.position_materiel[0]?.depot?.name : materiel_choose?.position_materiel[0]?.d_pdv,
            "depot_id":materiel_choose?.position_materiel[0]?.depot?.id,
            
          }
          // console.log(itemTable);
          setListMaterielTab([...listMaterielTab,itemTable]);
        }else{
          SwalTopEnd({icon:"error",title:"Ce matériel ne peux être pris en compte."})
        }
        

      }
    }

    const handleChangeDepot=(selectOption)=>{
      setSelectDepot(selectOption.value);
    }

    const handleChangeChooseFinalDepot=(value,i)=>{
      const updatedMat = [...listMaterielTab];
      if(value !==""){
        if(updatedMat[i].depot_origine_id == value){
          window.$(`#depot_final${i}`).val("");
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title:  'Avertissement ! ce depot a deja été choisi',
            showConfirmButton: false,
            timer: 3000,
            toast:true,
            position:'top-right',
            timerProgressBar:true
          });
        }else{
          updatedMat[i].depot_final_id = value;

          setListMaterielTab(updatedMat);
        }
    }

    }

    const removeItem = (i) => {
      const updatedMat = [...listMaterielTab];
      updatedMat.splice(i, 1);
      setListMaterielTab(updatedMat);
    };

    const submitForm=(e)=>{
      e.preventDefault();

      if(selectDepot !== null && selectArticle !==null){
        const _formData = new FormData();
        _formData.append('depot_id',selectDepot);
        _formData.append('materiel_id',selectArticle);
        _formData.append('items_lists',JSON.stringify(listMaterielTab));


        setLoading(true);
        try {
          axios.post(`${url.base}/transfert-materiels-create`,_formData,
         {
             headers:{
                 'Content-Type':'multipart/form-data',
                 "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                 
             },
            //  credentials:'include'
         }
         ).then((resp)=>{          
             setLoading(false);
       
              SwalTopEnd({icon:"success",title:"Le transfert a ete enregistré avec succès"});
              navigate('/materiels/tranfert-list');
            
              setErrors({});
            
          //    fetchRibList();
           
         }).catch((error)=>{
             setLoading(false);
             setError(error.response.data.message);
             setErrors(error.response.data.error);

         })
     } catch (error) {
      setLoading(false);
         console.log(error.response);
     } 
      }else{
       if(selectDepot == null){ SwalTopEnd({icon:"error",title:"Veuillez choisir le depot"})};
       if(selectArticle == null){ SwalTopEnd({icon:"error",title:"Veuillez choisir un article"})};
      }
    }




    return (
        <>
            <ContentSection ulShownav={"managements"} navactive={"transfert-mat"}>
                <div class="container-fluid">
                    <div class="row">
                      <div class="col-lg-12 col-md-12 col-12">
                        <div class="mb-5">
                          <h3 class="mb-0 ">Transfert depôt à depôt</h3>

                        </div>
                      </div>
                    </div>
                    <div>

                      <div class="row">
                      <div class="col-xxl-12 col-12">
                          <div class="card mb-4 mt-4 mt-xxl-0">
                            <div class="card-header">
                              <form class="row g-2" onSubmit={submitForm}>
                              
                              {/* <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                                  <label className="form-label">Date de transfert</label>
                                  <input type="date" className="form-control" onChange={(e)=>setDateTransfert(e.target.value)}  />
                                
                              </div> */}
                              <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                                    <label className="form-label">Dépot destinataire</label>
                                    <Select placeholder="Selectionner un depôt" options={optiondepots} onChange={handleChangeDepot}/>                                
                              </div>

                              <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                                    <label className="form-label">Articles</label>
                                    <Select placeholder="Selectionner un article" options={optionarticles} onChange={handleChangeArticle}/>                                
                              </div>

                              <div className="mb-3  col-md-12 col-lg-12 col-sm-12">
                                    <label className="form-label">Selectionnez un matériel</label>
                                    <Select placeholder="Veuillez choisir un matériel" options={optionmateriels} onChange={handleChangeListMateriel}/>                                
                              </div>

                                <div class="table-responsive ">
                                <table class="table table-centered text-nowrap mb-0">
                                  <thead class="table-light">
                                    <tr>

                                      <th>ID</th>
                                      <th>Matériels (NUM SERIE)</th>
                                      <th>Catégorie</th>
                                      <th>Marque</th>
                                      <th>Modele</th>
                                      <th>Dépot Actuel</th>
                                      <th className="text-center">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {listMaterielTab && 
                                      listMaterielTab.map((item,index)=>
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            {/* <td>
                                              <div class="d-flex align-items-center">
                                                    <img src={`${url.image}/${item.qrcode}`} alt="Image" width={100}/>
                                                <div class="ms-3">
                                                  <h5 class="mb-0">{item.libelle}</h5>                                      
                                                </div>
                                              </div>
                                            </td> */}

                                            <td>{item.num_serie}</td>
                                            <td>{item.categorie}</td>
                                            <td>{item.marque}</td>
                                            <td>{item.modele}</td>
                                            <td>{item?.depot_origine_libelle}</td>
                                            <td className="text-center">
                                              <button type="button" className="btn btn-danger btn-sm ps-1" onClick={()=>removeItem(index)}> <i className="fa fa-trash"></i> </button>
                                            </td>
                                        </tr>
                                      )
                                    }
                                  
                                  


                                  </tbody>
                                </table>
                              </div>
                            {!loading && listMaterielTab.length > 0 && <button type="submit" className="btn btn-primary" >Enregistrer le transfert</button>}
                            {loading && listMaterielTab.length > 0 && <button className="btn btn-primary " type="button" disabled>
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

export default CreateTransfertPage;