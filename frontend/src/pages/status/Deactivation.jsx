import { useState } from "react";
import API from "../../service/api";

function Deactivation(){
    const[accountID,setAccountId] = useState("");

    const handleSubmit = async(event)=>{
        event.preventDefault();
        if(!accountID){
            alert("Please Enter Account ID");
            return;
        }
        try{
            const response = await API.delete(
                `/customers/${accountID}/delete`
            );
            console.log(response.data);
            alert("Customer Deactivated Successfully!");

            setAccountId("");
        
        }
        catch(error){
            console.error("Deactivating customer error : ",error);
            console.log("Status : ",error.response?.status);
            console.log("Response : ",error.response?.data);
            alert(
                error.response?.data?.detail ||
                "Failed to Deactivate Customer"
            );
        }
    };

    return (
        <div className="collection-page">
            <div className="collection-card">
                <h1>Deactivate Account</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Account Id</label>
                        <div className="form-buttons">
                            <input type="number" 
                            value={accountID}
                            onChange={(event)=>
                                setAccountId(event.target.value)
                            } placeholder="Enter Account ID" />
                        </div>
                    </div>
                    <button type="submit" className="add-customer-button">Deactivate Customer</button>
                </form>
            </div>
        </div>
    );

}

export default Deactivation;