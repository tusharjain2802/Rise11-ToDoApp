import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'
export default function Home() {
    let navigate = useNavigate()
    const storedEmail = localStorage.getItem('userEmail');
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
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
    
          await response.json();
          
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };
    const loadFoodItems= async() => {
        
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
          
          navigate("/")
    
        }
        else {
          alert(json.error)
        }
      };
    
      useEffect(() => {
        loadFoodItems()
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
    <div class="box" id="heading">
    <h1>{day}</h1>
</div>
        <div class="box">
        
            <form action="/delete" method="post" >              
            <div class="item">
            <input type="checkbox" name="checkbox" value="<%=item._id %>" onChange="this.form.submit()"></input>
        <p></p>
    </div>
    
</form>
        <form  class="item" onSubmit={handleSubmit}>
            <input onChange={handleInputChange} type="text" name="newItem" placeholder="New Item" className='inputlist' autocomplete="off"></input>
            <button type="submit" name="list" value="">+</button>
        </form>
    </div>
<Footer />
      </div>
  )
}
