import { useEffect, useState } from "react";
import ContentSection from "../../Content";
import { useParams } from "react-router-dom";
import axios from "axios";
import BaseUrl from "../../../utils/BaseUrl";
import CustomerStyle from "../../../utils/customerStyle";

const url = BaseUrl();
const customerStyle = CustomerStyle();

function VewPagePointDeVente()
{
    const {uuid} = useParams();
    const [errors,setErrors] = useState({});
    const [item,setItems] = useState([]);
    const [loading,setLoading] = useState(false);    

    useEffect(()=>{
        fetchItems();
    },[]);

    const fetchItems = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/pointdevente/'+uuid,{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{

                if(resp.status == 200){
                    setItems(resp.data.data);
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }
    return (
        <>
            <ContentSection ulShownav={"parametres"} navactive={"pointvente"}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-12">
                        <div class="mb-5">
                            <h3 class="mb-0 ">Information du point de vente</h3>
                        </div>
                        </div>
                    </div>
                    <div>
                        <div class="row">
                        {/* <div class="col-xxl-8 col-lg-7 col-12">
                            <div class="card mb-4" id="list-of-records">
                            <div class="card-header d-lg-flex justify-content-between ">
                                <div class="d-grid d-lg-block">
                                <a href="#!" class="btn btn-primary" id="add-edit-modal-button" data-bs-toggle="modal"
                                    data-bs-target="#add-edit-modal">+
                                    Ajouter une intervention</a>
                                </div>
                                <div class="d-flex mt-3 mt-lg-0">
                                <div class="position-relative">
                                     <form action="#">
                                    <div class="input-group ">
                                        <input class="form-control rounded-3 search" type="search" value="" id="searchInput"
                                        placeholder="Search" />
                                        <span class="input-group-append">
                                        <button class="btn  ms-n10 rounded-0 rounded-end" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" class="feather feather-search text-dark">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        </button>
                                        </span>
                                    </div>
                                    </form> 
                                </div>
                                 <a href="#!" class="btn btn-outline-white ms-2">Import</a> 
                                 <a href="#!" class="btn btn-danger-soft btn-icon ms-2 texttooltip" data-template="trashTwo">
                                    <i data-feather="trash-2" class="icon-xs"></i>
                                    <div id="trashTwo" class="d-none">
                                    <span>Delete</span>
                                    </div>
                                </a>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive table-card">
                                <table class="table text-nowrap mb-0 table-centered">
                                    <thead class="table-light">
                                    <tr>
                                        <th class=" pe-0  ">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="checkAll" />
                                            <label class="form-check-label" for="checkAll">
                                            </label>
                                        </div>
                                        </th>
                                        <th class="ps-1 sort" default-sort-order="asc" data-sort='company_name'>Code</th>
                                        <th class="sort" data-sort='owner'>Date création</th>
                                        <th class="sort" data-sort='category'>Materiel</th>
                                        <th class="sort" data-sort='rating'>Note</th>
                                        <th class="sort" data-sort='location'>PDV</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody class="list list-of-records-container">
                                 <tr>
                                        <td class=" pe-0">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="contactCheckbox2" />
                                            <label class="form-check-label" for="contactCheckbox2">
                                            </label>
                                        </div>
                                        </td>
                                        <td class="id" style={{"display":"none"}}>#001</td>
                                        <td class="ps-1">
                                        <div class="d-flex align-items-center">
                                    
                                            <div class="ms-2">
                                            <h5 class="mb-0"><a href="#!" class="text-inherit view-item-btn company_name">Godrej
                                                Properties
                                                Ltd</a></h5>
                                            </div>
                                        </div>
                                        </td>
                                        <td class="owner">Mohit Malhotra </td>
                                        <td class="category">Real Estate</td>
                                        <td><span class="rating">3.9</span> <i class="mdi mdi-star text-warning fs-4"> </i></td>
                                        <td class="location">Ahmedabad, India</td>
                                        <td>
                                        <button className="btn btn-secondary">Detail</button>
                                        </td>
                                    </tr> 
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <div class="card-footer d-md-flex justify-content-between align-items-center ">
                                <span id="pagination-status">Showing 1 to 8 of 12 entries</span>
                                <nav class="mt-2 mt-md-0">
                                <div class="d-flex justify-content-end mt-3">
                                    <div class="pagination-wrap hstack">
                                    <a class="page-item pagination-prev" href="#">
                                        Previous
                                    </a>
                                    <ul class="pagination listjs-pagination mb-0"></ul>
                                    <a class="page-item pagination-next" href="#">
                                        Next
                                    </a>
                                    </div>
                                </div>
                                </nav>
                            </div>
                            </div>
                        </div> */}
                        <div class="col-xxl-_ col-lg-8">
                            <div class="card">
                            <div class="card-body border-bottom">
                                <div class="d-flex justify-content-between ">
                                <div>
                                    
                                    <div class="mt-3">
                                    <h2 class="mb-0" id="view-detail-company-name">{item.NomPdv}</h2>
                                    <span id="view-detail-owner fs-4">{item.Contact}</span>
                                    </div>
                                </div>
                                
                                </div>
                            
                            </div>
                            <div class="card-body ">            
                                <div class="mt-4">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span>
                                        Nom du PDV :</span><span id="view-detail-email-id" className="fw-bold">{item.NomPdv}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span>
                                       Catégorie :</span><span id="view-detail-email-id" className="fw-bold">{item.CategoriePdv}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span>
                                       Adresse :</span><span id="view-detail-email-id" className="fw-bold">{item.Address}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0"><span>
                                        Canal :</span><span id="view-detail-email-id" className="fw-bold">{item.Canal}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Zone :</span><span id="view-detail-category" className="fw-bold">{item.ZoneCommerciale}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Territoire :</span><span id="view-detail-location" className="fw-bold">{item.Territoire}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Secteur :</span><span id="view-detail-location" className="fw-bold">{item.Secteur}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Manager:</span><span id="view-detail-location" className="fw-bold">{item.ManagerPdv}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Contact :</span><span id="view-detail-location" className="fw-bold">{item.Contact}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Commercial Associé :</span><span id="view-detail-location" className="fw-bold">{item?.commercial?.use_nom} {item?.commercial?.use_prenom}</span>
                                    </li>

                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Latitude :</span><span id="view-detail-location" className="fw-bold">{item.latitude}</span>
                                    </li>

                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Longitude :</span><span id="view-detail-location" className="fw-bold">{item.longitude}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center ps-0">
                                    <span>Nomenclature :</span><span id="view-detail-location" className="fw-bold">{item.NomenclatureAGROCI}</span>
                                    </li>
                                    
                                </ul>
                                </div>
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

export default VewPagePointDeVente;