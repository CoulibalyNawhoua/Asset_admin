import { useContext, useEffect, useState } from "react";
import ContentSection from "../Content";
import { UserContext } from "../../utils/User_check";
import can from '../../utils/Can';
import ApexCharts from 'apexcharts';
import Chart from "react-apexcharts";
import axios from "axios";
import BaseUrl from "../../utils/BaseUrl";
import CustomerStyle from "../../utils/customerStyle";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import moment from "moment";

const url = BaseUrl();
const customerStyle = CustomerStyle();

function DashboardPage(){
    const {user,permissions} = useContext(UserContext);
    const [totalDemande,setTotalDemande] = useState(0);
    const [totalContratIn,setTotalContratIn] = useState(0);
    const [totalDemandeEnAttente,setTotalDemandeEnAttente] = useState(0);
    const [totalIntervention,setTotalIntervention] = useState(0);

    const [demandeSerie,setDemandeSerie] = useState({series: [], labels: []});
    const [demandeTerritoireSerie,setDemandeTerritoireSerie] = useState({series: [], labels: []});
    const [demandeTerritoirePlus,setDemandeTerritoirePlus] = useState(0);
    const [demandeTerritoirePlusW,setDemandeTerritoirePlusW] = useState({labels: []});

    const [demandeStatutSerie,setDemandeStatutSerie] = useState({series: [], labels: []});
    const [tauxDemandeTerminer,setTauxDemandeTerminer] = useState(0);

    const [interventionSerie,setInterventionSerie] = useState({series: [], labels: []});
    const [loading,setLoading] = useState(false);
    const [recentDemandes,setRecentDemandes] = useState([]);
    const [recentTournee,setRecentTournee] = useState([]);
    const [contratAtermes,setContratAterme] = useState([]);


  
    useEffect(()=>{
        if(!can(permissions,'dashboard')){

        }
        fetchDataSynthese();
    },[]);


    const fetchDataSynthese = async ()=>{
        setLoading(true);
        try {
            axios.get(url.base+'/statistique-dashboard-asset',{
                headers:{
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('_token_')}`
                    
                },
            }).then((resp)=>{
    
                if(resp.status == 200){
                  setTotalDemande(resp.data?.totalMateriel);
                  setTotalContratIn(resp.data?.totalContratEncours);
                  setTotalDemandeEnAttente(resp.data?.totalDemandeEnAttente);
                  setTotalIntervention(resp.data?.totalIntervention);

    
                    const labelMoisArr = Object.keys(resp.data.labels).map(key => resp.data?.labels[key]);
                    // console.log(resp.data?.demandeParStatutLables);
                    setDemandeSerie({
                      series:Object.values(resp.data?.demandeSerie),
                      labels: labelMoisArr?.map((label)=>label),
                    })
                    setInterventionSerie({
                      series:Object.values(resp.data?.interventionSerie),
                      labels:labelMoisArr.map((label)=>label),
                    });

                    setDemandeTerritoireSerie(
                        {
                          labels: Object.values(resp.data?.DemandeTerritoireSerieAndLabels),
                          series: Object.values(resp.data?.DemandeTerritoireSerieAndLabels)
                        }
                    );

                    setDemandeStatutSerie(
                        {
                          labels: Object.values(resp.data?.demandeParStatutLables),
                          series: Object.values(resp.data?.demandeParStatutSerie)
                        }
                    );

                    setTauxDemandeTerminer(resp.data?.demandeTauxOfDeploiement);

                    setDemandeTerritoirePlus(resp.data?.TerritoireAvecPlusDemande);

                    setDemandeTerritoirePlusW(
                        {
                          labels: resp.data?.TerritoireAvecPlusDemandeWithLibelle?.libelle
                        }
                    );

                    setRecentDemandes(resp.data?.demandeRecentes);
                    setRecentTournee(resp.data?.tourneeRecentes);
                    setContratAterme(resp.data?.contratAtermes);

                    // console.log(resp.data.TerritoireAvecPlusDemandeWithLibelle.libelle);
    
                }
                setLoading(false);
            })
        } catch (error) {
            setLoading(false);
        }
    }
          
    const state = {
        series: [
            {
              name: "Demandes",
              data: demandeSerie?.series?.map((serie)=>serie)
            },
            {
              name: "Intervention",
              data: interventionSerie?.series?.map((serie)=>serie)
            }
          ],
          options: {
            chart: {
              height: 350,
              type: 'line',
              dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
              },
              zoom: {
                enabled: false
              },
              toolbar: {
                show: false
              }
            },
            colors: ['#77B6EA', '#545454'],
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: 'smooth'
            },
            title: {
              text: 'DEMANDES & INTERVENTION',
              align: 'left'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            markers: {
              size: 1
            },
            xaxis: {
              categories:demandeSerie?.labels,
              title: {
                text: 'Mois'
              }
            },
            yaxis: {
              title: {
                text: ''
              },
              min: 5,
              max: 40
            },
            legend: {
              position: 'top',
              horizontalAlign: 'right',
              floating: true,
              offsetY: -25,
              offsetX: -5
            }
          },
        
        
    };

    const stateTerritoire = {
          
        series: demandeTerritoireSerie?.series.map((serie)=>parseInt(serie?.quantity)),
        options: {
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: demandeTerritoireSerie?.labels?.map((label)=>label?.libelle),
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
      
      
      };

      const stateStatut = {
          
        series: demandeStatutSerie?.series,
        options: {
          chart: {
            width: 380,
            type: 'bar',
          },
          colors: ['#77B6EA', '#545454','#ff61f7','#00CCCB', '#E9967A', '#00ff2a','#ff0000', '#730800'],
          labels: demandeStatutSerie?.labels,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
      
      
      };

    // const stateplus = {
          
    //     series: demandeTerritoirePlus,
    //     options: {
    //       chart: {
    //         width: 380,
    //         type: 'pie',
    //       },
    //       labels: demandeTerritoirePlusW,
    //       responsive: [{
    //         breakpoint: 480,
    //         options: {
    //           chart: {
    //             width: 200
    //           },
    //           legend: {
    //             position: 'bottom'
    //           }
    //         }
    //       }]
    //     },
      
      
    //   };

      const statethree = {
          
        series: [tauxDemandeTerminer],
        options: {
          chart: {
            height: 350,
            type: 'radialBar',
          },
          colors: ['#00ff2a'],
          plotOptions: {
            radialBar: {
              hollow: {
                size: `${tauxDemandeTerminer??0}%`,
              }
            },
          },
          labels: ['TERMINEE'],
        },
      
      
      };
    //   console.log(demandeStatutSerie);
      const statePlus = {
          
        series:  [demandeTerritoirePlus],
        options: {
          chart: {
            height: 350,
            type: 'radialBar',
          },
          colors: [ '#E73E01'],
          plotOptions: {
            radialBar: {
              hollow: {
                size: `${demandeTerritoirePlus }%`,
              }
            },
          },
          labels: [demandeTerritoirePlusW?.labels],
        },
      
      
      };

      const columnsDemandes = [
        {
            name: 'DATE DE CREATION',
            selector: (row,index) => moment(row?.created_at).format("Do MMMM YYYY H:m"),
            sortable: true,
        },
        {
            name: 'PDV',
            selector: row => row?.d_pdv,
            sortable: true,
          },
          {
            name: 'TERRITOIRE',
            selector: row => row?.territoire?.libelle,
            sortable: true,
          },
        {
          name: 'COMMERCIAL',
          selector: row => `${row.commercial.use_nom} ${row.commercial.use_prenom}`,
          sortable: true,
        },    

        {
            name: "Action",
            selector : row => (
                <>
                 <Link className="btn btn-primary btn-sm me-2" to={`/affectations/${row.uuid}`}> <i className="fa fa-eye"></i> Voir </Link>
                </>
            )
        },

    ];

    const columnsTournee = [
        {
            name: 'PREVUE LE',
            selector: (row,index) => moment(row.date).format("Do MMMM YYYY H:m"),
            sortable: true,
        },
        {
            name: 'CODE',
            selector: row => row.code,
            sortable: true,
          },
        {
          name: 'LIVREUR',
          selector: row => `${row.livreur.use_nom} ${row.livreur.use_prenom}`,
          sortable: true,
        },    

        {
            name: "Action",
            selector : row => (
                <>
                    <Link className="btn btn-success btn-sm mx-1" to={`/tournee-deploiements-views/${row.uuid}`}><i class="fa-solid fa-eye"></i>Voir</Link>
                </>
            )
        },

    ];
    const columnsContrat = [
        {
            name: 'CODE AFFECTATION',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'ADRESSE DU PDV',
            selector: row => row.d_addresse,
            sortable: true,
        },

        {
            name: 'CATEGORIE PDV',
            selector: row => `${row.d_pdv_categorie}`,
            sortable: true,
        },

        {
            name: 'PDV',
            selector: row => `${row.d_pdv} ${row.d_contact}`,
            sortable: true,
        },
      
        // {
        //   name: 'MANAGER',
        //   selector: row => row.d_pdv_manager,
        //   sortable: true,
        // },

        {
            name: 'DATE DEBUT',
            selector: row => row.contrat_date_debut !== null ? moment(row.contrat_date_debut).format("Do MMMM YYYY") : "" ,
            sortable: true,
        },

        {
            name: 'DATE FIN CONTRAT',
            selector: row => row.contrat_date_fin !== null ? moment(row.contrat_date_fin).format("Do MMMM YYYY") : "" ,
            sortable: true,
        },
       
    
        {
          name: "STATUT DU CONTRAT",
          selector : row => (
            <>
             {row.statut_contrat == 3 && (
            <span className="badge bg-success">Actif</span>
            )}
            {row.statut_contrat == 4 && (
                <span className="badge bg-danger">Inactif</span>
            )}
            </>
          )
        },
        // {
        //     name: "Action",
        //     selector : row => (
        //         <>
        //             <Link className="btn btn-success btn-sm me-1" to={`/affectations/${row.uuid}`}> <i className="fa fa-eye"></i>  </Link>
        //             <button className="btn btn-primary btn-sm mx-1" onClick={()=>Downloadpdf(row.id)}><i class="fa-solid fa-download"></i></button>
        //             <button className="btn btn-danger btn-sm" onClick={()=>open_modal_rompre(row)}>ROMPRE</button>
        //         </>
        //     )
        //   },

    ];
    const conditionalRowStyles = [
        {
          when: row => moment(row?.contrat_date_fin).isBefore(moment()), // La condition pour colorer la ligne
          style: {
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: 'red',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
    ];

    return (
        <>
            <ContentSection navactive={""} ulShownav={""}>
           
                    <div className="pt-10 pb-21 mt-n6 mx-n4"></div>
                    <div className="container-fluid mt-n22 ">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-12">
                                
                                <div className="d-flex justify-content-between align-items-center mb-5">
                                    <div className="mb-2 mb-lg-0">
                                        <h3 className="mb-0  text-dark">Tableau de bord</h3>
                                    </div>
                                    {/* <div>
                                        <a href="#!" className="btn btn-white">Create New Project</a>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        {can(permissions,"dashboard") &&
                            <>
                                 <div className="row">
                            <div className="col-xl-3 col-lg-6 col-md-12 col-12 mb-5">
                                
                                <div className="card h-100 card-lift">
                                    
                                    <div className="card-body">
                                        
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h4 className="mb-0">Total matériaux</h4>
                                            </div>
                                            <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                                <i  data-feather="briefcase" height="20" width="20"></i>
                                            </div>
                                        </div>
                                    
                                        <div className="lh-1">
                                            <h1 className=" mb-1 fw-bold">{totalDemande}</h1>
                                            {/* <p className="mb-0"><span className="text-dark me-2">2</span></p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-12 col-12 mb-5">
                                
                                <div className="card h-100 card-lift">
                                    
                                    <div className="card-body">
                                        
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h4 className="mb-0">Contrats en cours</h4>
                                            </div>
                                            <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                                <i  data-feather="list" height="20" width="20"></i>
                                            </div>
                                        </div>
                                    
                                        <div className="lh-1">
                                            <h1 className="  mb-1 fw-bold">{totalContratIn}</h1>
                                            {/* <p className="mb-0"><span className="text-dark me-2">28</span>Completed</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-12 col-12 mb-5">
                                
                                <div className="card h-100 card-lift">
                                    
                                    <div className="card-body">
                                        
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h4 className="mb-0">Demande en attente</h4>
                                            </div>
                                            <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                                    <i  data-feather="users" height="20" width="20"></i>
                                            </div>
                                        </div>
                                    
                                        <div className="lh-1">
                                            <h1 className="  mb-1 fw-bold">{totalDemandeEnAttente}</h1>
                                            {/* <p className="mb-0"><span className="text-dark me-2">1</span>Completed</p> */}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-12 col-12 mb-5">
                                
                                <div className="card h-100 card-lift">
                                    
                                    <div className="card-body">
                                        
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h4 className="mb-0">Total Intervention</h4>
                                            </div>
                                            <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                                                    <i  data-feather="target" height="20" width="20"></i>
                                            </div>
                                        </div>
                                    
                                        <div className="lh-1">
                                            <h1 className="  mb-1 fw-bold">{totalIntervention}</h1>
                                            {/* <p className="mb-0"><span className="text-success me-2">5%</span>Completed</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      
                       
                        
                        <div className="row ">
                            <div className="col-xl-12 col-12 mb-5">
                                
                                <div className="card">
                                    
                                    <div className="card-header ">
                                        <h4 className="mb-0">Statistique</h4>
                                    </div>
                                    
                                    <div className="card-body">
                                    <div className="table-responsive table-card">
                                    <Chart
                                         options={state?.options}
                                         series={state?.series}
                                         type="line"
                                         height={350}
                                          />
                                    </div>
                                </div>
                                    
                                    {/* <div className="card-footer text-center">
                                        <a href="#!" className="btn btn-primary">View All Projects</a>

                                    </div> */}
                                </div>

                            </div>
                          
                        </div> 
                        
                     <div className="row mb-5">


                            <div className="col-xl-6 col-lg-12 col-md-12 col-12 mb-5 mb-xl-0">
                            <div className="card h-100">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">DEMANDES PAR TERRITOIRE</h4>
                                {/* <div className="dropdown">
                                    <a className="btn btn-outline-white btn-sm dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Task
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-end ">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </div> */}
                            </div>

                            <div className="card-body">
                                <div className="table-responsive table-card">
                                <Chart
                                         options={stateTerritoire?.options}
                                         series={stateTerritoire?.series}
                                         type="pie"
                                         height={350}
                                          />
                                </div>
                            </div>
                            </div>
                            </div>
                            
                            <div className="col-xl-6 col-lg-12 col-md-12 col-12 mb-5 mb-xl-0">
                                <div className="card h-100">
                                    
                                    <div className="card-header">
                                        <h4 className="mb-0">TERRITOIRE AVEC PLUS DE DEMANDES </h4>
                                    </div>
                                    
                                    <div className="card-body" >
                                        <div className="table-responsive table-card" data-simplebar="" style={{"max-height": "380px;"}}>
                                        <Chart
                                            options={statePlus?.options}
                                            series={statePlus?.series}
                                            type="radialBar"
                                            height={350}
                                          />
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div> 

                    <div className="row mb-5">


                            <div className="col-xl-6 col-lg-12 col-md-12 col-12 mb-5 mb-xl-0">
                            <div className="card h-100">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">DEMANDES PAR STATUT</h4>
                                {/* <div className="dropdown">
                                    <a className="btn btn-outline-white btn-sm dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Task
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-end ">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </div> */}
                            </div>

                            <div className="card-body">
                                <div className="table-responsive table-card">
                                <Chart
                                         options={stateStatut?.options}
                                         series={stateStatut?.series}
                                         type="pie"
                                         height={350}
                                          />
                                </div>
                            </div>
                            </div>
                            </div>
                            
                            <div className="col-xl-6 col-lg-12 col-md-12 col-12 mb-5 mb-xl-0">
                                <div className="card h-100">
                                    
                                    <div className="card-header">
                                        <h4 className="mb-0">TAUX DE DEPLOIEMENT</h4>
                                    </div>
                                    
                                    <div className="card-body" >
                                        <div className="table-responsive table-card" data-simplebar="" style={{"max-height": "380px;"}}>
                                        <Chart
                                         options={statethree?.options}
                                         series={statethree?.series}
                                         type="radialBar"
                                         height={350}
                                          />
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>

                    <div class="row mb-5">

                            <div class="col-xl-6 col-lg-12 col-md-12 col-12 mb-5 mb-xl-0">
                                <div class="card h-100">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h4 class="mb-0">DEMANDES RECENTE <b>({recentDemandes?.length})</b> </h4>
                                       
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive table-card">
                                        <DataTable 
                                            columns={columnsDemandes} 
                                            data={recentDemandes}
                                            customStyles={customerStyle}
                                            progressPending={loading}
                                            progressComponent={
                                                <>
                                                <div class="text-center">
                                                    <div class="spinner-border" role="status">
                                                    <span class="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                                </>
                                            }                                  
                                        />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-6 col-lg-12 col-md-12 col-12 mb-5 mb-xl-0">
                                <div class="card h-100">
                                    <div class="card-header">
                                        <h4 class="mb-0">TOURNEE EN ATTENTE <b>({recentTournee?.length})</b> </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive table-card" data-simplebar="init" style={{"max-height": "380px"}}><div class="simplebar-wrapper" style={{"margin": "0px"}}><div class="simplebar-height-auto-observer-wrapper"><div class="simplebar-height-auto-observer"></div></div><div class="simplebar-mask"><div class="simplebar-offset" style={{"right": "0px", "bottom": "0px"}}><div class="simplebar-content-wrapper" tabindex="0" role="region" aria-label="scrollable content" style={{"height": "auto", "overflow": "hidden scroll"}}><div class="simplebar-content" style={{"padding": "0px"}}>
                                        <DataTable 
                                            columns={columnsTournee} 
                                            data={recentTournee}
                                            customStyles={customerStyle}
                                            progressPending={loading}
                                            progressComponent={
                                                <>
                                                <div class="text-center">
                                                    <div class="spinner-border" role="status">
                                                    <span class="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                                </>
                                            }                                  
                                        />
                                        </div></div></div></div><div class="simplebar-placeholder" style={{"width": "auto", "height": "500px"}}></div></div><div class="simplebar-track simplebar-horizontal" style={{"visibility": "hidden;"}}><div class="simplebar-scrollbar" style={{"width": "0px", "display":" none"}}></div></div><div class="simplebar-track simplebar-vertical" style={{"visibility": "visible"}}><div class="simplebar-scrollbar" style={{"height": "288px","transform": "translate3d(0px, 0px, 0px)", "display": "block"}}></div></div></div>
                                    </div>
                                </div>
                            </div>
                    </div>

                    <div class="row ">

                    <div class="col-xl-12 col-lg-12 col-md-12 col-12 mb-5 mb-xl-0">
                        <div class="card h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h4 class="mb-0">LISTE DES CONTRAT A TERME <b>({contratAtermes?.length})</b> </h4>
                            
                            </div>
                            <div class="card-body">
                                <div class="table-responsive table-card">
                                <DataTable 
                                    columns={columnsContrat} 
                                    data={contratAtermes}
                                    customStyles={customerStyle}
                                    conditionalRowStyles={conditionalRowStyles}
                                    progressPending={loading}
                                    progressComponent={
                                        <>
                                        <div class="text-center">
                                            <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                        </>
                                    }                                  
                                />
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>
                    </>
                        }
                    </div>
                
            </ContentSection>
            
        </>
    )
}

export default DashboardPage;