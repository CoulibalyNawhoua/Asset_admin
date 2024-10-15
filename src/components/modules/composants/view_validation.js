import moment from "moment";
import { useEffect, useState } from "react";
import BaseUrl from "../../utils/BaseUrl";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import SwalTopEnd from "../../utils/swal_top_end";

const url = BaseUrl();
function ViewValidate(
    {
        askDemande,
        historyList,
        loading,
        validate_ask_affect,
        get_view_affectation,
        get_view_affectation_history,
        tm_bool,
        affect_bool,
        status,
        list
    }){
    const [urlImg,setUrlImg] = useState();
    const [subLoading,setSubLoading] = useState(false);
    const [contenuRejet,setContenuRejet] = useState('');
    const [errors, setErrors] = useState({});
    const [categorieList,setCategorieList] = useState([]);
    const [marqueList,setMarqueList] = useState([]);
    const [materielList,setMaterielList] = useState([]);
    const [selectCategorie,setSelectCategorie] = useState(null);
    const [selectMarque,setSelectMarque] = useState(null);
    const [selectMateriel,setSelectMateriel] = useState(null);
    const [error,setError] = useState("");
    const [listMaterielTab,setListMaterielTab] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    const [contratData,setContratData] = useState({
        "contrat_date_debut":"",
        "contrat_date_fin":"",
        "contrat_file":""
    });

    useEffect(()=>{
        setSelectCategorie(askDemande?.categorie?.id)
        get_categorie_materiel();
        // get_marque_materiel();
        get_article_to_affect(askDemande?.categorie?.id)
    },[askDemande,status])

    function get_article_to_affect(categorie_id)
    {
        setIsLoading(true);
        try {
            axios.get(url.base+'/materiels-with-marque-category/?categorie_id='+categorie_id,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                // console.log(resp);
                if(resp.status == 200){
                    setMarqueList(resp.data.data);
                }
                setIsLoading(false);
            })
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    function get_materiel_to_affect(article_id)
    {
        setIsLoading(true);
        try {
            axios.get(url.base+'/materiels-available/'+article_id,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                // console.log(resp);
                if(resp.status == 200){
                    setMaterielList(resp.data.data);
                }
                setIsLoading(false);
            })
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const optioncategories = categorieList?.map((option)=>({
        label : `${option.libelle}`,
        value : `${option.id}`
    }));

    const optionmarques = marqueList?.map((option)=>({
        label : `${option.libelle}`,
        value : `${option.code}`
    }));

    const optionmateriels = materielList?.map((option)=>({
        label : `${option.num_serie}`,
        value : option.id
    }));


    const handleChangeCategorie=(selectOption)=>{
        setError("");
        setSelectCategorie(selectOption.value);
        if(selectMarque !=null && selectOption.value != null){
            get_materiel_to_affect(selectOption.value,selectMarque)
        }else if(selectMarque == null && selectOption.value != null){
            setError("La marque est obligatoire");
        }else{}
    }

    const handleChangeMarque=(selectOption)=>{
        setError("");
        get_materiel_to_affect(selectOption.value)
    
    }

    const handleChangeListMateriel=(option)=>{
        setSelectMateriel(option.value);
        let materiel_choose = materielList.find((materiel)=> materiel.id === option.value);
  
        // console.log(materiel_choose);
      
        if(listMaterielTab.find((list)=> list.materiel_id === materiel_choose.id)){
          console.log("oops")
        }else{
          const itemTable = {
            "materiel_id":materiel_choose.id,
            // "image":materiel_choose.image,
            "marque":materiel_choose?.materiel?.marque?.libelle,
            "num_serie":materiel_choose.num_serie,
            "modele":materiel_choose.materiel?.modele?.libelle,
            "depot_origine_libelle":materiel_choose?.position_materiel[0]?.depot_id !== null ? materiel_choose?.position_materiel[0]?.depot?.name : materiel_choose?.position_materiel[0]?.d_pdv,
            
          }
  
          setListMaterielTab([...listMaterielTab,itemTable]);
        }
      }

      const handleChangeContratData=(e)=>{
        setContratData({
            ...contratData,
            [e.target.name]:e.target.value
        })
      }
      const handleFileChangeContrat=(event)=>{
        setContratData({
            ...contratData,
            [event.target.name]:event.target.files[0]
        });
    }
      const removeItem = (i) => {
        const updatedMat = [...listMaterielTab];
        updatedMat.splice(i, 1);
        setListMaterielTab(updatedMat);
      };


    const open_modal_rejet_affect=()=>{
        
        window.$("#exampleModalCenter").modal('show');
    }
    const open_modal_affect_mat=()=>
        {
            window.$("#exampleModalScrollable").modal('show');
        }
    

    const submitFormRejet=(e)=>{
        e.preventDefault();

        if(contenuRejet !== ""){
            const _formData = new FormData();
            _formData.append('affectation_id',askDemande.id);
            _formData.append('contenu',contenuRejet);
    
    
            setSubLoading(true);
            try {
                axios.post(`${url.base}/affect-materiel-rejete`,_formData,
                {
                    headers:{
                        'Content-Type':'multipart/form-data',
                        "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                        
                    },
                    //  credentials:'include'
                }
                ).then((resp)=>{          
                 setSubLoading(false);
                 
                
                    SwalTopEnd({icon:"success",title:"La demande a été rejeté avec succès!"});
                    window.$("#exampleModalCenter").modal('hide');
                  setErrors({});
                  get_view_affectation();
                  get_view_affectation_history();
              //    fetchRibList();
               
             }).catch((error)=>{
              setSubLoading(false);
                //  setErrors(error.response.data.error);
    
             })
         } catch (error) {
          setSubLoading(false);
            //  console.log(error.response);
         } 
          }else{
          
            SwalTopEnd({icon:"error",title:"Veuillez choisir un motif de rejet."});
          }
    }

    const submitForm=(e)=>{
    e.preventDefault();

    if(selectMateriel !== null){
        const _formData = new FormData();
        _formData.append('affectation_id',askDemande.id);
        _formData.append('materiel_id',selectMateriel);


        setSubLoading(true);
        try {
        axios.post(`${url.base}/affect-materiel-store`,_formData,
        {
            headers:{
                'Content-Type':'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
            //  credentials:'include'
        }
        ).then((resp)=>{          
            setSubLoading(false);
            
            SwalTopEnd({icon:"success",title:"Affectation effectué avec succès"});
            window.$("#exampleModalScrollable").modal('hide');
            setErrors({});
            get_view_affectation();
            get_view_affectation_history();
            
        //    fetchRibList();
            
        }).catch((error)=>{
        setSubLoading(false);
            // setErrors(error.response.data.error);

        })
    } catch (error) {
    setSubLoading(false);
        console.log(error.response);
    } 
    }else{   
        SwalTopEnd({icon:"error",title:"Veuillez choisir un matériel svp !"});
    }
    }


    function get_categorie_materiel()
    {
        try {
            axios.get(url.base+'/setting/category-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setCategorieList(resp.data.data);
                }
                // setLoading(false);
            })
        } catch (error) {
            console.log(error);
            // setLoading(false);
        }
    }
  
    function get_marque_materiel()
    {
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
            console.log(error);
            // setLoading(false);
        }
    }

    function submitEditContrat(e){
    e.preventDefault();
    
    console.log(askDemande.id);
    if(contratData.contrat_date_debut !="" && contratData.contrat_date_fin !="" ){
        const _formData = new FormData();
        _formData.append('contrat_date_debut',contratData.contrat_date_debut);
        _formData.append('contrat_date_fin',contratData.contrat_date_fin);
        _formData.append('affectation_id',askDemande.id);


        setSubLoading(true);
        try {
        axios.post(`${url.base}/edit-contrat-affectation`,_formData,
        {
            headers:{
                'Content-Type':'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
            responseType:'blob',
            //  credentials:'include'
        }
        ).then((resp)=>{          
            setSubLoading(false);

        const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'contrat.docx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Swal.fire({
            //     position: 'top-end',
            //     icon: 'success',
            //     title:  "Transfert enregistré avec succès !",
            //     showConfirmButton: false,
            //     timer: 5000,
            //     toast:true,
            //     position:'top-right',
            //     timerProgressBar:true
            //   });
                window.$("#exampleModalCenteContrat").modal('hide');
            // setErrors({});
            setContratData({
                "contrat_date_debut":"",
                "contrat_date_fin":""
            });

            get_view_affectation();
            get_view_affectation_history();
            
        //    fetchRibList();
            
        }).catch((error)=>{
        setSubLoading(false);
            setErrors(error.response.data.error);

        })
    } catch (error) {
    setSubLoading(false);
        console.log(error.response);
    } 
    }else{
        if(contratData.contrat_date_debut == ""){
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title:  'Veuillez definir la date de debut du contrat',
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
                });
        }else if(contratData.contrat_date_fin == ""){
          
                SwalTopEnd({icon:"error",title:"Veuillez definir la date de clôture du contrat"});
        }
        
    }
    }

    function submitContratTm(e){
    e.preventDefault();
    
    // console.log(askDemande.id);
    if(contratData.contrat_file !="" ){
        const _formData = new FormData();
        _formData.append('contrat_file',contratData.contrat_file);
        _formData.append('affectation_id',askDemande.id);


        setSubLoading(true);
        try {
        axios.post(`${url.base}/affect-validation-to-ask-tm`,_formData,
        {
            headers:{
                'Content-Type':'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                
            },
        //    responseType:'blob',
            //  credentials:'include'
        }
        ).then((resp)=>{          
            setSubLoading(false);

            
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title:  "Le contrat a été soumis avec succès.",
                showConfirmButton: false,
                timer: 5000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
                });
                window.$("#exampleModalCenteContratSoumettre").modal('hide');
            // setErrors({});
                window.$("#filecontrat").val("");

            get_view_affectation();
            get_view_affectation_history();
            
        //    fetchRibList();
            
        }).catch((error)=>{
        setSubLoading(false);
        console.log(error)
        //    setErrors(error.response.data.error);

        })
    } catch (error) {
    setSubLoading(false);
        console.log(error.response);
    } 
    }else{
        if(contratData.contrat_date_debut == ""){
            
                SwalTopEnd({icon:"error",title:"Veuillez ajouter le contrat."});
        }
        
    }
    }

    const Downloadpdf= ()=>{
    // e.preventDefault();
    
    setSubLoading(true);
    
    try {
        axios.get(url.base+'/consult-contrat-affectation/'+askDemande.id,
        {
            headers:{
                'Content-Type':'application/pdf',
                "Authorization": `Bearer ${localStorage.getItem('_token_')}`,
                
            },
            responseType:'blob',
            // credentials:'include'
        }
        ).then((response)=>{
            setSubLoading(false);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'contrat_affectation.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch((error)=>{
            setSubLoading(false);
            console.log(error);
        })
    } catch (error) {
        setSubLoading(false);
        console.log(error);  
    }
    }
  
    return (
        <>
            <div class="row container-fluid">
                            <div className="col-md-2"></div>
                            <div className="col-md-8">
                            <div class="card mb-4 mt-4 mt-xxl-0">
                                <div class="card-header">
                                    <h4 class="mb-3">Detail de la demande d'affectation

                                    {askDemande.statut_contrat == 1 && <button class={!subLoading ? "btn btn-primary ms-2 float-end" : "btn btn-primary ms-2 float-end disabled"} onClick={Downloadpdf}>{!subLoading ? "Consulter le contrat" : "Téléchargement en cours..."}</button>} 

                                    {list !==1 && !tm_bool && askDemande.status == status && !affect_bool &&
                                    <>
                                    <button class="btn btn-danger ms-2 float-end" onClick={()=>open_modal_rejet_affect()}>Rejeter</button>
                                    <button class={!loading ? "btn btn-success ms-2 float-end" : "btn btn-success ms-2 float-end pb-1 disabled"} onClick={()=>validate_ask_affect()}>{!loading ? "Valider" : "En cours..."}</button>
                                    
                                   
                                    </> 
                                    }
                                    {tm_bool && askDemande.status == status &&
                                        <>
                                            {askDemande.statut_contrat == 0 && <button class="btn btn-danger ms-2 float-end" onClick={()=>open_modal_rejet_affect()}>Rejeter</button> }
                                             {askDemande.statut_contrat == 0 && <button class="btn btn-success ms-2 float-end " onClick={()=>{window.$("#exampleModalCenteContrat").modal('show');}}>Editer un contrat</button> }
                                             {askDemande.statut_contrat == 2 && <button class="btn btn-primary ms-2 float-end" onClick={()=>{window.$("#exampleModalCenteContratSoumettre").modal('show');}}>Soumettre le contrat</button> }
                                             
                                        </>
                                    }
                                    {askDemande.status == status && affect_bool &&
                                    <>
                                        <button class="btn btn-danger ms-2 float-end pb-1" onClick={()=>open_modal_rejet_affect()}>Rejeter</button>
                                        <button class="btn btn-primary ms-2 float-end pb-1" onClick={()=>open_modal_affect_mat()}>Affecter un materiel</button>
                                    </>
                                    }
                                    </h4>
                                
                                </div>
                                <div class="card-body">
                                    <ul class="list-unstyled mb-0">
                                        <li class="d-flex justify-content-between mb-3 fw-bold">
                                            <span>Code :</span>
                                            <span>{askDemande.code}</span>

                                        </li>
                                        <li class="d-flex justify-content-between mb-3 fw-bold">
                                            <span>Date de création : </span>
                                            <span>{askDemande.date ? moment(askDemande.date).format('Do MMMM yy HH:mm') : ""}</span>

                                        </li>
                                        <li class="d-flex justify-content-between mb-3 fw-bold">
                                            <span>Statut : </span>
                                            {askDemande.status == 0 && <span class="badge bg-warning">En attente affectation</span>}
                                            {askDemande.status == 1 && <span class="badge bg-warning">En Validation ASM</span>}
                                            {askDemande.status == 2 && <span class="badge bg-warning">En Validation RSM</span>}
                                            {askDemande.status == 3 && <span class="badge bg-warning">Attente retour contrat</span>}
                                            {askDemande.status == 4 && <span class="badge bg-success">A Deployer</span>}                                                        
                                            {askDemande.status == 5 && <span class="badge bg-success">Terminer</span>}                                                        
                                            {askDemande.status == 6 && <span class="badge bg-danger">Rejetée</span>}
                                            {askDemande.status == 7 && <span class="badge bg-info">Deploiement en cours</span>}                                                         

                                        </li>
                                        <li class="d-flex justify-content-between mb-3 fw-bold">
                                            <span>Date de finalisation : </span>
                                            <span >{askDemande?.date_fin ? moment(askDemande?.date_fin).format('Do MMMM yy HH:mm') : ""}</span>

                                        </li>
                                        <li class="d-flex justify-content-between mb-3 fw-bold">
                                            <span>Catégorie : </span>
                                            <span >{askDemande?.categorie?.libelle}</span>

                                        </li>
                                        <li class="d-flex justify-content-between mb-3 fw-bold">
                                            <span>Commercial : </span>
                                            <span >{askDemande?.commercial?.use_nom} {askDemande?.commercial?.use_prenom} ( {askDemande?.commercial?.phone} )</span>

                                        </li>
                                    </ul>
                                    <b><u>Description</u></b><br/>
                                    <span className="card p-2">{askDemande.description}</span>
                                </div>
                            
                            </div>
                            <div class="card mb-4 mt-4 mt-xxl-0">
                                <div class="card-header">
                                    <h4 class="mb-3">Information du point de vente</h4>                        
                                </div>
                                <div class="card-body">
                                    <ul class="list-unstyled mb-0">
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Nom du PDV :</span>
                                        <span>{askDemande.d_pdv}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Manager : </span>
                                        <span>{askDemande.d_pdv_manager}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Contact : </span>
                                        <span>{askDemande.d_contact}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Catégorie de PDV : </span>
                                        <span>{askDemande.d_pdv_categorie}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Adresse : </span>
                                        <span>{askDemande.d_addresse}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Canal : </span>
                                        <span>{askDemande.d_canal}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Zone : </span>
                                        <span>{askDemande.d_zone}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Territoire : </span>
                                        <span>{askDemande.d_territoire}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Secteur : </span>
                                        <span>{askDemande.d_secteur}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Posisition Géographique : </span>
                                        <span>{askDemande.d_latitude} , {askDemande.d_longitude}</span>

                                    </li>
                                    <li class="d-flex justify-content-between mb-3 fw-bold">
                                        <span>Piece justificatif (Recto-verso)  </span>

                                    </li>
                                    <div>
                                    <a onClick={()=>{setUrlImg(`${url.image}/${askDemande?.piece_recto}`);window.$('#exampleModalCente').modal('show')}}><img src={`${url.image}/${askDemande?.piece_recto}`} alt="" class="rounded-3 ms-3 me-2" width="30%" height="150%" /></a>
                                    <a onClick={()=>{setUrlImg(`${url.image}/${askDemande?.piece_verso}`);window.$('#exampleModalCente').modal('show')}}><img src={`${url.image}/${askDemande?.piece_verso}`} alt="" class=" rounded-3"  width="30%" height="150%" /></a>
                                    </div>
                            
                                    </ul>

                                </div>
                            {/* <div class="card-footer">
                                <ul class="list-unstyled mb-0">
                                <li class="d-flex justify-content-between">
                                    <span class="text-dark">Order Total</span>
                                    <span class="text-primary ">$368.00</span>
                                </li>
                                </ul>
                            </div> */}
                            </div>
                            {askDemande?.materiel  &&
                            
                            <div class="row mb-3">
                            <div class="offset-xxl-12 col-xxl-12 col-md-12 col-12">
                            <div class="card" id="invoice">
                                <div class="card-header">
                                    <h4 class="mb-0">Matériel affecté</h4>
                                
                                </div>
                                <div class="card-body">                               
                            
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="table-responsive ">
                                                <table class="table table-centered text-nowrap">
                                                    <thead class="table-info">
                                                        <tr>

                                                        <th scope="col">Materiel</th>
                                                        <th scope="col">Catégorie</th>
                                                        <th scope="col">Marque</th>
                                                        <th scope="col" >N°Serie</th>
                                                        <th scope="col" >Capacités</th>
                                                        {/* <th scope="col">Action</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>

                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                            <a href="#!"><img src={`${url.image}/${askDemande?.materiel?.materiel?.image}`} alt="Image"
                                                                class="img-4by3-md rounded-3" /></a>
                                                            <div class="ms-3">
                                                                <h5 class="mb-0">{askDemande?.materiel?.materiel?.libelle}</h5>                                      
                                                            </div>
                                                            </div>
                                                        </td>
                                                        <td>{askDemande?.materiel?.materiel?.categorie?.libelle}</td>
                                                        <td>{askDemande?.materiel?.materiel?.marque?.libelle}</td>
                                                        <td>
                                                        {askDemande?.materiel.num_serie}
                                                        </td>
                                                        <td>
                                                        {askDemande?.materiel?.materiel?.capacite?.libelle}
                                                        </td>
                                                    </tr>
                                                            
                                                    
                                                        
                                
                                                    </tbody>
                                                    </table>
                                            </div>
                                        
                                        </div>
                                    </div>



                                    </div>
                            </div>


                            </div>
                            </div>
                            }
                       
                       {historyList?.length > 0  &&
                            
                            <div class="row mb-3">
                            <div class="offset-xxl-12 col-xxl-12 col-md-12 col-12">
                            <div class="card" id="invoice">
                                <div class="card-header">
                                    <h4 class="mb-0">Historique de validation</h4>
                                
                                </div>
                                <div class="card-body">                               
                            
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="table-responsive ">
                                                <table class="table table-centered text-nowrap">
                                                    <thead class="table-info ">
                                                        <tr>

                                                        <th scope="col">Etape</th>
                                                        <th scope="col">Date validation</th>
                                                        <th scope="col">Valider par</th>
                                                        <th scope="col" >Action</th>
                                                        <th scope="col">Niveau suivant</th>

                                                        {/* <th scope="col">Action</th> */}
                                                        </tr>
                                                    </thead>
                                                        <tbody>
                                                            {historyList?.map((item,index)=>
                                                            
                                                                <tr key={index}>

                                                                <td className="text-center fw-bold">{index + 1}</td>
                                                                <td className="fw-bold">{moment(item.created_at).format('Do MMMM YYYY H:mm:s')}</td>
                                                                <td className="fw-bold ">{item?.user.use_nom} {item?.user.use_prenom} ( {item?.user.phone} )</td>
                                                                {/* <td>
                                                                {item.status == 1 && <span class="badge bg-success text-white">Terminer</span>}                                                        
                                                                {item.status == 0 && <span class="badge bg-danger text-white">Rejetée</span>}    
                                                                </td> */}
                                                                <td className={item.status == 1 ? "fw-bold text-success" : "fw-bold text-danger"}>{item.contenu}</td>
                                                                <td className="fw-bold text-danger text-center">
                                                                <span class={item?.next_level == "TERMINER"? "badge bg-success" : "badge bg-warning"}>{item?.next_level}</span>
                                                                
                                                                </td>
                                                            </tr>
                                                            
                                                            )}
                                                        </tbody>
                                                </table>
                                            </div>
                                        
                                        </div>
                                    </div>



                                    </div>
                            </div>


                            </div>
                            </div>
                            }
                        </div>
                            <div className="col-md-2"></div>

                        <div>

                  </div>
            </div>

            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <form class="modal-content" onSubmit={submitFormRejet}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Motif de rejet</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label" for="textInput">Selectionner un matériel </label>
                                <select className="form-control" onChange={(e)=>setContenuRejet(e.target.value)}>
                                    <option value="" selected>---</option>
                                    <option value="Insuffisance de matériel">Insuffisance de matériel</option>
                                    <option value="Information PDV incomplète">Information PDV incomplète</option>
                                    <option value="La zone n'est pas pris en compte">La zone n'est pas pris en compte</option>
                                    <option value="PDV non conforme">PDV non conforme</option>
                                </select>
                            </div>                   
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            <button type="submit" class={subLoading ? "btn btn-primary disabled" : "btn btn-primary"}>Valider</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="modal fade" id="exampleModalCente" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Pièce justif</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <img src={urlImg} alt="" class="rounded-3 ms-3 me-2" width="100%" height="150%" />
                        </div>
                    </div>
                    {/* <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                    </div> */}
                </div>
                </div>
            </div>

            <div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <form class="modal-content" onSubmit={submitForm}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalScrollableTitle">Affecter un matériel </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                    
                                <div class="modal-body">
                                <div className="row">
                                    {/* <div class="mb-3 col-6">
                                        <label class="form-label" for="textInput">Catégorie de matériel {error !== "" && selectCategorie == null && <span className="text-danger">{error}</span>}</label>
                                        <Select options={optioncategories} onChange={handleChangeCategorie}/>
                                    
                                    </div> */}
                                    <div class="mb-3 col-12">
                                        <label class="form-label" for="textInput">Selectionner un article {error !== "" && selectMarque == null && <span className="text-danger">{error}</span>}</label>
                                        <Select options={optionmarques} onChange={handleChangeMarque}/>
                                    
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="textInput">Selectionner un matériel (Resultat : <b className="text-danger">{materielList?.length}</b>) {isLoading && <span className="text-success">En Chargement...</span>}</label>
                                    <Select options={optionmateriels} onChange={handleChangeListMateriel} isDisabled={listMaterielTab.length > 0 ? true : false}/>
                                
                                </div>

                                <div class="row">
                                        <div class="col-12">
                                            <div class="table-responsive ">
                                                <table class="table table-centered text-nowrap">
                                                    <thead class="table-info ">
                                                        <tr>

                                                        <th scope="col">Marque</th>
                                                        <th scope="col">Modele</th>
                                                        <th scope="col">Dépôt</th>
                                                        <th scope="col">N°Serie</th>
                                                        <th scope="col">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        
                                                    {listMaterielTab && 
                                                            listMaterielTab.map((item,index)=>
                                                            <tr key={index}>
                                                                <td>
                                                                    <div class="d-flex align-items-center">
                                                                    {/* <a href="#!"><img src={`${url.image}/${item.image}`} alt="Image"
                                                                        class="img-4by3-md rounded-3" /></a> */}
                                                                    <div class="ms-3">
                                                                        <h5 class="mb-0">{item.marque}</h5>                                      
                                                                    </div>
                                                                    </div>
                                                                </td>

                                                                <td>{item.modele}</td>
                                                                <td>
                                                                {item.depot_origine_libelle}
                                                                </td>
                                                                <td>
                                                                {item.num_serie}
                                                                </td>
                                                                <td className="text-center">
                                                                    <button type="button" className="btn btn-danger btn-sm " onClick={()=>removeItem(index)}> <i className="fa fa-trash"></i> </button>
                                                                </td>
                                                            </tr>
                                                            )
                                                        }
                                                    
                                                        
                                
                                                    </tbody>
                                                    </table>
                                            </div>
                                        
                                        </div>
                                    </div>
                                
                                </div>
                            
                        
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            {!subLoading && <button type="submit" class={listMaterielTab.length > 0  ? "btn btn-primary" : "btn btn-primary disabled"} >Valider l'affectation</button> }
                            {subLoading && <button type="button" class="btn btn-primary disabled">En Chargement...</button> }
                        </div>
                    </form>
                </div>
            </div>

            <div class="modal fade" id="exampleModalCenteContrat" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">
                <form class="modal-content" onSubmit={submitEditContrat}>
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Obtenir un contrat</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"></span>
                    </button>
                    </div>
                    <div class="modal-body">
                        <div className="row">
                            <div class="mb-3 col-md-6">
                                    <label class="form-label" for="textInput">Date debut du contrat</label>
                                    <input type="date" className="form-control" name="contrat_date_debut" onChange={handleChangeContratData} value={contratData.contrat_date_debut}/>
                            </div>  
                            <div class="mb-3 col-md-6">
                                    <label class="form-label" for="textInput">Date de clotûre</label>
                                    <input type="date" className="form-control" name="contrat_date_fin" onChange={handleChangeContratData} value={contratData.contrat_date_fin}/>
                            </div>  
                        </div>
                            
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="submit" class={!subLoading ? "btn btn-primary" : "btn btn-primary disabled"}>{!subLoading ? "Télécharger un nouveau contrat" : "Téléchargement en cours ..."}</button>
                    </div>
                </form>
                </div>
            </div>

            <div class="modal fade" id="exampleModalCenteContratSoumettre" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">
                <form class="modal-content" onSubmit={submitContratTm}>
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Soumettre le contrat</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"></span>
                    </button>
                    </div>
                    <div class="modal-body">
                        <div className="row">                           
                            <div class="mb-3 col-md-12">
                                    <label class="form-label" for="textInput">Veuillez Uploader le contrat ici</label>
                                    <input type="file" className="form-control" id="filecontrat" name="contrat_file" onChange={handleFileChangeContrat} accept="application/pdf"/>
                            </div>  
                        </div>
                            
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="submit" class={!subLoading ? "btn btn-primary" : "btn btn-primary disabled"}>{!subLoading ? "Enregister le contrat" : "Enregistrement en cours..."}</button>
                    </div>
                </form>
                </div>
            </div>
        </>
    )
}

export default ViewValidate;