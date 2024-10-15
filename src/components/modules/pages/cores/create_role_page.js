import { useEffect, useState } from "react";
import BaseUrl from "../../../utils/BaseUrl";
import ContentSection from "../../Content";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import CustomerStyle from "../../../utils/customerStyle";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import SwalTopEnd from "../../../utils/swal_top_end";


const url = BaseUrl();
const customStyles = {
     
        headRow: {
            style: {
                backgroundColor: '#89214d',
                color: 'white'
            }
        },
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase'
            }
        },
        cells: {
            style: {
                fontSize: '15px'
            }
        }
    
}
function CreateRolePage()
{
    const navigate = useNavigate();

    const [errors,setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState();
    const [permissions,setPermissions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [roleData,setRoleData] = useState('');

    const columns = [

        {
          name: 'PERMISSIONS',
          selector: row => row.name,
          sortable: true,
        },
    
      

    ];

    useEffect(()=>{
        fetchPermissionList();
    },[]);

    const fetchPermissionList = async ()=>{
        // setLoading(true);
        try {
            axios.get(url.base+'/permission-list',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setPermissions(resp.data.data);
                }
                // setLoading(false);
            })
        } catch (error) {
            // setLoading(false);
        }
    }

    const handleRowSelected = (state) => {
        // console.log(state.selectedRows);
        setSelectedRows(state.selectedRows);
    };

    const submitForm=(e)=>{
        e.preventDefault();

        const permissionTab = selectedRows.map((option)=>option.name);
        // console.log(permissionTab);
        if(roleData !="" ){
            const _formData = new FormData();
            _formData.append('name',roleData);
            _formData.append('permissions', permissionTab );
      
            console.log(_formData);
            setLoading(true);
            try {
                axios.post(url.base+'/role-store',_formData,
               {
                   headers:{
                       'Content-Type':'application/json',
                       "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                       
                   },
                   credentials:'include'
               }
               ).then((resp)=>{
                  setLoading(false);

                  navigate('/cores/roles');
      
               }).catch((error)=>{
                    console.log(error);
               })
           } catch (error) {
                setLoading(false);
               console.log(error);
           } 
        }else{
          if(roleData =="")
          {
            SwalTopEnd({icon:"error",title:"Veuillez renseigner le rôle"});
          }else if(permissionTab.length == 0){
            SwalTopEnd({icon:"error",title:"Veuillez renseigner les permissions"});
          }
        }
    }

    return (
        <>
            <ContentSection ulShownav={"cores"} navactive={"roles"}>
                <div class="container-fluid">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-12">
                                
                                    <div class="mb-5">
                                        <h3 class="mb-0 text-center"><u>Page Enregistrement rôle et permissions</u></h3>

                                    </div>
                                </div>
                            </div>
                            <div>
                                

                                <form class="row" onSubmit={submitForm}>

                                    <div class="col-lg-2 col-12"></div>
                                    <div class="col-lg-8 col-12">
                                        
                                    <div class="card mb-4">
                                        
                                        <div class="card-body">
                                                
                                            
                                            <div>
                                                <div class="mb-3">
                                                    <label class="form-label">Veuillez renseigner le rôle<span className="text-danger">*</span></label>
                                                    <input className="form-control" onChange={(e)=>setRoleData(e.target.value)} required/>
                                                </div>

                                                <div class="mb-3">
                                                <div class="table-responsive">
                                                    <DataTable 
                                                        columns={columns} 
                                                        data={permissions} 
                                                        customStyles={customStyles}
                                                        selectableRows
                                                        onSelectedRowsChange={handleRowSelected}
                                                        selectableRowsComponentProps={{ inkDisabled: true }}
                                                    />
                                                </div>
                                                </div>
                                            </div>


                                        </div>

                                        
                                        </div>
                                        

                                        
                                
                                        <div class="d-grid">
                                        {!loading &&
                                            <button type="submit" class="btn btn-primary">
                                                Enregistrer
                                            </button>
                                        }
                                        {loading &&
                                        <button class="btn btn-primary" type="button" disabled>
                                            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                            Enregistrement en cours...
                                        </button>
                                        }
                                    
                                    </div>
                                
                                    </div>
                                
                                </form>
                            </div>
                </div>
            </ContentSection>
        </>
    )
}

export default CreateRolePage;