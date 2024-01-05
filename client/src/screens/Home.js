import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'
export default function Home() {
    let navigate = useNavigate()
    const storedEmail = localStorage.getItem('userEmail');
    const [inputValue, setInputValue] = useState('');
    const [dataArray, setDataArray] = useState([]);
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };
      const handleDelete = (event) => {
        event.target.form.submit();
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/sendData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: storedEmail, data: inputValue }),
          });
    
          const json = await response.json();
          if (json.success) {
            window.location.reload(false);
          }
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };
    const loadItems= async() => {
        
        const response = await fetch("http://localhost:5000/getItems", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: storedEmail })
    
        });
        const json = await response.json()
        console.log(json);
        if (json.success) {
          setDataArray(json.data); 
          navigate("/")
    
        }
        else {
          alert(json.error)
        }
      };
    
      useEffect(() => {
        loadItems()
      }, [])

    function getDate(){
        var today = new Date();
            var options = {
                weekday :"long",
                day:"numeric",
                month:"long"
            };
            let day = today.toLocaleDateString("en-US",options);    
            return day;
    }
    let day = getDate();
  return (
    <div>
    <div className="box" id="heading">
    <h1>{day}</h1>
</div>
        <div className="box">
        {dataArray.map((item, index) => (
            <form action="/delete" method="post" >              
            <div className="item">
            <input type="checkbox" name="checkbox" value="<%=item._id %>" onChange={handleDelete}></input>
        <p name={index}>{item}</p>
    </div>
    
</form>
 ))}
        <form  className="item" onSubmit={handleSubmit}>
            <input onChange={handleInputChange} type="text" name="newItem" placeholder="New Item" className='inputlist' autoComplete="off"></input>
            <button type="submit" name="list" value="">+</button>
        </form>
    </div>
<Footer />
      </div>
  )
}
