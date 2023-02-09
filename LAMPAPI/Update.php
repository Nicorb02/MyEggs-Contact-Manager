<?php
	$inData = getRequestInfo();
	
	$id = $inData["id"];

	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
	$phone = $inData["phone"];
	$email = $inData["email"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID = ? ");
		$stmt->bind_param("ssssi", $firstname, $lastname, $phone, $email, $id);
		$stmt->execute();
		$stmt->close();	
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>