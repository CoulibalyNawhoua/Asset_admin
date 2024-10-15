import {Routes as Switch, Route} from 'react-router-dom';
import LoginPage from './modules/auth/Login';
import DashboardPage from './modules/pages/Home';
import CategoriePage from './modules/pages/settings/Category';
import MarquesPage from './modules/pages/settings/Marques';
import ModelesPage from './modules/pages/settings/Modele';
import ComptePage from './modules/pages/cores/Compte';
import RolePage from './modules/pages/cores/Role';
import PermissionPage from './modules/pages/cores/Permission';
import CanalPage from './modules/pages/settings/Canal';
import ZonePage from './modules/pages/settings/Zone';
import TerritoirePage from './modules/pages/settings/Territoire';
import PointDeVentePage from './modules/pages/settings/PointDeVente';
import FournisseurPage from './modules/pages/settings/Founisseur';
import EntrepotPage from './modules/pages/settings/Entrepot';
import CreateCompte from './modules/composants/createCompte';
import MaterielPage from './modules/pages/settings/Materiel';
import CreateMaterielComponent from './modules/composants/createMateriel';
import ImportMateriel from './modules/pages/materiels/importMateriel';
import ViewsUser from './modules/composants/viewUsers';
import UsersPage from './modules/pages/cores/utilisateurs';
import ViewsSociete from './modules/composants/viewSocietes';
import CreateUsers from './modules/composants/createUsers';
import DetailViewMateriel from './modules/pages/materiels/view_page_materiel';
import UpdatePageMateriel from './modules/pages/materiels/update_page_materiel';
import TransfertPageMateriel from './modules/pages/materiels/transfert_page_materiel';
import CreateTransfertPage from './modules/pages/materiels/create_transfert_page';
import ViewTransfertMaterielPage from './modules/pages/materiels/view_transfert_page';
import DeployeMaterielPage from './modules/pages/materiels/deploy_materiel_page';
import DeclacementMaterielPage from './modules/pages/materiels/declasse_materiel_page';
import MaterielEnAttenteDeTraitement from './modules/pages/materiels/waiting_materiel_page';
import InStockMaterielPage from './modules/pages/materiels/inStock_materiel_page';
import AffectationListPage from './modules/pages/affectations/affectations_list_page';
import CreateDemandeAffectationWebApp from './modules/pages/affectations/create_affectation_web_app_page';
import SecteurPage from './modules/pages/settings/secteur_page';
import PointDeVenteDistriforcePage from './modules/pages/distriforce/point_of_sale_list';
import ViewAffectationDemandePage from './modules/pages/affectations/view_affectation_demande_page';
import AffectMaterielEnAttenteList from './modules/pages/affectations/affect_materiel_en_cours_page';
import AffectMaterielEnCoursView from './modules/pages/affectations/affect_materiel_en_cours_view';
import ValidateRsmAskDemandePage from './modules/pages/affectations/validate_rsm_ask_affect_page';
import ViewAffectationRsmValidatePage from './modules/pages/affectations/view_rsm_validate_affect';
import ValidateAsmAskDemandePage from './modules/pages/affectations/validate_asm_ask_affect_page';
import ViewAffectationAsmValidatePage from './modules/pages/affectations/view_asm_validate_affect';
import ValidateTmAskDemandePage from './modules/pages/affectations/validate_tm_ask_affect_page';
import ViewAffectationTmValidatePage from './modules/pages/affectations/view_tm_validate_affect';
import ListTourneeDeploiementPage from './modules/pages/deploiements/tournees/list_tournee_page';
import CreateTourneeDeploiementPage from './modules/pages/deploiements/tournees/create_tour_deploiement_page';
import VewListDeploiement from './modules/pages/deploiements/tournees/view_list_deploiement';
import ListVehiculeTransportPage from './modules/pages/deploiements/vehicules/list_vehicule_transport';
import StockByMaterielPage from './modules/pages/materiels/stock_by_depot_page';
import DepotPageMateriel from './modules/pages/materiels/list_materiel_by_depot';
import CreateRolePage from './modules/pages/cores/create_role_page';
import EditRolePage from './modules/pages/cores/edit_role_page';
import EditUserInfo from './modules/pages/cores/edit_user_info';
import TemplateContratAffectation from './modules/pages/settings/template_contrat';
import EditFournisseurComponent from './modules/pages/settings/edit_fournisseur_page';
import ContratEnCoursPage from './modules/pages/affectations/contrats/contrat_encours';
import HistoriqueContrat from './modules/pages/affectations/contrats/historique_contrat';
import ReparateurUserList from './modules/pages/interventions/reparateurs_user';
import CreateReparateurUser from './modules/pages/interventions/create_reparateur_user';
import VewPageReparateur from './modules/pages/interventions/view_reparateur_page';
import UpdateReparateurUser from './modules/pages/interventions/update_reparateur_user';
import InterventionPageList from './modules/pages/interventions/intervention_index_page';
import CreateInterventionPage from './modules/pages/interventions/create_intervention_page';
import ViewInterventionPage from './modules/pages/interventions/view_intervention_page';
import CapacitePage from './modules/pages/settings/Capacity';
import StockMaterielPage from './modules/pages/materiels/StockMaterielPage';
import ImportPageMateriel from './modules/pages/materiels/file_materiel_import';
import StockByArticle from './modules/pages/materiels/stock_by_materiel';
import UpdateTourneeDeploiementPage from './modules/pages/deploiements/tournees/update_tour_deploiement_page';
import DevisPageList from './modules/pages/interventions/liste_devis_page';
import FacturePageList from './modules/pages/interventions/liste_facture_page';
import SocieteUserPage from './modules/pages/cores/myusers';
import CreateWithoutAdminUsers from './modules/composants/createUserWithoutSuperadmin';
import StockDepotPage from './modules/pages/materiels/StockDepotPage';
import TransfertDepotPage from './modules/pages/materiels/transfert_depot_page';
import CreatePdvComponent from './modules/composants/createPdv';
import VewPagePointDeVente from './modules/pages/settings/view_pdv_page';

function Main(){
    return (
        <div>
            <Switch>
                <Route path='/' element={ <LoginPage /> } />
                <Route path='/tableau-de-bord' element={ <DashboardPage /> } />
                <Route path='/settings/category' element={ <CategoriePage /> } />
                <Route path='/settings/marques' element={ <MarquesPage /> } />
                <Route path='/settings/modeles' element={ <ModelesPage /> } />
                <Route path='/settings/canals' element={ <CanalPage /> } />
                <Route path='/settings/zones' element={ <ZonePage /> } />
                <Route path='/settings/territoires' element={ <TerritoirePage /> } />

                <Route path='/settings/point-de-vente' element={ <PointDeVentePage /> } />
                <Route path='/add-pointdevente' element={ <CreatePdvComponent /> } />
                <Route path='/pointdevente/:uuid' element={ <VewPagePointDeVente /> } />

                <Route path='/settings/fournisseurs' element={ <FournisseurPage /> } />
                <Route path='/settings/entrepot' element={ <EntrepotPage /> } />
                <Route path='/settings/capacites-list' element={ <CapacitePage /> } />

                <Route path='/fournisseur-edit/:uuid' element={ <EditFournisseurComponent /> } />

                <Route path='/materiels/list' element={ <MaterielPage /> } />
                <Route path='/materiel/create' element={ <CreateMaterielComponent /> } />
                <Route path='/materiel/files-import' element={ <ImportMateriel /> } />
                <Route path='/materiel/:uuid' element={ <DetailViewMateriel /> } />
                <Route path='/update-materiel/:uuid' element={ <UpdatePageMateriel /> } />
                <Route path='/materiels/deployes' element={ <DeployeMaterielPage /> } />
                <Route path='/materiels/declasses' element={ <DeclacementMaterielPage /> } />
                <Route path='/materiels/en-attente-affectation' element={ <MaterielEnAttenteDeTraitement /> } />
                <Route path='/materiels/en-stocks' element={ <InStockMaterielPage /> } />
                <Route path='/materiels/stock-by-depots' element={ <StockByMaterielPage /> } />
                <Route path='/stock-by-depots/:uuid/:depotLibelle' element={ <DepotPageMateriel /> } />

                <Route path='/stock-materiels' element={ <StockMaterielPage /> } />
                <Route path='/stocks-depot' element={ <StockDepotPage /> } />
                <Route path='/file-import-list-materiels' element={ <ImportPageMateriel /> } />
                <Route path='/stock-by-article/:uuid' element={ <StockByArticle /> } />

                <Route path='/materiels/tranfert-list' element={ <TransfertPageMateriel /> } />
                <Route path='/tranfert-depot-list' element={ <TransfertDepotPage /> } />
                <Route path='/transfert/create' element={ <CreateTransfertPage /> } />
                <Route path='/tranfert-detail/:uuid' element={ <ViewTransfertMaterielPage /> } />


                <Route path='/cores/users-comptes' element={ <UsersPage /> } />
                <Route path='/cores/users-societe' element={ <SocieteUserPage /> } />
                <Route path='/cores/comptes' element={ <ComptePage /> } />
                
                <Route path='/create-societes' element={ <CreateCompte /> } />
                <Route path='/create-users' element={ <CreateUsers /> } />
                <Route path='/all-create-users' element={ <CreateWithoutAdminUsers /> } />
                <Route path='/edit-users-info/:uuid' element={ <EditUserInfo /> } />

                <Route path='/users/:userId/view' element={ <ViewsUser /> } />
                <Route path='/socite-view/:uuid' element={ <ViewsSociete /> } />
                <Route path='/cores/roles' element={ <RolePage /> } />
                <Route path='/cores/permissions' element={ <PermissionPage /> } />
                <Route path='/create-role-page' element={ <CreateRolePage /> } />
                <Route path='/edit-role-page/:role_id' element={ <EditRolePage /> } />

                <Route path='/affectations/list' element={ <AffectationListPage /> } />
                <Route path='/affectations/create' element={ <CreateDemandeAffectationWebApp /> } />
                <Route path='/affectations/:uuid' element={ <ViewAffectationDemandePage /> } />

                <Route path='/affect-rsm-en-attente' element={ <ValidateRsmAskDemandePage /> } />
                <Route path='/affect-rsm-en-attente/:uuid' element={ <ViewAffectationRsmValidatePage /> } />
                <Route path='/affect-asm-en-attente' element={ <ValidateAsmAskDemandePage /> } />
                <Route path='/affect-asm-en-attente/:uuid' element={ <ViewAffectationAsmValidatePage /> } />
                <Route path='/affect-tm-en-attente' element={ <ValidateTmAskDemandePage /> } />
                <Route path='/affect-tm-en-attente/:uuid' element={ <ViewAffectationTmValidatePage /> } />

                <Route path='/affect-materiel-en-attente' element={ <AffectMaterielEnAttenteList /> } />
                <Route path='/affect-materiel-en-attente/:uuid' element={ <AffectMaterielEnCoursView /> } />

                <Route path='/secteurs/list' element={ <SecteurPage /> } />

                <Route path='/distriforce/pdv-list' element={ <PointDeVenteDistriforcePage /> } />

                <Route path='/tournee-deploiements-list' element={ <ListTourneeDeploiementPage /> } />
                <Route path='/tournee-deploiements-create' element={ <CreateTourneeDeploiementPage /> } />
                <Route path='/tournee-deploiements-views/:uuid' element={ <VewListDeploiement /> } />
                <Route path='/tournee-deploiements-update/:uuid' element={ <UpdateTourneeDeploiementPage /> } />

                <Route path='/vehicule-transport-list' element={ <ListVehiculeTransportPage /> } />

                <Route path='/contrat-template-affectation' element={ <TemplateContratAffectation /> } />
                <Route path='/contrat-en-cours-list' element={ <ContratEnCoursPage /> } />
                <Route path='/contrat-historique-list' element={ <HistoriqueContrat /> } />

                <Route path='/list-reparateurs' element={ <ReparateurUserList /> } />
                <Route path='/create-reparateurs' element={ <CreateReparateurUser /> } />
                <Route path='/view-reparateur-info/:uuid' element={ <VewPageReparateur /> } />
                <Route path='/update-reparateur-info/:uuid' element={ <UpdateReparateurUser /> } />
                <Route path='/interventions-list' element={ <InterventionPageList /> } />
                <Route path='/create-interventions' element={ <CreateInterventionPage /> } />
                <Route path='/views-intervention/:uuid' element={ <ViewInterventionPage /> } />

                <Route path='/list-devis-intervention' element={ <DevisPageList /> } />
                <Route path='/list-factures-intervention' element={ <FacturePageList /> } />

            </Switch>
        </div>
    )
}


export default Main;