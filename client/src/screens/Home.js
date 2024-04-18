import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Footer from '../components/Footer'
export default function Home() {
    let navigate = useNavigate()
    const storedEmail = localStorage.getItem('userEmail');
    const [inputValue, setInputValue] = useState('');
    const [dataArray, setDataArray] = useState([]);
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };
      const handleDelete = async(index) => {
        try {
          const response = await fetch('http://localhost:5000/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:storedEmail, index: index }),
          });
          const json = await response.json();
          if (json.success) {
            window.location.reload(false);
          } else {
            console.error('Failed to delete item');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      };
      const handleLogOut = async(e) => {
        localStorage.removeItem('userEmail');
        navigate("/login")
      }
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log(storedEmail);
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
          const formattedData = json.data.map(item => ({ value: item, isEditing: false }));
          setDataArray(formattedData); 
          navigate("/");
        }
        else {
          toast.error(json.error);
          navigate("/login");
        }
      };
    
      useEffect(() => {
        loadItems()
      }, [])

      const handleSaveEdit = async (index, value) => {
        try {
          const response = await fetch('http://localhost:5000/edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: storedEmail, index: index, newText: value}),
          });
          const json = await response.json();
          if (json.success) {
            handleToggleEdit(index); // toggle off edit mode
          } else {
            console.error('Failed to update item');
          }
        } catch (error) {
          console.error('Error updating item:', error);
        }
    };

      const handleToggleEdit = (index) => {
        setDataArray(currentData => 
            currentData.map((item, i) => 
                i === index ? { ...item, isEditing: !item.isEditing } : item
            )
        );
    };
    
    const handleChangeItem = (index, newValue) => {
        setDataArray(currentData =>
            currentData.map((item, i) => 
                i === index ? { ...item, value: newValue } : item
            )
        );
    };

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
    if(storedEmail){
  return (
    <div>
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li>
            <span onClick={handleLogOut} className="nav-link">LogOut</span>
          </li>
        </ul>
      </nav>
    </header>
    <div className="box" id="heading">
    <h1>{day}</h1>
</div>
        <div className="box">
        {dataArray.map((item, index) => (
                item.isEditing ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(index, item.value); }}>
                        <input
                            type="text"
                            style={{border:"none", marginLeft:"20px"}}
                            value={item.value}
                            onChange={(e) => handleChangeItem(index, e.target.value)}
                            autoFocus
                        />
                        <button className='submitsave' type="submit">Save</button>
                    </form>
                ) : (
                    <div className="item">
                        <MdDelete onClick={() => handleDelete(index)} />
                        <p>{item.value}</p>
                        <FaEdit className='faedit' onClick={() => handleToggleEdit(index)} />
                    </div>
                )
            ))}
        <form  className="item" onSubmit={handleSubmit}>
            <input onChange={handleInputChange} type="text" name="newItem" placeholder="New Item" className='inputlist' autoComplete="off"></input>
            <button type="submit" name="list" value="">+</button>
        </form>
    </div>
<Footer />
<Toaster />
      </div>
  )
}else{
  return(
    <div className="login-prompt">
    <h2>Please Login Before Using the Todo App</h2>
    <p>You need to be logged in to access this feature.</p>
    <Link to="/login">Login Here</Link>
    <Toaster />
  </div>
  )
}
}