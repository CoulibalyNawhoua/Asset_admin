import { Link, useParams } from "react-router-dom";
import ContentSection from "../../Content";
import { useEffect, useState } from "react";
import moment from "moment";
import BaseUrl from "../../../utils/BaseUrl";
import axios from "axios";
import Swal from "sweetalert2";
import ViewValidate from "../../composants/view_validation";

const url = BaseUrl();
function ViewAffectationTmValidatePage()
{
    const {uuid} = useParams();
    const [askDemande,setAskDemande] = useState([]);
    const [loading,setLoading] = useState(false);
    const [historyList,setHistoryList] = useState([]);



    useEffect(()=>{
        get_view_affectation();
        get_view_affectation_history();
    },[]);

    function get_view_affectation()
    {
        // setLoading(true);
        try {
            axios.get(url.base+'/affectation-demande-view/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                // setLoading(false);
                setAskDemande(resp.data.data);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    function get_view_affectation_history()
    {
        // setLoading(true);
        try {
            axios.get(url.base+'/user-affect-materiel-history/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                // setLoading(false);
                setHistoryList(resp.data.data);
            })
        } catch (error) {
            // setLoading(false);
        }
    }




    const validate_ask_affect=()=>{
        Swal.fire({
            title: 'VALIDATION !',
            text: 'Êtes-vous sûre de vouloir valider cette demande d\'affectation.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText:"NON",
            confirmButtonText: 'OUI',
            cancelButtonColor:"red"
          }).then((result) => {
            setLoading(true);
            if (result.isConfirmed) {
                try {
                    axios.get(url.base+'/affect-validation-to-ask-tm/'+askDemande.id,
                        {
                            headers:{
                                'Content-Type':'application/json',
                                "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                                
                            },
                        }
                    ).then((resp)=>{
                        setLoading(false);

                          Swal.fire(
                              'Validation',
                              'Validation effectuée avec succès !',
                              'success'
                            )
                           
                            get_view_affectation();
                            get_view_affectation_history();
                    })
                } catch (error) {
                    setLoading(false);
                    console.log(error);
                }
  
            
            }
            setLoading(false);
          }); 
    }

    
    return (
        <ContentSection ulShownav={"gest-affectations"} navactive={"affectation-tm"}>
                <ViewValidate
                askDemande={askDemande} 
                historyList={historyList} 
                loading={loading}
                validate_ask_affect={validate_ask_affect}
                get_view_affectation={get_view_affectation}
                get_view_affectation_history={get_view_affectation_history}
                tm_bool={true}
                affect_bool={false}
                status={3}
                />
        </ContentSection>
    )
}

export default ViewAffectationTmValidatePage;  