import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../utils/User_check";
import can from "../../utils/Can";

function SidebarSection({navactive,ulShownav}){
    const {user,permissions} = useContext(UserContext);

    useEffect(()=>{
       
    },[user,permissions]);


    return (
        <>
        <div className="app-menu">
                <div className="navbar-vertical navbar nav-dashboard">
                    <div className="h-100" data-simplebar>
                    
                        <a className="navbar-brand fw-bold card text-primary" href="/tableau-de-bord" >
                        ASSET MANAGEMENT
                            {/* <img src="/assets/images/brand/logo/logo-2.svg" alt="dash ui - bootstrap 5 admin dashboard template" /> */}
                        </a>
                        
                        <ul className="navbar-nav flex-column" id="sideNavbar">  
                        <li className="nav-item">
                 <Link className={navactive && navactive =='dashboard' ? "nav-link has-arrow fw-bold active" : "nav-link has-arrow fw-bold"} to="/tableau-de-bord" >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-home nav-icon me-2 icon-xxs"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      Dashboard
                 </Link>


             </li>
                {can(permissions,"materiels") &&
                    <li className="nav-item">
                        <a className={ulShownav && ulShownav == 'managements' ? "nav-link has-arrow  collapsed fw-bold active" : "nav-link has-arrow fw-bold "} href="#!"
                            data-bs-toggle="collapse" data-bs-target="#navEmail1" aria-expanded={ulShownav && ulShownav == 'managements' ? "true" : "false "}
                            aria-controls="navEmail1">
                                <i class="fa-solid fa-gears me-2"></i>
                            Gestion du matériel
                        </a>

                        <div id="navEmail1" className={ulShownav && ulShownav == 'managements' ? "collapse show" : "collapse"}
                            data-bs-parent="#sideNavbar">
                            <ul className="nav flex-column">
                            {can(permissions,"articles-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='gest-materiel' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/materiels/list">
                                        Listes des articles
                                    </Link>
                                </li>
                            }
                            {can(permissions,"stock-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='stock-materiel' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/stock-materiels">
                                        Stocks
                                    </Link>
                                </li>
                            }
                             {can(permissions,"stock-depot-list") &&
                            <li className="nav-item">
                                    <Link className={navactive && navactive =='stock-depot' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/stocks-depot">
                                        Stocks depot
                                    </Link>
                            </li>}
                            {can(permissions,"importation-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='file-import-list' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/file-import-list-materiels">
                                        Importations
                                    </Link>
                                </li>
                            }
                            {can(permissions,"transfert-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='transfert-mat' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/materiels/tranfert-list">
                                        Transfert de matériel
                                    </Link>
                                </li>}
                            {can(permissions,"transfert-depot-list") &&
                             <li className="nav-item">
                                    <Link className={navactive && navactive =='transfert-mat' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/tranfert-depot-list">
                                        Mes transferts
                                    </Link>
                                </li>}
                                {/* <li className="nav-item"> 
                                    <Link className={navactive && navactive =='en-attente-mat' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/materiels/en-attente-affectation">
                                        Matériaux en attente
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='deploy-mat' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/materiels/deployes">
                                        Matériaux deployés
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='declasse-mat' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/materiels/declasses">
                                        Matériaux declassés
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='in-stock-mat' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/materiels/en-stocks">
                                        Matériaux en stocks
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className={navactive && navactive =='in-stock-dept' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/materiels/stock-by-depots">
                                        Stock par depôts
                                    </Link>
                                </li> */}
                            </ul>
                        </div>
                    </li>
                }

                {can(permissions,"demandes") &&
                     <li className="nav-item">
                        <Link className={ulShownav && ulShownav == 'gest-affectations' ? "nav-link has-arrow  collapsed fw-bold active" : "nav-link has-arrow fw-bold "} href="#!"
                            data-bs-toggle="collapse" data-bs-target="#navEmail2" aria-expanded={ulShownav && ulShownav == 'gest-affectations' ? "true" : "false "}
                            aria-controls="navEmail2">
                            <i class="fa-solid fa-clock-rotate-left me-2"></i>
                                Gestion des demandes
                        </Link>

                        <div id="navEmail2" className={ulShownav && ulShownav == 'gest-affectations' ? "collapse show" : "collapse"}
                            data-bs-parent="#sideNavbar">
                            <ul className="nav flex-column">

                            {can(permissions,"demande-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='list-affectation' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/affectations/list">
                                        Liste des demandes
                                    </Link>
                                </li>
                            }
                            {can(permissions,"affect-materiel-demande") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='affect-mat' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/affect-materiel-en-attente">
                                        Affectation de matériel
                                    </Link>
                                </li>}     

                            {can(permissions,"demande-asm-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='affectation-asm' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/affect-asm-en-attente">
                                        Demandes du ASM
                                    </Link>
                                </li>}
                            {can(permissions,"demande-rsm-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='affectation-rsm' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/affect-rsm-en-attente">
                                        Demandes du RSM
                                    </Link>
                                </li>}
                            {can(permissions,"demande-tm-list") &&
                            <li className="nav-item">
                                <Link className={navactive && navactive =='affectation-tm' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/affect-tm-en-attente">
                                    Demandes du TM
                                </Link>
                            </li>}
                            </ul>
                        </div>
                    </li> 
                }
                {can(permissions,"tournees") &&
                     <li className="nav-item">
                        <a className={ulShownav && ulShownav == 'tournees' ? "nav-link has-arrow  collapsed fw-bold active" : "nav-link has-arrow fw-bold "} href="#!"
                            data-bs-toggle="collapse" data-bs-target="#navEmail3" aria-expanded={ulShownav && ulShownav == 'tournees' ? "true" : "false "}
                            aria-controls="navEmail3">
                            <i class="fa-solid fa-truck-moving me-2"></i>
                                Gestion des tournées
                        </a>

                        <div id="navEmail3" className={ulShownav && ulShownav == 'tournees' ? "collapse show" : "collapse"}
                            data-bs-parent="#sideNavbar">
                            <ul className="nav flex-column">

                            {can(permissions,"tournee-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='tournee_list' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/tournee-deploiements-list">
                                            Liste des tournées
                                    </Link>
                                </li>}
                            {can(permissions,"vehicule-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='vehicule_list' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/vehicule-transport-list">
                                            Vehicules
                                    </Link>
                                </li>}
                            
                            </ul>
                        </div>
                    </li> 
                }
                {can(permissions,"contrat") &&
                    <li className="nav-item">
                        <a className={ulShownav && ulShownav == 'gest-contrat' ? "nav-link has-arrow  collapsed fw-bold active" : "nav-link has-arrow fw-bold "} href="#!"
                            data-bs-toggle="collapse" data-bs-target="#navEmail5" aria-expanded={ulShownav && ulShownav == 'gest-contrat' ? "true" : "false "}
                            aria-controls="navEmail3">
                            <i class="fa-solid fa-file me-2"></i>
                               Gestion des contrats
                        </a>

                        <div id="navEmail5" className={ulShownav && ulShownav == 'gest-contrat' ? "collapse show" : "collapse"}
                            data-bs-parent="#sideNavbar">
                            <ul className="nav flex-column">

                            {can(permissions,"contrat-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='contrat_list' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/contrat-en-cours-list">
                                           Contrat en cours
                                    </Link>
                                </li>
                            }
                            {can(permissions,"invalide-contrat-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='histo_contrat' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/contrat-historique-list">
                                        Contrat invalide
                                    </Link>
                                </li>}

                                
        
                            
                            </ul>
                        </div>
                    </li>
                }

                    {can(permissions,"intervention") &&
                        <li className="nav-item">
                            <a className={ulShownav && ulShownav == 'interventions' ? "nav-link has-arrow  collapsed fw-bold active" : "nav-link has-arrow fw-bold "} href="#!"
                                data-bs-toggle="collapse" data-bs-target="#navEmail4" aria-expanded={ulShownav && ulShownav == 'interventions' ? "true" : "false "}
                                aria-controls="navEmail3">
                                <i class="fa-solid fa-tools me-2"></i>
                                Interventions
                            </a>

                            <div id="navEmail4" className={ulShownav && ulShownav == 'interventions' ? "collapse show" : "collapse"}
                                data-bs-parent="#sideNavbar">
                                <ul className="nav flex-column">

                                {can(permissions,"reparateur-list") &&
                                    <li className="nav-item">
                                            <Link className={navactive && navactive =='reparateur_list' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/list-reparateurs">
                                                Reparateurs
                                            </Link>
                                    </li>}
                                    {can(permissions,"intervention-list") &&
                                    <li className="nav-item">
                                        <Link className={navactive && navactive =='intervention_list' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/interventions-list">
                                                Gestion des Interventions
                                        </Link>
                                    </li>}

                                    {can(permissions,"devis-list") &&
                                    <li className="nav-item">
                                        <Link className={navactive && navactive =='devis_list' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/list-devis-intervention">
                                                Gestion des devis
                                        </Link>
                                    </li>}
                                    {can(permissions,"facture-list") &&
                                    <li className="nav-item">
                                        <Link className={navactive && navactive =='facture_list' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/list-factures-intervention">
                                                Gestion des Factures
                                        </Link>
                                    </li>}
                                    

                                
                                </ul>
                            </div>
                        </li> 
                    }


                    {can(permissions,"gestion-compte") &&
                       
                        <li className="nav-item">
                            <a className={ulShownav && ulShownav == 'cores' ? "nav-link has-arrow  collapsed fw-bold active" : "nav-link has-arrow fw-bold "} href="#!"
                                data-bs-toggle="collapse" data-bs-target="#navDashboard" aria-expanded={ulShownav && ulShownav == 'cores' ? "true" : "false "}
                                aria-controls="navDashboard">
                                <i className="fa-solid fa-users me-2 icon-xxs" ></i>
                                Gestion des comptes
                            </a>

                            <div id="navDashboard" className={ulShownav && ulShownav == 'cores' ? "collapse show" : "collapse"}
                                data-bs-parent="#sideNavbar">
                                {can(permissions,"compte-super-admin") &&

                                    <ul className="nav flex-column">

                                        {can(permissions,"societe-list") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='comptes' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/cores/comptes">Sociétes</Link>
                                            </li>
                                        }
                                        {can(permissions,"utilisateurs-list") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='users' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/cores/users-comptes">Utilisateurs</Link>
                                            </li>}

                                            {can(permissions,"compte-user") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='meusers' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/cores/users-societe">
                                                   Mes Utilisateurs
                                                </Link>
                                            </li>}

                                            {can(permissions,"roles-page") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='roles' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/cores/roles">
                                                    Rôles 
                                                </Link>
                                            </li>
                                            } 
                                            {can(permissions,"permissions-page") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='permissions' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/cores/permissions">
                                                    Permissions
                                                </Link>
                                            </li>   
                                            }
                                    </ul>

                                }

                                {/* {can(permissions,"compte-user") &&

                                    <ul className="nav flex-column">
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='users' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/cores/users-comptes">Mes Utilisateurs</Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='comptes' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/cores/comptes">Mes Reparateurs</Link>
                                            </li>
                                           
                                           
                                    </ul>

                                } */}
                                
                            </div>

                        </li>  
                    }
                    {can(permissions,"parametre") &&
                    <li className="nav-item">
                        <a className={ulShownav && ulShownav == 'parametres' ? "nav-link has-arrow  collapsed fw-bold active" : "nav-link has-arrow fw-bold "} href="#!"
                            data-bs-toggle="collapse" data-bs-target="#navecommerce" aria-expanded={ulShownav && ulShownav == 'parametres' ? "true" : "false "}
                            aria-controls="navecommerce">
                            <i className="fa-solid fa-list me-2 icon-xxs"></i> Paramètres
                        </a>

                        <div id="navecommerce" className={ulShownav && ulShownav == 'parametres' ? "collapse show" : "collapse"}
                            data-bs-parent="#sideNavbar">
                            <ul className="nav flex-column">

                            {can(permissions,"template-contrat") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='contrat' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/contrat-template-affectation">
                                        Template contrat
                                    </Link>
                                </li>}
                                {can(permissions,"categorie-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='category' ? "nav-link has-arrow active" : "nav-link has-arrow"}
                                        to="/settings/category">
                                        Catégories
                                    </Link>
                                </li>}
                                {can(permissions,"marque-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='marques' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/settings/marques">
                                        Marques
                                    </Link>
                                </li>}
                                {can(permissions,"modele-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='modeles' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/settings/modeles">
                                        Modelès
                                    </Link>
                                </li>}
                                {can(permissions,"fournisseur-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='fournisseur' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/settings/fournisseurs">
                                        Fournisseurs
                                    </Link>
                                </li>}
                                {can(permissions,"depot-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='entrepot' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/settings/entrepot">
                                        Depôts
                                    </Link>
                                </li>}
                                
                                {/* {can(permissions,"pdv-list") && */}
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='pointvente' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/settings/point-de-vente">
                                        Points de ventes
                                    </Link>
                                </li>
                                {/* } */}
                                {can(permissions,"pdv-distriforce-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='pdv_distriforce' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/distriforce/pdv-list">
                                        PDV DISTRIFORCE
                                    </Link>
                                </li>}
                                {can(permissions,"capacite-list") &&
                                <li className="nav-item">
                                    <Link className={navactive && navactive =='capacites' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/settings/capacites-list">
                                        Capacités des matéraux
                                    </Link>
                                </li>}
                                {can(permissions,"parametre-geo") &&
                                <li className="nav-item">
                                    <a className={navactive && navactive =='canal' | navactive == "zone" | navactive == "territoire" | navactive == "secteur_page"  ? "nav-link collapsed" : "nav-link"} href="#!" data-bs-toggle="collapse" data-bs-target="#navprojectSingle" aria-expanded={navactive && navactive =='canal' | navactive == "zone" | navactive == "territoire" ? "true" : "false"} aria-controls="navprojectSingle">
                                        Paramètres Géographique
                                    </a>
                                    <div id="navprojectSingle" className={navactive && navactive =='canal' | navactive == "zone" | navactive == "territoire" | navactive == "secteur_page" ? "collapse show" : "collapse"} data-bs-parent="#navProject" >
                                        <ul className="nav flex-column">
                                        {can(permissions,"canal-list") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='canal' ? "nav-link active" : "nav-link"} to="/settings/canals">
                                                    Canal
                                                </Link>
                                            </li>}
                                            {can(permissions,"zone-list") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive == "zone" ? "nav-link active" : "nav-link"} to="/settings/zones">
                                                    Zones
                                                </Link>
                                            </li>}
                                            {can(permissions,"territoire-list") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive == "territoire" ? "nav-link active" : "nav-link"} to="/settings/territoires">
                                                Térritoire
                                                </Link>
                                            </li>  }
                                            {can(permissions,"secteur-list") &&
                                            <li className="nav-item">
                                                <Link className={navactive && navactive =='secteur_page' ? "nav-link has-arrow active" : "nav-link has-arrow"} to="/secteurs/list">
                                                    Secteurs
                                                </Link>
                                            </li>}                                            
                                        </ul>
                                    </div>
                                </li>}

                            </ul>
                        </div>
                    </li>
                    }



                           

                            
                            {/* <li className="nav-item">
                                <div className="navbar-heading">UI Components</div>
                            </li> */}
                           
                            
                            {/* <li className="nav-item">
                                <div className="navbar-heading">Documentation</div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link has-arrow  collapsed " href="#!"
                                    data-bs-toggle="collapse" data-bs-target="#navDocs" aria-expanded="false"
                                    aria-controls="navDocs">
                                    <i data-feather="package" className="nav-icon me-2 icon-xxs" >
                                    </i> Docs
                                </a>
                                <div id="navDocs" className="collapse "
                                    data-bs-parent="#sideNavbar">
                                    <ul className="nav flex-column">

                                        <li className="nav-item"><a href="docs/index.html" className="nav-link  ">Introduction</a></li>
                                        <li className="nav-item"><a href="docs/environment-setup.html" className="nav-link ">Environment setup</a></li>
                                        <li className="nav-item"><a href="docs/working-with-gulp.html" className="nav-link  ">Working with Gulp</a>
                                        </li>
                                        <li className="nav-item"><a href="docs/compiled-files.html" className="nav-link ">Compiled Files</a>
                                        </li>
                                        <li className="nav-item"><a href="docs/file-structure.html" className="nav-link ">File Structure</a></li>
                                        <li className="nav-item"><a href="docs/resources-assets.html" className="nav-link ">Resources & assets</a></li>
                                        <li className="nav-item"><a href="docs/changelog.html" className="nav-link ">Changelog</a></li>


                                    </ul>
                                </div>
                            </li> */}

                        </ul>
                        <div className="card bg-light shadow-none text-center mx-4 my-8">
                            {/* <div className="card-body py-6">
                                <img src="assets/images/background/giftbox.png" alt="dash ui - admin dashboard template" />
                                <div className="mt-4">
                                    <h5>Unlimited Access</h5>
                                    <p className="fs-6 mb-4">
                                        Upgrade your plan from a Free trial, to select Business Plan. Start Now
                                    </p>
                                    <a href="#" className="btn btn-secondary btn-sm">Upgrade Now</a>
                                </div>
                            </div> */}
                        </div>

                    </div>
                </div>
        </div>
        </>
    )
}

export default SidebarSection;