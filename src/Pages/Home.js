import React, {useState, useEffect, useRef,useCallback } from "react";
import {Switch ,Route,useHistory,Link} from 'react-router-dom';
import Background from '../components/Canvas/Canvas';
import FaceDetect from '../components/FaceDetect/FaceDetect';
import Webcam from "react-webcam";
import "./Home.css";
import Clarifai from 'clarifai';
import FileUpload from 'react-file-base64';
const app = new Clarifai.App({
    apiKey: 'c7421c30fec44fea8e94ec38ac860553'
   });
const Home = ()=>{
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [imgDis,setImgDis] = useState(null);
    const [box,setBox] = useState([]); 
    const [bxheight,setbxheight] = useState(0);
    const [bxwidth,setbxwidth] = useState(0);
    const [x,setX] = useState(0);
    const [y,setY] = useState(0);
    const [loaded,setLoaded] = useState(1);
    const [msg,setMsg] = useState("");
    const [totalFace,setTotalFace] = useState(0);
    const videoConstraints = {
        frameRate: 60
    }
   
     
    // setting up image src for display and api 
    const displayImage = (e) =>{
           setImgSrc(e.target.value);
           setImgDis(e.target.value);
    }
   // setting via upload 

    const displayUpload = (files) => {
        setImgSrc(files.base64);
        setImgDis(files.base64.replace('data:image/jpeg;base64,','')); 
    }
    // setting src using screenshot from webCam 

    const capture =useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setImgDis(imageSrc.replace('data:image/jpeg;base64,',''));
        
    },[webcamRef]);

    useEffect(()=>{
        console.log("here");
    },[imgSrc]);
  
    // to get the boxsize of image and coordinates of top left point fn as prop
   const getImageSize = (e) =>{
          setbxwidth(e.target.width);
          setbxheight(e.target.height);
          var domRect = document.getElementById('img-result').getBoundingClientRect();
          setX(domRect.x);
          setY(domRect.y);
         
   }
   
  const detect = () =>{ 
     setLoaded(0);   
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", imgDis)
    .then(response =>
    {   setLoaded(1);
        var arrLength = response.outputs[0].data.regions.length;
        var arrBox = [];
        
        for(var i=0;i<arrLength;i++){
        const faceBox = response.outputs[0].data.regions[i].region_info.bounding_box;
        var  obj = {};
        if(window.innerWidth> 640 ){
		
			obj.rightCol = (1-faceBox.right_col)*bxwidth+(window.innerWidth*0.6 -bxwidth)*0.5;
			obj.leftCol = x+bxwidth*faceBox.left_col;
			obj.topRow =  y+bxheight*faceBox.top_row;
			obj.bottomRow = (1-faceBox.bottom_row)*bxheight+window.innerHeight*0.4+(window.innerHeight*0.6 - bxheight)*0.5;
	       
           

        }else{
           
                obj.rightCol = (1-faceBox.right_col)*bxwidth+(window.innerWidth -bxwidth)*0.5;
                obj.leftCol = x+bxwidth*faceBox.left_col;
                obj.topRow =  y+bxheight*faceBox.top_row;
                obj.bottomRow = (1-faceBox.bottom_row)*bxheight+window.innerHeight*0.12+(window.innerHeight*0.6 - bxheight)*0.5;
               
        }
       
        arrBox.push(obj);
      }
        console.log(box);
        setBox(arrBox);
        setTotalFace(arrLength);
        console.log(box);

        setMsg("Hurrah !! Found Detective !!");
    },
    function(err) {
        console.log("Error occured");
        setMsg("Oops .. something went Wrong ! Try Again Ahh !!");
        setLoaded(1);
     }
);   
    
    }
    const deleteHandler = (e) =>{
        setImgSrc({});
        setImgSrc(null);
        setImgDis(null);
        setLoaded(1);  
        setMsg("");  
        setBox([]);
        setTotalFace(0);
    }

    return(
    <div className="parent">
       <Background />
       <div className="container">
           <div className="flex-item-left">
               <div className="container container-options">
                   <div className="field">
                <Route path="/" exact>
                <input type="text" id ="fname"  className="border-gradient border-gradient-purple"onChange= {displayImage} name="fname" placeholder="Please Enter Image URL" />
                </Route>
                <Route path="/upload" exact>
               <div className="file-upload"> <FileUpload  onDone={ displayUpload} /> </div>
                
                </Route>
                <Route path="/capture" exact>
                   <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    />
                    <button className ="capture" onClick={capture}>Capture</button>
                </Route>
               
                   </div>
                   <div onClick ={detect} className="options detect">Detect</div>
                 <Link to="/">  <div onClick={deleteHandler}  className="options" >Image URL</div>   </Link>
                 <Link to="/upload">  <div onClick={deleteHandler} className="options">Upload</div>   </Link>
                 <Link to="/capture">  <div onClick={deleteHandler} className="options">WebCam</div>   </Link>
               </div>
           </div>
           <div className="flex-item-right">
               <div className="container-options container-options-right">
                  
                   <div className="right-flex">
                  <FaceDetect isLoaded = {loaded} imgSrc={(imgSrc==null)?null:imgSrc} imageSize = {getImageSize} box = {box}  />
                   </div>
                   <div className="right-flex-bottom">
                     <h4 style={{color:'white',margin:'auto auto'}}>{msg}</h4>
                     <h4 style={{color:'white',margin:'auto auto'}}>Total Face: {totalFace}</h4>
                     
                   </div>
                  
                  
               </div>
           
           </div>
       </div>
      
    </div>
    );

}

export default Home;