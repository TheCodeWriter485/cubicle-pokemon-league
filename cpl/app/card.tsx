import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Box from 'react-bootstrap/Card';
/*<Offcanvas show={show} onHide={handleClose}> 
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                        <Offcanvas.Body>
                        Some text as placeholder. In real life you can have the elements you
                        have chosen. Like, text, images, lists, etc.
                        </Offcanvas.Body>
                </Offcanvas>*/

export default function Card(props: { name: string, value: number, image: number })
{
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //look up react cards to figure this out. too tired
    return (
        //Box is the container that holds the image, name and point value (point value is to be removed)
        //Box Img is where the image is
        //Box Body is where the text is stored
        //I have the name of the pokemon as a button because I wanna have it so that when you click it the pokemon info shows up with the offcanvas above

        <Box style={{ width: '18rem' }}>
        
            <Box.Img variant="top"  src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+ props.image +".png"} />
            <Box.Body>
                <Button variant="primary" onClick={handleShow} >{props.name}</Button>
                
                <Box.Text>{props.value}</Box.Text>
            </Box.Body>
        </Box>
    );
}