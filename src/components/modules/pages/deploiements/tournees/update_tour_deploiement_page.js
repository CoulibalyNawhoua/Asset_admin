import { useContext, useEffect, useState } from "react";
import Select from 'react-select';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../../../utils/BaseUrl";
import ContentSection from "../../../Content";
import SwalTopEnd from "../../../../utils/swal_top_end";
import { DragDropContext, Droppable , Draggable } from "react-beautiful-dnd";
import moment from "moment";
import { UserContext } from "../../../../utils/User_check";
import can from "../../../../utils/Can";

const url = BaseUrl();
function UpdateTourneeDeploiementPage(){
    const navigate = useNavigate();

    const {uuid} = useParams();
    const [materielItems,setMaterielItems]=useState([]);
    const [vehiculeItems,setVehiculeItems] = useState([]);
    const [selectVehicule,setSelectVehicule] = useState(null);
    const [livreurs,setLivreurs] = useState([]);
    const [territoires,setTerritoires] = useState([]);
    const [selectLivreur,setSelectLivreur] = useState(null);
    const [selectOptionterritoire,setSelectionTerritoire] = useState(null);
    const [depots,setDepots] = useState([]);
    const [loading,setLoading]= useState(false);
    const [errors, setErrors] = useState({});
    const [error,setError] = useState();
    const [territoireCheck,setTerritoireCheck] = useState('');
    const [listMaterielTab,setListMaterielTab] = useState([]);
    const [date_transfert,setDateTransfert] = useState('');
    const [transfertItem,setTransfertItem] = useState([]);
  
    const {user,permissions} = useContext(UserContext);
    useEffect(()=>{
    if(!can(permissions,'add-update-tournee')){
        navigate('/tableau-de-bord');
    }
    },[user,permissions]);


    useEffect(()=>{
      fetchItemMateriels();
      fetchItemVehicules();
      LivreurFunctionList();
      TerritoireFunctionList();
      getTransfertItem();
    },[]);

    const getTransfertItem=()=>{
      try {
          axios.get(url.base+'/materiel-deploiement-tournee-view/'+uuid,{
              headers:{
                  'Content-Type':'application/json',
                  "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                  
              },
          }).then((resp)=>{
            // console.log(resp.data.data);
            // console.log(resp.data.data?.tournee?.livreur_id);
              setTransfertItem(resp.data.data);
              setSelectVehicule(resp.data?.data?.vehicule_id);
              setSelectLivreur(resp.data?.data?.livreur_id);
              setDateTransfert(moment(resp.data?.data?.date).format('YYYY-MM-DD'));

              const transArray = [];
              resp.data?.deploiements?.forEach(item => { 
                transArray.push({
                  "deploiement_id":item.id,
                  "materiel":`${item.affectation?.materiel?.materiel?.libelle} ${item?.affectation?.categorie?.libelle} ${item.affectation?.materiel?.materiel?.marque?.libelle} ${item?.affectation?.materiel?.materiel?.modele?.libelle}`,
                  "affectation_id":item.affectation?.id,
                  "affectation":item.affectation?.code,
                  "pdv":`${item.affectation?.d_pdv}-${item.affectation?.d_contact}-${item.affectation?.d_addresse}`,
                  "territoire":`${item.affectation?.d_territoire}`,
                  "depot_origine_libelle":item.affectation?.materiel?.position_materiel[0]?.depot?.name,
                })
              });
              setListMaterielTab(transArray);
              // setLoading(false);
          })
      } catch (error) {
          // setLoading(false);
      }
    }
    const fetchItemMateriels = ()=>{
      setLoading(true);
      try {
        axios.get(url.base+'/affect-materiel-a-deployer',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{
          setLoading(false);
                setMaterielItems(resp.data.data);
        })
      } catch (error) {
        setLoading(false);
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

    const LivreurFunctionList=()=>{
      try {
        axios.get(url.base+'/users-livreurs-list',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

              if(resp.status == 200){
                setLivreurs(resp.data.data);
              }
          })
      } catch (error) {
        console.log(error);
      }
     
    }

    const TerritoireFunctionList=()=>{
      try {
        axios.get(url.base+'/setting/territoire-list',{
            headers:{
                'Content-Type':'application/json',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        }).then((resp)=>{

              if(resp.status == 200){
                  setTerritoires(resp.data.data);
              }
          })
      } catch (error) {
        console.log(error);
      }
     
    }

    const handleOnDragEnd = (result) => {

      if (!result.destination) return;
  
      const items = Array.from(listMaterielTab);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      // console.log(items);
      setListMaterielTab(items);
    };


    const optionvehicules = vehiculeItems?.map((option)=>({
      label:option.libelle,
      value:option.id
    }));

    const optionmateriels = materielItems?.map((option)=>({
      label:`${option.code} / ${option.d_pdv}-${option.d_contact}-${option.d_addresse} / ${option?.materiel?.materiel?.libelle}-${option?.categorie?.libelle}-${option?.materiel?.materiel?.marque?.libelle}-${option?.materiel?.materiel?.modele?.libelle}`,
      value:option.code
    }));

    const optiondepots = depots?.map((option)=>({
      label:`${option.name}`,
      value:option.id
    }));

    const optionterritoire = territoires?.map((option)=>({
      label:`${option.libelle}`,
      value:`${option.id}`
    }));

    const optionlivreurs = livreurs?.map((option)=>({
      label:`${option.use_nom} ${option.use_prenom}`,
      value:option.id
    }));


    const handleChangeSelectTerritoire=(selectOption)=>{
      setTerritoireCheck(selectOption.label);
      // fetchItemMateriels(selectOption.value);
      setSelectionTerritoire(selectOption.value);
    }

    const handleChangeVehicule=(selectOption)=>{
      setSelectVehicule(selectOption.value);
    }

    const handleChangeListMateriel=(option)=>{
      let materiel_choose = materielItems.find((materiel)=> materiel.code === option.value);
      console.log(materiel_choose);
      if(listMaterielTab.find((list)=> list.affectation_id === materiel_choose.id)){
        console.log("oops")
      }else{
        const itemTable = {
          "ordre_deploiement":"",
          "materiel":`${materiel_choose.materiel?.materiel?.libelle}-${materiel_choose?.categorie?.libelle}-${materiel_choose.materiel?.materiel?.marque?.libelle}-${materiel_choose?.materiel?.materiel?.modele?.libelle}`,
          // "image":materiel_choose.materiel.image,
          "affectation_id":materiel_choose.id,
          "affectation":materiel_choose.code,
          "pdv":`${materiel_choose.d_pdv}-${materiel_choose.d_contact}-${materiel_choose.d_addresse}`,
        //   "categorie":materiel_choose.categorie?.libelle,
        //   "marque":materiel_choose.marque?.libelle,
        //   "depot_origine_id":materiel_choose.depot?.id,
          "depot_origine_libelle":materiel_choose.materiel?.position_materiel[0]?.depot?.name,
        //   "depot_final_id":""
          
        }

        setListMaterielTab([...listMaterielTab,itemTable]);
      }
    }

    const handleChangeChooseOriginDepot=(value,i)=>{
      const updatedMat = [...listMaterielTab];

      if(value !==""){
        if(updatedMat[i].depot_final_id == value){
          window.$(`#depot_origine${i}`).val("");
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title:  'Avertissement ! ce depot est la destination',
            showConfirmButton: false,
            timer: 3000,
            toast:true,
            position:'top-right',
            timerProgressBar:true
          });
        }else{
          updatedMat[i].depot_origine_id = value;
  
          setListMaterielTab(updatedMat);
        }
      }



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

    const handleChangeSelectLivreur=(selectOption)=>{
      setSelectLivreur(selectOption.value);
    }

    const removeItem = (i) => {
      const updatedMat = [...listMaterielTab];
      updatedMat.splice(i, 1);
      setListMaterielTab(updatedMat);
    };

    const submitForm=(e)=>{
      e.preventDefault();

      if(date_transfert !== "" && selectVehicule !== null && selectLivreur !== null ){
        const _formData = new FormData();
        _formData.append('date',date_transfert);
        _formData.append('vehicule_id',selectVehicule);
        _formData.append('livreur_id',selectLivreur);
        // _formData.append('territoire_id',selectOptionterritoire);
        _formData.append('items_lists',JSON.stringify(listMaterielTab));


        setLoading(true);
        try {
          axios.post(`${url.base}/update-deploiement-tournee/${uuid}`,_formData,
         {
             headers:{
                 'Content-Type':'multipart/form-data',
                 "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                 
             },
            //  credentials:'include'
         }
         ).then((resp)=>{          
             setLoading(false);
             SwalTopEnd({icon:"success",title:"Tournée enregistré avec succès !"});

              navigate('/tournee-deploiements-list');
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
        if(date_transfert == "")
        {
          SwalTopEnd({icon:"error",title:"La date est obligatoire"});
        }else if(selectVehicule == null)
          { SwalTopEnd({icon:"error",title:"Veuillez choisir un vehicule"});}
          else if(selectOptionterritoire ==null)
            {
              SwalTopEnd({icon:"error",title:"Le territoire est obligatoire"});
            }else if(selectLivreur == null){
              SwalTopEnd({icon:"error",title:"Veuillez choisir un livreur"});
            }
      }
    }




    return (
        <>
            <ContentSection ulShownav={"tournees"} navactive={"tournee_list"}>
            <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
              <div class="mb-5">
                <h3 class="mb-0 ">Modifier la tournée</h3>

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
                        <label className="form-label">Date prévue</label>
                        <input type="date" className="form-control" onChange={(e)=>setDateTransfert(e.target.value)} value={date_transfert} />
                      
                    </div>
                    <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                              <label className="form-label">Vehicule</label>
                              <Select 
                              options={optionvehicules} 
                              value={optionvehicules.find(option => option.value === selectVehicule)}
                              defaultValue={[{label: selectVehicule == selectVehicule ? optionvehicules.find(obj => obj.value === selectVehicule) : ""}]}
                              placeholder="Choisissez un vehicule" 
                              onChange={handleChangeVehicule}
                              />
                      
                    </div>

                    {/* <div className="mb-3  col-md-6 col-lg-6 col-sm-6">
                              <label className="form-label">Territoire</label>
                              <Select placeholder="Veuillez choisir un territoire" options={optionterritoire} onChange={handleChangeSelectTerritoire}/>                      
                    </div> */}

                    <div className="mb-3 col-md-6 col-lg-6 col-sm-12">
                          <label className="form-label">Livreur</label>
                          <Select 
                          value={optionlivreurs.find(option => option.value === selectLivreur)}
                          defaultValue={[{label: selectLivreur == selectLivreur ? optionlivreurs.find(obj => obj.value === selectLivreur) : ""}]}
                          placeholder="Choisissez un livreur" 
                          options={optionlivreurs} 
                          onChange={handleChangeSelectLivreur}
                          />                      
                    </div>
                      <hr/>
                      <h6 className="text-danger fw-bold"><i className="fa-solid fa-circle-info"></i> Modifier l'ordre de deploiement</h6>
                    {/* <div className="mb-3  col-md-12 col-lg-12 col-sm-12">
                          <label className="form-label"> Liste affectations  {!loading ? <b>En attente {territoireCheck} : {materielItems.length} </b>: <span>Chargement en cours...</span>}</label>
                          <Select placeholder="Veuillez choisir un matériel" options={optionmateriels} onChange={handleChangeListMateriel}/>                      
                    </div> */}
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="droppable-table" type="group" key={listMaterielTab.length}>
                            {(provided) => (
                                <div class="table-responsive" {...provided.droppableProps} ref={provided.innerRef}>                  
                                          <table class="table table-centered text-nowrap mb-0 table-striped" >
                                          <thead class="table-light">
                                            <tr>
                  
                                              <th className="text-center bg-warning">N° ORDRE</th>
                                              <th className="text-center bg-warning">CODE</th>
                                              <th className="bg-warning">TERRITOIRE PDV</th>
                                              <th className="bg-warning">PDV</th>
                                              <th className="text-center bg-warning">MATERIEL</th>
                                              <th className="text-center bg-warning">DEPOT ACTUEL</th>  
                                              {/* <th className="w-50">Dépot de destination</th> */}
                                              {/* <th className="text-center bg-warning">Action</th> */}
                                            </tr>
                                          </thead>

                                                  <tbody >
                                                    {listMaterielTab?.map((item,index)=>(
                                                            <Draggable key={`${item.affectation}`} draggableId={`${item.affectation}`} index={index}>
                                                            {(provided) => (
                                                            <tr 
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <td className="text-center fw-bold">{index+1}</td>
                                                                <td className="text-center">{item.affectation}</td>
                                                                <td>{item.territoire}</td> 
                                                                <td>{item.pdv}</td> 
                                                                  
                                                                <td>
                                                                  <div class="d-flex align-items-center">
                                                                    {/* <a href="#!"><img src={`${url.image}/${item.image}`} alt="Image"
                                                                        class="img-4by3-md rounded-3" /></a> */}
                                                                    <div class="ms-3">
                                                                      <h5 class="mb-0">{item.materiel}</h5>                                      
                                                                    </div>
                                                                  </div>
                                                                </td>
                              
                                                                <td>{item.depot_origine_libelle}</td>                    
                                                                                   
                                                                {/* <td className="text-center">
                                                                  <button type="button" className="btn btn-danger btn-sm ps-1" onClick={()=>removeItem(index)}> <i className="fa fa-trash"></i> </button>
                                                                </td> */}
                                                            </tr>
                                                            )}
                                                          </Draggable>
                                                    ))}
                                                      {provided.placeholder}
                                                  </tbody>
                                              
                                        </table>
                                    
                                
                              
                              </div>
                             )}
                    </Droppable>
                 </DragDropContext>
                   {!loading && listMaterielTab.length > 0 && <button type="submit" className="btn btn-primary" >Modifier la tournée</button>}
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

export default UpdateTourneeDeploiementPage;