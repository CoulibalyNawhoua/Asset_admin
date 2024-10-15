import { Link, useParams } from "react-router-dom";
import ContentSection from "../../Content";
import { useEffect, useState } from "react";
import moment from "moment";
import BaseUrl from "../../../utils/BaseUrl";
import axios from "axios";
import ViewValidate from "../../composants/view_validation";

const url = BaseUrl();
function ViewAffectationDemandePage()
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
            })
        } catch (error) {
            setLoading(false);
        }
    }

    function get_view_affectation_history()
    {
        setLoading(true);
        try {
            axios.get(url.base+'/user-affect-materiel-history/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
                setLoading(false);
                setHistoryList(resp.data.data);
            })
        } catch (error) {
            setLoading(false);
        }
    }

    // console.log(askDemande);
    return (
        <ContentSection ulShownav={"gest-affectations"} navactive={"list-affectation"}>
                <ViewValidate
                    askDemande={askDemande} 
                    historyList={historyList} 
                    // loading={loading}
                    // validate_ask_affect={validate_ask_affect}
                    get_view_affectation={get_view_affectation}
                    get_view_affectation_history={get_view_affectation_history}
                    list={1}
                    // tm_bool={false}
                    // affect_bool={false}
                    status={0}
                />
        </ContentSection>
    )
}

export default ViewAffectationDemandePage;  