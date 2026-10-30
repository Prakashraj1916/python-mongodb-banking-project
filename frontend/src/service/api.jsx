import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000"
});


const getBalanceRange = async() =>{
    try{
        const response = await API.get("/dashboard/balance-range");

        setBalanceData(response.data);

    }
    catch(error){
        console.log(error);
    }
};

export const downloadExcel = async () => {

    const response = await API.get(
        "/customer/personal_details/download-excel",
        {
            responseType: "blob"
        }
    );

    const blob = new Blob(
        [response.data],
        {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "bank_complete_data.xlsx";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
};


export default API;