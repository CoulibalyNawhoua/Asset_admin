import { useEffect, useState } from "react";
import BaseUrl from "../../utils/BaseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const url = BaseUrl();
function LoginPage(){
  const [isAuthToken, setIsAuthToken] = useState(localStorage.getItem('_token_'));
  const [msgerrorAlert,setMsgerrorAlert] = useState('');
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    'email':'',
    'password':''
  });

  useEffect(()=>{
    if(isAuthToken !== null){
      navigate('/tableau-de-bord');
    }
},[isAuthToken]);

  const handleChange=(event)=>{
    setLoginData({
        ...loginData,
        [event.target.name] : event.target.value
    });
  }

  const submitLogin=async (e)=>{
    e.preventDefault(); 

    setLoading(true);
    setMsgerrorAlert('');
    if(loginData.email !== "" && loginData.password !==""){
      const _formData = new FormData();
        _formData.append('email',loginData.email);
        _formData.append('password',loginData.password);
        console.log(_formData);

        try {
          await axios.post(url.base+'/login',_formData,{
              headers:{
                  'Content-Type':'application/json',
                  "Authorization": `Bearer ${isAuthToken}`
                  
              },
              credentials:'include'
          }
          ).then((resp)=>{
              setLoading(false);
              if(resp.status == 200){                  
                  localStorage.setItem('_token_',resp.data.authorisation.token);
                  navigate('/tableau-de-bord');
                  window.location.reload();
              }
          })
      } catch (error) {
        console.log(error);
        setLoading(false);
          if (error?.response?.status == 401) {
              setMsgerrorAlert(error?.response?.data?.error);
          }else{
              setMsgerrorAlert("Un problème est subvenu !");
          }
      }
    }

  }

  const send_sms=()=>{
    try {
      axios.get(url.base+'/sms-send',
          {
              headers:{
                  'Content-Type':'application/json',
                  "Authorization": `Bearer ${localStorage.getItem('_token_')}`                                
              },
          }
      ).then((resp)=>{
          console.log(resp.data);  
      })
    } catch (error) {
        console.log(error);
    }
  }


    return (
        <>
            <main class="container d-flex flex-column">
              <div class="row align-items-center justify-content-center g-0
                  min-vh-100">
                <div class="col-12 col-md-8 col-lg-6 col-xxl-4 py-8 py-xl-0">
                  <a href="#" class="form-check form-switch theme-switch btn btn-light btn-icon rounded-circle d-none ">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
            
                    </a>
                  
                  <div class="card smooth-shadow-md">
                      {msgerrorAlert !=="" &&
                        <div class="alert alert-danger" role="alert">
                            <h4 class="alert-heading">Attention !</h4>
                            <p>{msgerrorAlert}</p>
                        </div>
                      }
                    <div class="card-body p-6">
                      <div class="mb-4">
                        {/* <a href="../index.html"><img src="../assets/images/brand/logo/logo-2.svg" class="mb-2 text-inverse" alt="Image" /></a> */}
                        <h4 class="mb-6">Bienvenue sur Asset Management.</h4>
                      </div>
                    
                      <form onSubmit={submitLogin}>
                      
                        <div class="mb-3">
                          <label for="email" class="form-label">Email</label>
                          <input type="email" id="email" class="form-control" name="email" onChange={handleChange} placeholder="Entrez votre email" required />
                        </div>
                        
                        <div class="mb-3">
                          <label for="password" class="form-label">Mot de passe</label>
                          <input type="password" id="password" class="form-control" onChange={handleChange} name="password" placeholder="**************" required />
                        </div>
                      
                        {/* <div class="d-lg-flex justify-content-between align-items-center
                            mb-4">
                          <div class="form-check custom-checkbox">
                            <input type="checkbox" class="form-check-input" id="rememberme" />
                            <label class="form-check-label" for="rememberme">Remember
                                me</label>
                          </div>

                        </div> */}
                        <div>
                          
                          <div class="d-grid">
                            {!loading && <button type="submit" class="btn btn-primary">Se Connecter</button>}
                           {loading &&
                               <button type="button" class="btn btn-primary" disabled>
                                <div class="d-flex justify-content-center p-0">
                                  <div class="spinner-border p-0" role="status">
                                    <span class="visually-hidden p-0">Loading...</span>
                                  </div>
                                </div>
                            </button>
                           }
                           
                          </div>

                          <div class="d-md-flex justify-content-between mt-4">
                            {/* <div class="mb-2 mb-md-0">
                              <a href="sign-up.html" class="fs-5">Create An
                                  Account </a>
                            </div>
                            <div>
                              <a href="forget-password.html" class="text-inherit
                                  fs-5">Forgot your password?</a>
                            </div> */}

                          </div>
                        </div>


                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </main>
        </>
    )
}

export default LoginPage;