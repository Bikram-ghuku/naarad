import { Component, createSignal, onMount } from "solid-js";
import { BACKEND_URL } from "../constants";
import { Spinner } from "../components/Spinner";
import check from "../assets/check.png"
import cross from "../assets/cross.png"

export const Register: Component = () => {
    const [getStatus, setStatus] = createSignal("Initiating User Registration");
    const [getMsg, setMsg] = createSignal("");
    const [getIsLoad, setIsLoad] = createSignal(true)
    const [getIsErr, setIsErr] = createSignal(false)
    
    
    onMount(() => {
        fetch(BACKEND_URL+'/register', {
            method:"GET",
            credentials: 'include'
        }).then((data) => {
            if(data.ok){
                setIsLoad(false);
                setStatus("User Registration Successful")
                setMsg("Credentials sent to your institute email")

                setTimeout(() => {
                    document.location = "https://naarad.metakgp.org/login"
                }, 3000);
            }
            else if(data.status === 409){
                setIsLoad(false);
                setStatus("User Already Registered")
                setMsg("Search your institute email for credentials")

                setTimeout(() => {
                    document.location = "https://naarad.metakgp.org"
                }, 3000);
            }
            else if(data.status == 401){
                setIsLoad(true);
                setStatus("Redirecting to Heimdall")

                document.location = "https://heimdall.metakgp.org?redirect_url=https://naarad.metakgp.org/signup"
            }
            else {
                setIsLoad(false);
                setIsErr(true)
                setStatus("Failed to Register User")
                data.text().then((bodyData) => {
                    setMsg(bodyData)
                })
            }
        }).catch((err) => {
            setIsLoad(false);
            setIsErr(true)
            setStatus("Failed to Register User")
            setMsg(err.toString())
        })
    })

    return (
        <div class="reg">
            <div class="reg-main">
                <div class="reg-title">
                    <div class="reg-title-name">
                        Naarad
                    </div>
                    <div class="reg-title-desc">
                        Delivering real-time notices to KGPians
                    </div>
                </div>
                <div class="reg-status">
                    <div class="reg-status-svg">
                        {getIsLoad() == true ? <Spinner /> : (getIsErr() == true ? <img src={cross}/> : <img src={check} />)}
                    </div>
                    <div class="reg-status-title">{getStatus()}</div>
                    <div class="reg-status-text">{getMsg()}</div>
                </div>
                <div class="reg-footer">
                    <h3 class="reg-footer">Made with ❤️ and {"</>"} by <a href="https://github.com/metakgp/naarad" target="_blank">Metakgp</a></h3>
                </div>
            </div>
        </div>
    )
}