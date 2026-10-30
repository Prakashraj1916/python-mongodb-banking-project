import { useState } from "react";
import API from "../../service/api";

function UnblockCustomer(){
    const [accountID, setAccountId]=useState("");
    
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if(!accountID){
            alert("Please Enter Account ID");
            return;
        }
        try{
            const response = await API.put(
                `/customers/${accountID}/unblock`
            );
            console.log(response.data);
            alert("Customer Unblocked Successfully!");

            setAccountId("");
        }catch(error){
            console.error("Unblock Customer error : ",error);

            console.log("Status : ",error.response?.status);
            console.log("Response:",error.response?.data);

            alert(
                error.response?.data?.detail ||
                "Failed to Unblock Customer"
            );

        }
    };
    return(
        <div className="collection-page">
            <div className="collection-card">
            <h1>Unblock Customer</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-group">

                <label>Account ID</label>

                <div className="form-buttons">
                <input type="number"
                value={accountID}
                onChange={(event)=>
                    setAccountId(event.target.value)
                } placeholder="Enter Account ID"/>
                </div>
                </div>
                <button type="submit" className="add-customer-button">Unblock Customer</button>
            </form>
        </div>
        </div>
    );
}

export default UnblockCustomer;