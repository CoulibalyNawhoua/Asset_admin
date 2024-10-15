import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import { useEffect, useState } from "react";
import ContentSection from "../../Content";
import moment from "moment";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import ViewValidate from "../../composants/view_validation";

const url = BaseUrl();
function AffectMaterielEnCoursView()
{
    const {uuid} = useParams();
    const [askDemande,setAskDemande] = useState([]);
    const [loading,setLoading] = useState(false);




    useEffect(()=>{
        get_view_affectation();
    },[]);

    function get_view_affectation()
    {
        setLoading(true);
        try {
            axios.get(url.base+'/affectation-demande-view/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                setLoading(false);
                setAskDemande(resp.data.data);
            });
        } catch (error) {
            setLoading(false);
        }
    }









    return (
        <ContentSection ulShownav={"gest-affectations"} navactive={"affect-mat"}>
                <ViewValidate
                askDemande={askDemande} 
                // historyList={historyList} 
                loading={loading}
                // validate_ask_affect={validate_ask_affect}
                get_view_affectation={get_view_affectation}
                // get_view_affectation_history={get_view_affectation_history}
                tm_bool={false}
                affect_bool={true}
                status={0}
                />


    



        </ContentSection>
    )
}

export default AffectMaterielEnCoursView;