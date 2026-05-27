import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Box from 'react-bootstrap/Card';
import { Modal } from 'react-bootstrap';

export default function Item(props: { name: string, value: number, image: number, desc: string }) {
    const [show, setShow] = useState(false);
    const [showPurchase, setShowPurchase] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handlePurchaseClose = () => setShowPurchase(false);
    const handlePurchaseShow = () => setShowPurchase(true);

    useEffect(() => {
        checkLogin();
    }, [])

    async function checkLogin() {
        const response = await fetch("http://localhost:3030/auth/status", {
            credentials: "include"
        });
        const data = await response.json();
        setLoggedIn(data.loggedin);
        setUsername(data.username); // assumes the auth/status endpoint returns a username
    }

    async function handlePurchase() {
        // Step 1: Check if logged in
        if (!loggedIn) {
            alert("You must be logged in to purchase items.");
            return;
        }

        // Step 2: Fetch all teams and find one matching the logged in user
        const response = await fetch("http://localhost:3030/team");
        const teams = await response.json();
        console.log(teams);
        const userTeam = teams.find((team: any) => team.Username === username);

        console.log("Logged in as:", username);

        if (!userTeam) {
            alert("No team found for your account.");
            return;
        }
        else{
            if(userTeam.Points - props.value > -1){
                const purchaseResponse = await fetch("http://localhost:3030/teamitem/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        team_id: userTeam.id,
                        item: props.name
                    })
                });

                const result = await purchaseResponse.json();

                if (purchaseResponse.ok) {
                     await fetch("http://localhost:3030/team/updatepoints", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            username: username,
                            points: userTeam.Points - props.value
                        })
                    });
                    alert(`${props.name} purchased successfully!`);
                } else {
                    alert("Something went wrong with the purchase.");
                    console.error(result);
                }
            }
        }


        handlePurchaseClose();
    }

    return (
        <Box style={{ width: '18rem' }}>
            <Box.Img
                variant="top"
                src={`/img/${props.image}.png`}
                style={{ width: '25%', height: '25%', objectFit: 'cover' }}
            />
            <Box.Body>
                <Button variant="primary" style={{ marginRight: '8px' }} onClick={handleShow}>{props.name}</Button>
                <Button variant="success" onClick={handlePurchaseShow}>Buy</Button>

                <Box.Text>{props.value}</Box.Text>
            </Box.Body>

            <Modal show={showPurchase} onHide={handlePurchaseClose} className="text-center">
                <Modal.Header closeButton>
                    <Modal.Title>Purchase {props.name}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{props.desc}</p>
                    <p><strong>Price:</strong> {props.value}</p>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: 'center' }} className="gap-2">
                    <Button variant="success" onClick={handlePurchase}>Yes</Button>
                    <Button variant="secondary" onClick={handlePurchaseClose}>No</Button>
                </Modal.Footer>
            </Modal>
        </Box>
    );
}