import "../../App.css";
import { useEffect, useState } from "react";
import API from "../../service/api";

function PersonalDetailsShow(){
    const [personalDetails, setPersonalDetials] = useState([]);

    useEffect(()=>{
        getPersonalDetails();
    },[]);
    const getPersonalDetails = async() =>{
        try{
            const resposnse =await API.get("/personal_details/read")
            console.log(resposnse.data)

            setPersonalDetials(resposnse.data)
        }
        catch(error){
            console.error("Error fetching Customers personal Details : ", error);
        }
    };

    return (
        <div>
            <h1 className="color">Personal Details</h1>

            <h2>Active Customers Personal Details</h2>

            <br />

            <table>
                <thead>
                    <tr>
                        <th>Account_ID</th>
                        <th>Aadhaar Number</th>
                        <th>Address</th>
                        <th>Pincode</th>
                        
                    </tr>
                </thead>
            <tbody className="tablecolor">
                {personalDetails.map((personaldetails)=>(
                    <tr key={personaldetails.account_id}>
                        <td>{personaldetails.account_id}</td>
                        <td>{personaldetails.aadhaar_no}</td>
                        <td>{personaldetails.address}</td>
                        <td>{personaldetails.pincode}</td>
                        
                    </tr>
                ))}
            </tbody>
            </table>
            <div
                    style={{
                        marginTop: "15px",
                        fontWeight: "600"
                    }}
                >
                    Total Personal Details : {personalDetails.length}
                </div>
        </div>
    );
}

export default PersonalDetailsShow;